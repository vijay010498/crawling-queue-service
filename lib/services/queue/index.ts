import type { JobStatus } from '../../types/enums/Queue';
import { localQueue } from '../../queue';
import type { Response } from 'express';

class QueueService {
  static jobsByStatus(status: JobStatus, res: Response) {
    const jobs = localQueue.getByStatus(status);
    res.json({
      jobs,
    });
  }

  static enqueueJob(res: Response) {
    const job = localQueue.dequeue();
    res.json({
      job
    });
  }
}

export {
  QueueService
};