import { httpCodes } from '../../constants/http-status-codes';
import { name } from '../../../package.json';
import type { Response } from 'express';

class HealthService {
  static exec(res: Response) {
    return res.status(httpCodes.ok).json({
      name,
      status: 'Ready'
    });
  }
}

export {
  HealthService
};