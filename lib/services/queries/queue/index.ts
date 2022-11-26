import type { Queue as QueueType } from '../../../types';
import { JobStatus } from '../../../types/enums/Queue';
import { postgresClient } from '../../postgres/client';
import postgresConstants from '../../../constants/postgres';
import type { QueryResult } from 'pg';

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
        const { rows } = await postgresClient.query(
          `SELECT * FROM ${crawlQueueTable} WHERE status = $1 ORDER BY created_at LIMIT 1`,
          [JobStatus.enqueued]
        );
        resolve(rows[0]);
      } catch (err) {
        console.log(err);
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
          `UPDATE ${crawlQueueTable} SET status = $1 WHERE job_id = $2`,
          [status, job_id]
        );
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }
}

export const queueQueries = new Queue();
