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

  static deQueueJob(req: Request, res: Response) {
    return QueueService.deQueueJob(res);
  }

  static enQueueJob(req: Request, res: Response) {
    const { body: { job_name, job_url } } = req;
    return QueueService.enQueueJob(job_name, job_url, res);
  }

  static updateJobStatus(req: Request, res: Response) {
    const { params: { status, jobId } } = req;
    return QueueService.updateJobStatus(jobId, <JobStatus>status, res);
  }
}

export {
  CrawlingQueueServiceController
};