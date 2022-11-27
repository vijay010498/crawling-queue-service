import type { Queue as QueueType } from '../../../types';
import { JobStatus } from '../../../types/enums/Queue';
import { postgresClient } from '../../postgres/client';
import postgresConstants from '../../../constants/postgres';
import type { QueryResult } from 'pg';
import { DateTime } from 'luxon';

const { crawlQueueTable } = postgresConstants;

class Queue {

  enqueue(job: QueueType): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const { job_id, job_name, status, job_url } = job;
        await postgresClient.query(
          `INSERT INTO ${crawlQueueTable} (job_id, job_name,status,job_url) VALUES ($1,$2,$3,$4)`,
          [job_id, job_name, status, job_url]
        );
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  dequeue(): Promise<QueryResult> {
    return new Promise(async (resolve, reject) => {
      try {
        await postgresClient.query('BEGIN');
        const { rows } = await postgresClient.query(
          `SELECT * FROM ${crawlQueueTable} WHERE status = $1 OR status = $2 AND locked = $3 AND retry_count <= $4 ORDER BY created_at LIMIT 1`,
          [JobStatus.enqueued, JobStatus.failed, false, postgresConstants.failed_jobs_max_retry]
        );
        if (rows.length > 0) {
          const { job_id, retry_count } = rows[0];
          await postgresClient.query(
            `UPDATE ${crawlQueueTable} SET locked = $1, status = $2, retry_count = $3 WHERE job_id = $4`,
            [true, JobStatus.in_progress, retry_count + 1, job_id]
          );
          rows[0].status = JobStatus.in_progress;
          rows[0].locked = true;
        }
        await postgresClient.query('COMMIT');
        resolve(rows[0] || {});
      } catch (err) {
        await postgresClient.query('ROLLBACK');
        reject(err);
      }
    });
  }


  getByStatus(status: JobStatus): Promise<QueueType[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const { rows } = await postgresClient.query(
          `SELECT * FROM ${crawlQueueTable} where status = $1`,
          [status]
        );
        resolve(rows);
      } catch (err) {
        reject(err);
      }
    });
  }

  updateStatus(status: JobStatus, job_id: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const { rows } = await postgresClient.query(
          `select exists(select 1 from ${crawlQueueTable} where job_id=$1)`,
          [job_id]
        );
        if (!rows[0].exists)
          return reject('Job Not Found');

        await postgresClient.query(
          `UPDATE ${crawlQueueTable} SET status = $1, updated_at = $2, locked = $3  WHERE job_id = $4`,
          [status, DateTime.now(), false, job_id]
        );
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }
}

export const queueQueries = new Queue();
