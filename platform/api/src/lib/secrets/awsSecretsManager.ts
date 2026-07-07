import {
  SecretsManagerClient,
  GetSecretValueCommand,
  CreateSecretCommand,
  PutSecretValueCommand,
  DescribeSecretCommand,
  DeleteSecretCommand,
  ResourceNotFoundException,
  ResourceExistsException,
} from '@aws-sdk/client-secrets-manager';
import { env } from '../../config/env.js';
import type { SecretStore, SecretRef, Credentials } from './types.js';

// ─── AWS Secrets Manager backend ─────────────────────────────────────────────────
// The SAME client and code path run in dev and prod — only the endpoint differs:
//   • prod:  SECRETS_ENDPOINT unset → real AWS, auth via IAM role (IRSA on EKS).
//   • dev:   SECRETS_ENDPOINT=http://localhost:4566 → LocalStack, dummy creds.
// This is the whole point of choosing LocalStack: zero divergence to maintain.
//
// Layout: ONE secret per anchor (a flat JSON map of env keys), matching the prod
// Terraform + External Secrets Operator convention exactly. `provider` namespaces a
// subset of keys WITHIN that per-anchor secret, tracked by keyNames so we can
// merge/replace/delete a single provider without disturbing the others.

// Static fallback map of which env keys each provider owns. Used for `delete` and as
// a hint; the authoritative keyNames live in the DB `secret_refs` row.
const PROVIDER_KEYS: Record<string, string[]> = {
  razorpay: ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET', 'RAZORPAY_WEBHOOK_SECRET'],
  cashfree: ['CASHFREE_APP_ID', 'CASHFREE_SECRET_KEY', 'CASHFREE_WEBHOOK_SECRET'],
  didit:    ['DIDIT_API_KEY', 'DIDIT_WEBHOOK_SECRET', 'DIDIT_WORKFLOW_ID'],
  treasury: ['TREASURY_SECRET'],
};

const SECRET_PROVIDER = 'aws';

function client(): SecretsManagerClient {
  return new SecretsManagerClient({
    region: env.AWS_REGION,
    ...(env.SECRETS_ENDPOINT ? { endpoint: env.SECRETS_ENDPOINT } : {}),
    // LocalStack ignores the values but the SDK requires *some* credentials when an
    // endpoint override is set; in prod we omit these so the IAM-role chain is used.
    ...(env.SECRETS_ENDPOINT
      ? {
          credentials: {
            accessKeyId: env.AWS_ACCESS_KEY_ID ?? 'test',
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY ?? 'test',
          },
        }
      : {}),
  });
}

// nordstern/testnet/anchor/mizupay — identical to terraform/secrets.tf.
export function secretPathFor(slug: string): string {
  return `${env.SECRETS_PREFIX}/${env.SECRETS_ENV}/anchor/${slug}`;
}

async function readMap(c: SecretsManagerClient, path: string): Promise<Credentials> {
  try {
    const res = await c.send(new GetSecretValueCommand({ SecretId: path }));
    return res.SecretString ? (JSON.parse(res.SecretString) as Credentials) : {};
  } catch (err) {
    if (err instanceof ResourceNotFoundException) return {};
    throw err;
  }
}

// Create-or-update the whole per-anchor secret with the given flat map.
async function writeMap(c: SecretsManagerClient, path: string, map: Credentials): Promise<void> {
  const SecretString = JSON.stringify(map);
  try {
    await c.send(new CreateSecretCommand({ Name: path, SecretString }));
  } catch (err) {
    if (err instanceof ResourceExistsException) {
      await c.send(new PutSecretValueCommand({ SecretId: path, SecretString }));
    } else {
      throw err;
    }
  }
}

async function upsert(slug: string, provider: string, credentials: Credentials): Promise<SecretRef> {
  const c = client();
  const path = secretPathFor(slug);
  const current = await readMap(c, path);
  const keyNames = Object.keys(credentials);
  // Drop any stale keys this provider previously owned, then merge the new set —
  // makes put/rotate a clean replace of the provider's slice.
  const owned = new Set([...(PROVIDER_KEYS[provider] ?? []), ...keyNames]);
  const next: Credentials = {};
  for (const [k, v] of Object.entries(current)) if (!owned.has(k)) next[k] = v;
  for (const [k, v] of Object.entries(credentials)) next[k] = v;
  await writeMap(c, path, next);
  return { provider, secretProvider: SECRET_PROVIDER, secretPath: path, keyNames };
}

export const awsSecretStore: SecretStore = {
  put: (slug, provider, credentials) => upsert(slug, provider, credentials),
  rotate: (slug, provider, credentials) => upsert(slug, provider, credentials),

  async get(slug, provider) {
    const c = client();
    const map = await readMap(c, secretPathFor(slug));
    const keys = PROVIDER_KEYS[provider] ?? Object.keys(map);
    const out: Credentials = {};
    for (const k of keys) if (map[k] !== undefined) out[k] = map[k];
    return out;
  },

  async delete(slug, provider) {
    const c = client();
    const path = secretPathFor(slug);
    const map = await readMap(c, path);
    const owned = new Set(PROVIDER_KEYS[provider] ?? []);
    const next: Credentials = {};
    for (const [k, v] of Object.entries(map)) if (!owned.has(k)) next[k] = v;
    // If nothing is left at all, remove the secret entirely (force = no recovery window,
    // fine for testnet/dev; prod keeps the default recovery window).
    if (Object.keys(next).length === 0) {
      await c.send(new DeleteSecretCommand({
        SecretId: path,
        ...(env.SECRETS_ENDPOINT ? { ForceDeleteWithoutRecovery: true } : {}),
      })).catch((err) => { if (!(err instanceof ResourceNotFoundException)) throw err; });
    } else {
      await writeMap(c, path, next);
    }
  },

  async describe(slug, provider) {
    const c = client();
    const path = secretPathFor(slug);
    try {
      await c.send(new DescribeSecretCommand({ SecretId: path }));
    } catch (err) {
      if (err instanceof ResourceNotFoundException) return { exists: false, keyNames: [] };
      throw err;
    }
    const map = await readMap(c, path);
    const owned = PROVIDER_KEYS[provider];
    const keyNames = owned ? owned.filter((k) => map[k] !== undefined) : Object.keys(map);
    return { exists: keyNames.length > 0, keyNames };
  },
};
