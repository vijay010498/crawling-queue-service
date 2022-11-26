import type { Request, Response } from 'express';
import { HealthService } from '../services/health';
import { QueueService } from '../services/queue';
import type { JobStatus } from '../types/enums/Queue';

class CrawlingQueueServiceController {
  static health(req: Request, res: Response) {
    HealthService.exec(res);
  }

  static jobsByStatus(req: Request, res: Response) {
    const { params: { status } } = req;
    return QueueService.jobsByStatus(<JobStatus>status, res);
  }

  static enqueueJob(req: Request, res: Response) {
    return QueueService.enqueueJob(res);
  }

  static updateJobStatus(req: Request, res: Response) {
    const { params: { status, jobId } } = req;
    return QueueService.updateJobStatus(jobId, <JobStatus>status, res);
  }
}

export {
  CrawlingQueueServiceController
};