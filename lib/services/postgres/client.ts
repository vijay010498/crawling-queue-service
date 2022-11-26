import { Client as PgClient } from 'pg';
import postgresConstants from '../../constants/postgres';
const pg = new PgClient({
  user: 'postgres',
  password: 'vijay',
  database: postgresConstants.databaseName,
  host: 'localhost',
  port: 5432,
});

pg.on('error', err => {
  console.log('Error Connecting to database', err);
});


export { pg as postgresClient };