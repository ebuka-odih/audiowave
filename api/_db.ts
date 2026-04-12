import { Pool } from 'pg';

const globalForDb = globalThis as typeof globalThis & {
  audiowerkhausPool?: Pool;
  audiowerkhausSchemaReady?: Promise<void>;
};

const getConnectionConfig = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not configured.');
  }

  const sslMode = (process.env.DATABASE_SSL || 'false').toLowerCase();

  return {
    connectionString,
    ssl:
      sslMode === 'true' || sslMode === 'require'
        ? { rejectUnauthorized: false }
        : false,
  };
};

export const getPool = () => {
  if (!globalForDb.audiowerkhausPool) {
    globalForDb.audiowerkhausPool = new Pool(getConnectionConfig());
  }

  return globalForDb.audiowerkhausPool;
};

export const ensureSchema = () => {
  globalForDb.audiowerkhausSchemaReady ??= (async () => {
    const client = await getPool().connect();

    try {
      await client.query('BEGIN');
      await client.query('SELECT pg_advisory_xact_lock($1)', [424242]);

      await client.query(`
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          weight TEXT NOT NULL DEFAULT '',
          description TEXT NOT NULL,
          price TEXT NOT NULL,
          image TEXT NOT NULL DEFAULT '',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS consultation_requests (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          interest TEXT NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);

      await client.query('COMMIT');
    } catch (error) {
      globalForDb.audiowerkhausSchemaReady = undefined;
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  })();

  return globalForDb.audiowerkhausSchemaReady;
};
