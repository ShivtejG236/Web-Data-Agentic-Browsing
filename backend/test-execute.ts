import { executeAgent } from './src/agent/orchestrator';

async function run() {
  console.log("Running executeAgent with advanced...");
  await executeAgent('test-session-3', 'test-agent', 'test', 'example.com', 'advanced');
  console.log("Finished executeAgent!");
}

run().catch(console.error);
