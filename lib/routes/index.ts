import express from 'express';
import { CrawlingQueueServiceController } from '../controller';

const router = express.Router();

function getRouter() {
  router.post('/job', CrawlingQueueServiceController.enQueueJob);
  router.get('/health', CrawlingQueueServiceController.health);
  router.get('/jobs/:status', CrawlingQueueServiceController.jobsByStatus);
  router.get('/job', CrawlingQueueServiceController.deQueueJob);
  router.put('/:jobId/:status', CrawlingQueueServiceController.updateJobStatus);

  return router;
}

export const routes = getRouter();