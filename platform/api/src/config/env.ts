import 'dotenv/config';
import { z } from 'zod';

// Zod-validated environment. Fail fast at boot if misconfigured.
const schema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
});

export const env = schema.parse(process.env);
export type Env = z.infer<typeof schema>;
