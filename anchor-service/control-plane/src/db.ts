import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({
  host:     process.env.DB_HOST     ?? 'localhost',
  port:     Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_NAME     ?? 'controldb',
  user:     process.env.DB_USER     ?? 'anchor',
  password: process.env.DB_PASSWORD ?? 'anchor',
});

// Schema is now managed by versioned migrations (R6 M4.1): see ../migrations and
// src/migrate.ts. Runtime initDb() schema creation was removed; the server runs
// `runMigrations()` on start. The idempotent baseline (0001_baseline) preserves full
// backwards compatibility with existing control-plane databases.
