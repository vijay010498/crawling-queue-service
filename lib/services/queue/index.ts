import { JobStatus } from '../../types/enums/Queue';
import { queueQueries as QUEUE } from '../queries/queue';
import type { Response } from 'express';
import { httpCodes } from '../../constants/http-status-codes';
import type { Queue as JobType } from '../../types';
import { v4 } from 'uuid';
import { DateTime } from 'luxon';

class QueueService {

  static async enQueueJob(job_name: string, job_url: URL, res: Response) {
    try {
      const job_id = v4();
      const jobAdd: JobType = {
        created_at: DateTime.now(),
        job_id,
        job_name,
        job_url,
        status: JobStatus.enqueued,
        updated_at: DateTime.now(),
        locked: false,
        retry_count: 0
      };
      await QUEUE.enqueue(jobAdd);
      console.log(`Job Added into the queue, job_id:${job_id}, job_name:${job_name}`);
      res.json({
        job_id,
        job_name,
        job_status: jobAdd.status,
      });
    } catch (err) {
      console.log('Adding Job failed', err);
      res.status(httpCodes.serverError).json({
        message: err,
      });
    }
  }

  static async jobsByStatus(status: JobStatus, res: Response) {
    try {
      const jobs = await QUEUE.getByStatus(status);
      console.log(`Jobs Requested By status:${status}`);
      res.header('Access-Control-Allow-Origin', '*').json({
        jobs,
      });
    } catch (err) {
      console.log(`Jobs Requested By status:${status} Error`, err);
      res.status(httpCodes.notFound).json({
        message: err,
      });
    }
  }

  static async deQueueJob(res: Response) {
    try {
      const job: any = await QUEUE.dequeue();
      if (!Object.keys(job).length)
        console.log('No Jobs to dequeue');
      else
        console.log(`Job dequed, job_id: ${job.job_id}, job_name: ${job.job_name}, attempts: ${job.retry_count}`);


      res.json({
        job
      });
    } catch (err) {
      console.log('Job Dequeue Failed', err);
      res.status(httpCodes.serverError).json({
        message: err,
      });
    }
  }

  static async updateJobStatus(jobId: string, status: JobStatus, res: Response) {
    try {
      await QUEUE.updateStatus(status, jobId);
      console.log(`Job status updated to ${status}, job_id: ${jobId}`);
      res.json({
        jobId,
        status
      });
    } catch (err) {
      console.log('Job status update Failed', err);
      res.status(httpCodes.notFound).json({
        jobId,
        message: err
      });
    }
  }

  static async enqueueRandomJobs(res: Response) {
    try {
      const job_urls: any = [
        'https://www.flaconi.de/pflege/dr-barbara-sturm/baby-and-kids/dr-barbara-sturm-baby-and-kids-baby-bum-cream-babykoerpercreme.html#sku=80055471-75',
        'https://www.flaconi.de/pflege/nuxe/reve-de-miel/nuxe-reve-de-miel-zartschmelzender-honig-oelbalsam-fuer-den-koerper-koerperbalsam.html#sku=80044283-200',
        'https://www.flaconi.de/pflege/skindivision/10-azelaic-acid/skindivision-10-azelaic-acid-serum-in-cream-gesichtscreme.html#sku=80073748-30',
        'https://www.flaconi.de/pflege/skindivision/10-azelaic-acid/skindivision-10-azelaic-acid-serum-in-cream-gesichtscreme.html#sku=80073748-30',
        'https://www.flaconi.de/pflege/skindivision/10-azelaic-acid/skindivision-10-azelaic-acid-serum-in-cream-gesichtscreme.html#sku=80073748-30'
      ];
      const enqueueJobsPromises = [];
      for (let i = 0; i < 50; i++) {
        const jobAdd: JobType = {
          created_at: DateTime.now(),
          job_id: v4(),
          job_name: 'falcon-job',
          job_url: job_urls[Math.floor(Math.random() * job_urls.length)],
          status: JobStatus.enqueued,
          updated_at: DateTime.now(),
          locked: false,
          retry_count: 0
        };
        enqueueJobsPromises.push(QUEUE.enqueue(jobAdd));
      }
      console.log('Random Enqueued Jobs Inserted');
      await Promise.all(enqueueJobsPromises);
      res.header('Access-Control-Allow-Origin', '*').send('Jobs Inserted');
    } catch (err) {
      console.log('Add Random jobs Error', err);
      res.status(httpCodes.serverError).json({
        message: err,
      });
    }
  }
}

export {
  QueueService
};