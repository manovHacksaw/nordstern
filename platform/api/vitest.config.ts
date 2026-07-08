import { defineConfig } from 'vitest/config';

// SecretStore tests (R6 M3) run the REAL AWS SDK path against LocalStack via
// Testcontainers — the same code that runs against AWS Secrets Manager in prod,
// only the endpoint differs. Generous hook timeout for container startup.
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    testTimeout: 60_000,
    hookTimeout: 180_000,
    fileParallelism: false,
    pool: 'forks',
    watch: false,
  },
});
