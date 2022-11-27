import { postgresClient } from '../services/postgres/client';
import postgresConstants from '../constants/postgres';

const createTable = async (): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      // create Table
      await postgresClient.query(
        `CREATE TABLE IF NOT EXISTS ${postgresConstants.crawlQueueTable}
         (
             job_id     varchar(50) PRIMARY KEY,
             job_name   varchar(50)  NOT NULL,
             status     varchar(15)  NOT NULL,
             job_url    varchar(255) NOT NULL,
             created_at timestamp    NOT NULL DEFAULT NOW(),
             updated_at timestamp    NOT NULL DEFAULT NOW(),
             locked     bool                  DEFAULT FALSE,
             retry_count INT NOT NULL DEFAULT 0
         )`
      );
      resolve(true);
    } catch (err) {
      reject(err);
    }
  });
};

export {
  createTable,
};
