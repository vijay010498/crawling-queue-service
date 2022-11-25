import type { JobStatus } from './enums/Queue';
import type { DateTime } from 'luxon';

export interface Queue {
  job_id: string;
  job_name: string
  status: JobStatus,
  job_url: string,
  updated_at: DateTime
  created_at: DateTime
}