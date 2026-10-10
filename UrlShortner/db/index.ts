import { drizzle } from 'drizzle-orm/neon-http';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('Missing DATABASE_URL environment variable');
}

// drizzle-orm v1 RC no longer accepts `schema` in neon-http config; table imports come from db/schema.ts
const db = drizzle(databaseUrl);

export default db;