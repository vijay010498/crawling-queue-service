import { JobStatus } from '../../types/enums/Queue';
import { queueQueries as QUEUE } from '../queries/queue';
import type { Response } from 'express';
import { httpCodes } from '../../constants/http-status-codes';
import type { Queue as JobType } from '../../types';
import { v4 } from 'uuid';
import { DateTime } from 'luxon';

class QueueService {

  static async enQueueJob(job: JobType, res: Response) {
    try {
      const { job_name, job_url } = job;
      const job_id = v4();
      const jobAdd: JobType = {
        created_at: DateTime.now(),
        job_id,
        job_name,
        job_url,
        status: JobStatus.enqueued,
        updated_at: DateTime.now()
      };
      await QUEUE.enqueue(jobAdd);
      res.json({
        job_id,
        job_name,
        job_status: jobAdd.status,
        message: 'Job Queued successfully'
      });
    } catch (err) {
      res.status(httpCodes.serverError).json({
        message: err,
      });
    }
  }

  static async jobsByStatus(status: JobStatus, res: Response) {
    try {
      const jobs = await QUEUE.getByStatus(status);
      res.json({
        jobs,
      });
    } catch (err) {
      res.status(httpCodes.notFound).json({
        message: err,
      });
    }
  }

  static async deQueueJob(res: Response) {
    try {
      const job = await QUEUE.dequeue();
      res.json({
        job
      });
    } catch (err) {
      res.status(httpCodes.serverError).json({
        message: err,
      });
    }
  }

  static async updateJobStatus(jobId: string, status: JobStatus, res: Response) {
    try {
      await QUEUE.updateStatus(status, jobId);
      res.json({
        jobId,
        status
      });
    } catch (err) {
      res.status(httpCodes.notFound).json({
        jobId,
        message: err
      });
    }
  }
}

export {
  QueueService
};