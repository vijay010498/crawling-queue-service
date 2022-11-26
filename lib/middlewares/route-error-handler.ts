import { body, param, validationResult } from 'express-validator';
import type { Request, NextFunction, Response } from 'express';
import { httpCodes } from '../constants/http-status-codes';
import { JobStatus } from '../types/enums/Queue';

class RouteErrorHandler {
  static enQueueJobHandler = [
    body('job_name')
      .exists({
        checkNull: true
      })
      .withMessage('Job name Required')
      .isString()
      .withMessage('job name must be a string')
      .trim()
      .isLength({
        min: 1,
        max: 50,
      })
      .withMessage('job name must not exceed 50 characters'),
    body('job_url')
      .exists({
        checkNull: true
      })
      .withMessage('Job URL is required')
      .isURL()
      .withMessage('Job URL must be a valid URL'),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(httpCodes.requestValidation).json({ errors: errors.array() });
      next();
    }
  ];
  static updateJobByStatusHandler = [
    param('jobId')
      .exists({
        checkNull: true
      })
      .withMessage('Job ID is required')
      .isUUID(4)
      .withMessage('Job ID must be a valid ID'),
    param('status')
      .exists({
        checkNull: true
      })
      .withMessage('Status is required')
      .isString()
      .withMessage('Status must be a valid string')
      .isIn([`${JobStatus.completed}`, `${JobStatus.failed}`])
      .withMessage(`Job Status must be ${JobStatus.completed} or ${JobStatus.failed}`),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(httpCodes.requestValidation).json({ errors: errors.array() });
      next();
    }
  ];
  static jobsByStatus = [
    param('status')
      .exists({
        checkNull: true
      })
      .withMessage('Status is required')
      .isString()
      .withMessage('Status must be a valid string')
      .isIn([`${JobStatus.enqueued}`, `${JobStatus.in_progress}`, `${JobStatus.completed}`, `${JobStatus.failed}`])
      .withMessage(`Job Status must be ${JobStatus.enqueued}, ${JobStatus.in_progress}, ${JobStatus.completed}, ${JobStatus.failed}`),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(httpCodes.requestValidation).json({ errors: errors.array() });
      next();
    }
  ];
}


export {
  RouteErrorHandler
};