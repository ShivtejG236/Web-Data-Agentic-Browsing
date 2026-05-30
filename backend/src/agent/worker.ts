import { Worker } from 'bullmq';
import { executeAgent } from './orchestrator';

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
};

console.log('👷 Worker process started, waiting for jobs...');

export const agentWorker = new Worker('agentQueue', async job => {
  const { sessionId, agentId, prompt, targetDomain, stealthLevel } = job.data;
  console.log(`[Worker] Processing Job ${job.id} for session ${sessionId}`);
  
  await executeAgent(sessionId, agentId, prompt, targetDomain, stealthLevel);
  
}, { connection: redisConfig });

agentWorker.on('completed', job => {
  console.log(`[Worker] Job ${job.id} has completed!`);
});

agentWorker.on('failed', (job, err) => {
  console.log(`[Worker] Job ${job?.id} has failed with ${err.message}`);
});
