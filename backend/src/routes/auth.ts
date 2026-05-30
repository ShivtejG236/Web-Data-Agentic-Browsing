import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/database';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here';

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // For hackathon, allow auto-registration/mock login
  const mockUserId = 'user-1';
  db.prepare('INSERT OR IGNORE INTO users (id, username, password_hash, tokens) VALUES (?, ?, ?, ?)')
    .run(mockUserId, username || 'demo_user', 'hash', 100);

  const token = jwt.sign({ id: mockUserId, username: username || 'demo_user' }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: mockUserId, username: username || 'demo_user' } });
});

router.get('/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });

  try {
    const user = jwt.verify(token, JWT_SECRET) as any;
    const dbUser = db.prepare('SELECT id, username, tokens FROM users WHERE id = ?').get(user.id);
    res.json(dbUser);
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
});

export default router;
