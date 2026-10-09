import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('Missing DATABASE_URL environment variable');
}

const db = drizzle(databaseUrl, { schema });

export default db;