import type { Queue as QueueType } from '../types';
import type { JobStatus } from '../types/enums/Queue';

class Queue {
  public queue: QueueType[];
  constructor() {
    this.queue = [];
  }
  enqueue(item: QueueType): void {
    this.queue.push(item);
  }
  dequeue(): QueueType | undefined | null | [] {
    if (!this.queue.length)
      return [];

    return this.queue.shift();
  }
  getByStatus(status: JobStatus): QueueType[] | QueueType | null {
    return this.queue.filter(item => item.status === status);
  }
  updateStatus(status: JobStatus, job_id: string): boolean {
    let index = -1;
    this.queue.filter((item, i) => {
      if (item.job_id === job_id) {
        index = i;
        return;
      }
    });
    if (index === -1)
      return false;

    this.queue[index].status = status;
    return true;
  }
}

export const localQueue = new Queue();