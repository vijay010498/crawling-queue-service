import type { JobStatus } from './enums/Queue';
import type { DateTime } from 'luxon';

export interface Queue {
  job_id: string;
  job_name: string
  status: JobStatus,
  job_url: URL,
  updated_at: DateTime,
  created_at: DateTime,
  locked: Boolean
  retry_count: number,
}

export interface Result {
  job_id: string,
  title: string,
  brand: string,
  image_url: URL,
  result_id: string,
}