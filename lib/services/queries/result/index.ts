import type { Result } from '../../../types';
import { postgresClient } from '../../postgres/client';
import postgresConstants from '../../../constants/postgres';

class QueueResult {
  getQueueResults(): Promise<Result[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const { rows } = await postgresClient.query(
          `SELECT *
           FROM ${postgresConstants.crawledResultsTable}
           ORDER BY created_at LIMIT 500 `,
        );
        resolve(rows);
      } catch (err) {
        reject(err);
      }
    });
  }
}

export const resultQueries = new QueueResult();