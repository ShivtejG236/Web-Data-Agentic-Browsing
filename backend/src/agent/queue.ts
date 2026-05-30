import { executeAgent } from './orchestrator';

class InMemoryQueue {
  private queue: any[] = [];
  private isProcessing = false;

  async add(name: string, data: any) {
    this.queue.push(data);
    console.log(`[Queue] Job added. Pending jobs: ${this.queue.length}`);
    this.processQueue();
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const jobData = this.queue.shift();
      console.log(`[Worker] Processing Job for session ${jobData.sessionId}`);
      try {
        await executeAgent(
          jobData.sessionId, 
          jobData.agentId, 
          jobData.prompt, 
          jobData.targetDomain, 
          jobData.stealthLevel
        );
        console.log(`[Worker] Job for session ${jobData.sessionId} completed successfully!`);
      } catch (err: any) {
        console.log(`[Worker] Job for session ${jobData.sessionId} failed: ${err.message}`);
      }
    }

    this.isProcessing = false;
  }
}

export const agentQueue = new InMemoryQueue();
