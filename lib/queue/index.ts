import type { Queue as QueueType } from '../types';
import type { JobStatus } from '../types/enums/Queue';

class Queue {
  public queue: QueueType[];

  constructor() {
    this.queue = [];
  }

  enqueue(job: QueueType): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this.queue.push(job);
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  dequeue(): Promise<QueueType | undefined | null | []> {
    return new Promise((resolve, reject) => {
      try {
        if (!this.queue.length)
          return resolve([]);
        return resolve(this.queue.shift());
      } catch (err) {
        reject(err);
      }
    });
  }


  getByStatus(status: JobStatus): Promise< QueueType[] | QueueType | null> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this.queue.filter(item => item.status === status));
      } catch (err) {
        reject(err);
      }
    });
  }

  updateStatus(status: JobStatus, job_id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let index = -1;
      this.queue.forEach((item, i) => {
        if (item.job_id === job_id) {
          index = i;
          return;
        }
      });
      if (index === -1)
        reject('Job Not Found');


      this.queue[index].status = status;
      resolve(true);
    });
  }
}

export const localQueue = new Queue();
