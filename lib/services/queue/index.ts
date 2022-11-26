import type { JobStatus } from '../../types/enums/Queue';
import { localQueue } from '../../queue';
import type { Response } from 'express';
import { httpCodes } from '../../constants/http-status-codes';

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

  static async updateJobStatus(jobId: string, status: JobStatus, res: Response) {
    try {
      await localQueue.updateStatus(status, jobId);
      res.json({
        status
      });
    } catch (err) {
      res.status(httpCodes.notFound).json({
        message: err
      });
    }
  }
}

export {
  QueueService
};