import { routes } from './routes';
import express, { json } from 'express';

const PORT = process.env.PORT || 5000;
const app = express();

(async () => {
  app.use(json());
  app.use(routes);
  await app.listen(PORT, () => {
    console.log(`Server Started and Listening on PORT ${PORT} `);
  });
})();


