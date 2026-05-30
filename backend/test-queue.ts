import { agentQueue } from './src/agent/queue';
import db from './src/db/database';

async function run() {
  const sessionId = 'test-queue-full';
  db.prepare('INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?) ON CONFLICT DO NOTHING').run('test-user', 'test', 'test');
  db.prepare('INSERT INTO agents (id, user_id, name, prompt, target_domain) VALUES (?, ?, ?, ?, ?)').run('test-agent-full', 'test-user', 'test', 'test', 'amazon.com');
  db.prepare('INSERT INTO sessions (id, agent_id, status) VALUES (?, ?, ?)').run(sessionId, 'test-agent-full', 'queued');

  await agentQueue.add('execute-agent', {
    sessionId,
    agentId: 'test-agent-full',
    prompt: 'test',
    targetDomain: 'amazon.com',
    stealthLevel: 'standard'
  });
}
run();
