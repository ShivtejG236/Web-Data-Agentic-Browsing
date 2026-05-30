import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import http from 'http';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import db from './db/database';
import { registerConnection } from './agent/orchestrator';
import { authenticateToken, apiRateLimiter, AuthRequest } from './middleware/auth';
import authRoutes from './routes/auth';
import { agentQueue } from './agent/queue';

dotenv.config({ path: '../.env' });

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

app.use(cors());
app.use(express.json());
app.use(apiRateLimiter); // Apply rate limiter globally

// Routes
app.use('/api/auth', authRoutes);

// Get Dashboard Stats (Public for hackathon demo purposes)
app.get('/api/stats', (req, res) => {
  const users = db.prepare('SELECT count(*) as count FROM users').get() as { count: number };
  const agents = db.prepare('SELECT count(*) as count FROM agents').get() as { count: number };
  const sessions = db.prepare('SELECT count(*) as count FROM sessions').get() as { count: number };
  res.json({ users: users.count, agents: agents.count, sessions: sessions.count });
});

// Get Agents (Requires Auth)
app.get('/api/agents', authenticateToken, (req: AuthRequest, res) => {
  const agents = db.prepare('SELECT * FROM agents WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json(agents);
});

// Launch an Agent (Requires Auth, deducts tokens, queues job)
app.post('/api/agents/launch', authenticateToken, async (req: AuthRequest, res) => {
  const { name, prompt, targetDomain, stealthLevel } = req.body;
  const userId = req.user.id;

  // Check token balance
  const userRecord = db.prepare('SELECT tokens FROM users WHERE id = ?').get(userId) as { tokens: number };
  if (!userRecord || userRecord.tokens < 5) {
    return res.status(402).json({ error: 'Insufficient tokens. 5 tokens required per agent run.' });
  }

  // Deduct tokens
  db.prepare('UPDATE users SET tokens = tokens - 5 WHERE id = ?').run(userId);

  const agentId = uuidv4();
  const sessionId = uuidv4();

  db.prepare('INSERT INTO agents (id, user_id, name, prompt, target_domain, stealth_level, status) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(agentId, userId, name, prompt, targetDomain, stealthLevel, 'queued');

  db.prepare('INSERT INTO sessions (id, agent_id, status) VALUES (?, ?, ?)')
    .run(sessionId, agentId, 'queued');

  // Enqueue job to BullMQ
  await agentQueue.add('execute-agent', {
    sessionId,
    agentId,
    prompt,
    targetDomain,
    stealthLevel
  });

  res.json({ agentId, sessionId, status: 'queued', message: 'Agent queued successfully. 5 tokens deducted.' });
});

// Get Sessions
app.get('/api/sessions', authenticateToken, (req: AuthRequest, res) => {
  const sessions = db.prepare(`
    SELECT s.*, a.name, a.target_domain 
    FROM sessions s 
    JOIN agents a ON s.agent_id = a.id
    WHERE a.user_id = ?
    ORDER BY s.start_time DESC
  `).all(req.user.id);
  res.json(sessions);
});

// Get single session with result
app.get('/api/sessions/:id', authenticateToken, (req: AuthRequest, res) => {
  const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(session);
});

// WebSockets for Real-time Streaming
wss.on('connection', (ws, req) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const sessionId = url.searchParams.get('sessionId');

  if (sessionId) {
    registerConnection(sessionId, ws);
    ws.send(JSON.stringify({ type: 'connected', message: `Subscribed to session ${sessionId}` }));
  } else {
    ws.close();
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 NemoForge Backend Running on http://localhost:${PORT}`);
});
