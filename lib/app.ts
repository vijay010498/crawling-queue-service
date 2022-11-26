import { routes } from './routes';
import express, { json } from 'express';
import { postgresClient } from './services/postgres/client';
import { createTable } from './scripts/create-table';

const PORT = process.env.PORT || 5000;
const app = express();

(async () => {
  try {
    app.use(json());
    app.use(routes);
    await app.listen(PORT, async () => {
      await postgresClient.connect();
      await createTable();
      console.log(`Server Started and Listening on PORT ${PORT} `);
    });
  } catch (err) {
    console.log('Error in starting the server', err);
  }
})();


