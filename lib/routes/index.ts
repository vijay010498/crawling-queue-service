import express from 'express';
import { CrawlingQueueServiceController } from '../controller';
import { RouteErrorHandler } from '../middlewares/route-error-handler';

const router = express.Router();

function getRouter() {
  router.get('/health', CrawlingQueueServiceController.health);
  router.post('/job', RouteErrorHandler.enQueueJobHandler, CrawlingQueueServiceController.enQueueJob);
  router.get('/job', CrawlingQueueServiceController.deQueueJob);
  router.put('/:jobId/:status', RouteErrorHandler.updateJobByStatusHandler, CrawlingQueueServiceController.updateJobStatus);
  router.get('/jobs/:status', RouteErrorHandler.jobsByStatus, CrawlingQueueServiceController.jobsByStatus);

  return router;
}

export const routes = getRouter();