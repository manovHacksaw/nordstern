import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { LocalstackContainer, type StartedLocalStackContainer } from '@testcontainers/localstack';

// ─── SecretStore tests (R6 M3) ───────────────────────────────────────────────────
// Exercises the REAL AWS Secrets Manager code path against LocalStack (same SDK,
// endpoint swapped) — no mocking of the store. Proves the properties a payments
// platform depends on: create/update/rotate/delete, provider isolation, masking,
// and that nothing we persist (the SecretRef) carries plaintext credentials.

let container: StartedLocalStackContainer;
let store: typeof import('../index.js').secretStore;

beforeAll(async () => {
  container = await new LocalstackContainer('localstack/localstack:3').start();

  // env.ts validates at import; set the minimum + point the SDK at LocalStack BEFORE
  // importing the store.
  process.env.DATABASE_URL = 'postgres://unused:unused@localhost:5432/unused';
  process.env.JWT_ACCESS_SECRET = 'test-access';
  process.env.JWT_REFRESH_SECRET = 'test-refresh';
  process.env.SECRETS_BACKEND = 'aws';
  process.env.SECRETS_PREFIX = 'nordstern';
  process.env.SECRETS_ENV = 'testnet';
  process.env.AWS_REGION = 'us-east-1';
  process.env.SECRETS_ENDPOINT = container.getConnectionUri();
  process.env.AWS_ACCESS_KEY_ID = 'test';
  process.env.AWS_SECRET_ACCESS_KEY = 'test';

  ({ secretStore: store } = await import('../index.js'));
}, 180_000);

afterAll(async () => {
  await container?.stop();
});

// Each test uses a fresh anchor slug so LocalStack state never bleeds between cases.
let n = 0;
let slug = '';
beforeEach(() => {
  slug = `acme${n++}`;
});

const RZP = { RAZORPAY_KEY_ID: 'rzp_id_1', RAZORPAY_KEY_SECRET: 'rzp_secret_1' };
const CF = { CASHFREE_APP_ID: 'cf_app_1', CASHFREE_SECRET_KEY: 'cf_secret_1' };

describe('SecretStore — lifecycle', () => {
  it('CREATE: put then get round-trips, ref points (no values)', async () => {
    const ref = await store.put(slug, 'razorpay', RZP);
    expect(ref.provider).toBe('razorpay');
    expect(ref.secretProvider).toBe('aws');
    expect(ref.secretPath).toBe(`nordstern/testnet/anchor/${slug}`);
    expect(ref.keyNames.sort()).toEqual(['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET']);
    expect(await store.get(slug, 'razorpay')).toEqual(RZP);
  });

  it('UPDATE: re-putting the provider replaces its slice', async () => {
    await store.put(slug, 'razorpay', { RAZORPAY_KEY_ID: 'old' });
    await store.put(slug, 'razorpay', RZP);
    expect(await store.get(slug, 'razorpay')).toEqual(RZP);
  });

  it('ROTATE: replaces the provider credentials wholesale', async () => {
    await store.put(slug, 'razorpay', RZP);
    await store.rotate(slug, 'razorpay', { RAZORPAY_KEY_ID: 'rotated', RAZORPAY_KEY_SECRET: 'rotated_s' });
    expect(await store.get(slug, 'razorpay')).toEqual({ RAZORPAY_KEY_ID: 'rotated', RAZORPAY_KEY_SECRET: 'rotated_s' });
  });

  it('DELETE: removes the provider keys', async () => {
    await store.put(slug, 'razorpay', RZP);
    await store.delete(slug, 'razorpay');
    expect(await store.get(slug, 'razorpay')).toEqual({});
    expect(await store.describe(slug, 'razorpay')).toEqual({ exists: false, keyNames: [] });
  });
});

describe('SecretStore — isolation & masking', () => {
  it('PROVIDER ISOLATION: deleting one provider leaves the others intact', async () => {
    await store.put(slug, 'razorpay', RZP);
    await store.put(slug, 'cashfree', CF);

    await store.delete(slug, 'razorpay');

    expect(await store.get(slug, 'razorpay')).toEqual({});   // gone
    expect(await store.get(slug, 'cashfree')).toEqual(CF);   // untouched
    expect((await store.describe(slug, 'cashfree')).exists).toBe(true);
  });

  it('MASKING: describe returns key names but never values', async () => {
    await store.put(slug, 'razorpay', RZP);
    const d = await store.describe(slug, 'razorpay');
    expect(d.exists).toBe(true);
    expect(d.keyNames.sort()).toEqual(['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET']);
    // The describe payload must not contain any secret VALUE.
    expect(JSON.stringify(d)).not.toContain('rzp_secret_1');
    expect(JSON.stringify(d)).not.toContain('rzp_id_1');
  });

  it('NO PLAINTEXT PERSISTENCE: the SecretRef we store in the DB carries no values', async () => {
    const ref = await store.put(slug, 'razorpay', RZP);
    // Only a pointer + key names are ever persisted — assert no credential value leaks in.
    const serialized = JSON.stringify(ref);
    expect(serialized).not.toContain('rzp_secret_1');
    expect(serialized).not.toContain('rzp_id_1');
    expect(Object.values(ref).flat()).not.toContain('rzp_secret_1');
  });
});
