import express from 'express';
import { CrawlingQueueServiceController } from '../controller';

const router = express.Router();

function getRouter() {
  router.get('/health', CrawlingQueueServiceController.health);
  router.post('/job', CrawlingQueueServiceController.enQueueJob);
  router.get('/job', CrawlingQueueServiceController.deQueueJob);
  router.put('/:jobId/:status', CrawlingQueueServiceController.updateJobStatus);
  router.get('/jobs/:status', CrawlingQueueServiceController.jobsByStatus);

  return router;
}

export const routes = getRouter();