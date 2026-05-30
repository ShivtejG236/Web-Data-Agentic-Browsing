import { executeAgent } from './src/agent/orchestrator';

async function run() {
  console.log("Running executeAgent on amazon.com...");
  await executeAgent('test-amazon', 'test-agent', 'test', 'amazon.com', 'standard');
  console.log("Finished executeAgent!");
}

run().catch(console.error);
