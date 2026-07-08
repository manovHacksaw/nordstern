// Exercises the SecretStore end-to-end. Runs against whatever SECRETS_BACKEND is set:
//   memory (no infra):   SECRETS_BACKEND=memory npx tsx scripts/verify-secretstore.ts
//   LocalStack (real AWS API), once Docker is up:
//     SECRETS_BACKEND=aws SECRETS_ENDPOINT=http://localhost:4566 \
//     AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test npx tsx scripts/verify-secretstore.ts
import assert from 'node:assert';
import { secretStore } from '../src/lib/secrets/index.js';

const slug = `verify-${Date.now().toString(36)}`;
let n = 0;
const ok = (m: string) => console.log(`  ✓ ${m}`);
const step = (m: string) => console.log(`\n[${++n}] ${m}`);

async function main() {
  console.log(`SecretStore verification (backend=${process.env.SECRETS_BACKEND ?? 'aws'}) slug=${slug}`);

  step('put razorpay + cashfree');
  await secretStore.put(slug, 'razorpay', { RAZORPAY_KEY_ID: 'rzp_id_1', RAZORPAY_KEY_SECRET: 'rzp_sec_1' });
  await secretStore.put(slug, 'cashfree', { CASHFREE_APP_ID: 'cf_app_1', CASHFREE_SECRET_KEY: 'cf_sec_1' });
  ok('wrote two providers into one per-anchor secret');

  step('get returns only that provider’s slice');
  const rzp = await secretStore.get(slug, 'razorpay');
  assert.deepStrictEqual(rzp, { RAZORPAY_KEY_ID: 'rzp_id_1', RAZORPAY_KEY_SECRET: 'rzp_sec_1' });
  const cf = await secretStore.get(slug, 'cashfree');
  assert.strictEqual(cf.CASHFREE_APP_ID, 'cf_app_1');
  assert.strictEqual(cf.RAZORPAY_KEY_ID, undefined, 'provider slices must not leak into each other');
  ok('provider isolation holds');

  step('describe is masked (key names only, no values)');
  const d = await secretStore.describe(slug, 'razorpay');
  assert.strictEqual(d.exists, true);
  assert.deepStrictEqual([...d.keyNames].sort(), ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET']);
  assert.ok(!JSON.stringify(d).includes('rzp_sec_1'), 'describe must never contain a value');
  ok('describe exposes keyNames but no secret values');

  step('rotate replaces the slice');
  await secretStore.rotate(slug, 'razorpay', { RAZORPAY_KEY_ID: 'rzp_id_2', RAZORPAY_KEY_SECRET: 'rzp_sec_2', RAZORPAY_WEBHOOK_SECRET: 'whsec_2' });
  const rzp2 = await secretStore.get(slug, 'razorpay');
  assert.strictEqual(rzp2.RAZORPAY_KEY_SECRET, 'rzp_sec_2');
  assert.strictEqual(rzp2.RAZORPAY_WEBHOOK_SECRET, 'whsec_2');
  ok('rotation reflected; new key added');

  step('delete one provider leaves the other intact');
  await secretStore.delete(slug, 'razorpay');
  assert.deepStrictEqual(await secretStore.get(slug, 'razorpay'), {});
  assert.strictEqual((await secretStore.get(slug, 'cashfree')).CASHFREE_APP_ID, 'cf_app_1');
  ok('razorpay gone, cashfree preserved');

  step('cleanup');
  await secretStore.delete(slug, 'cashfree');
  const gone = await secretStore.describe(slug, 'cashfree');
  assert.strictEqual(gone.exists, false);
  ok('anchor secret fully removed');

  console.log('\n✅ SecretStore verification passed');
}

main().catch((err) => { console.error('\n❌ verification failed:', err); process.exit(1); });
