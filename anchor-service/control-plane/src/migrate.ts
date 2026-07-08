import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runner } from 'node-pg-migrate';

// R6 M4.1 — versioned migrations replace runtime initDb() schema creation.
// Applies all pending migrations in anchor-service/control-plane/migrations. Runs on
// boot (migrate-on-start) and from the `db:migrate` script for CI/ops.

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Same connection the app uses (discrete DB_* env), built into a URL for the runner.
function databaseUrl(): string {
  const host = process.env.DB_HOST ?? 'localhost';
  const port = process.env.DB_PORT ?? '5432';
  const database = process.env.DB_NAME ?? 'controldb';
  const user = process.env.DB_USER ?? 'anchor';
  const password = process.env.DB_PASSWORD ?? 'anchor';
  return `postgres://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
}

export async function runMigrations(direction: 'up' | 'down' = 'up'): Promise<void> {
  await runner({
    databaseUrl: databaseUrl(),
    dir: path.resolve(__dirname, '../migrations'),
    direction,
    count: direction === 'up' ? Infinity : 1,
    migrationsTable: 'pgmigrations',
    log: (msg: string) => console.log('[migrate]', msg),
  });
}

// Allow `tsx src/migrate.ts [up|down]` as a CLI (used by npm run db:migrate).
if (import.meta.url === `file://${process.argv[1]}`) {
  const dir = (process.argv[2] as 'up' | 'down') ?? 'up';
  runMigrations(dir)
    .then(() => { console.log('[migrate] done'); process.exit(0); })
    .catch((err) => { console.error('[migrate] failed:', err); process.exit(1); });
}
