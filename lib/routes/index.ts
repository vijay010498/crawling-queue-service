import express from 'express';
import { localQueue } from '../queue';
import { JobStatus } from '../types/enums/Queue';
import { DateTime } from 'luxon';
import { CrawlingQueueServiceController } from '../controller';
const router = express.Router();

function getRouter() {
  router.get('/hi', (req, res) => {
    console.log('queue', localQueue.queue);
    localQueue.enqueue({
      created_at: DateTime.now(),
      job_id: '1',
      job_name: 'job',
      job_url: '/job/id',
      status: JobStatus.enqueued,
      updated_at: DateTime.now()

    });
    res.send('hi');
  });

  router.get('/health', CrawlingQueueServiceController.health);
  router.get('/jobs/:status', CrawlingQueueServiceController.jobsByStatus);
  router.get('/enqueue', CrawlingQueueServiceController.enqueueJob);
  router.put('/:jobId/:status', CrawlingQueueServiceController.updateJobStatus);

  return router;
}

export const routes = getRouter();