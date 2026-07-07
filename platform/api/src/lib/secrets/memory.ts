import type { SecretStore, SecretRef, Credentials } from './types.js';
import { env } from '../../config/env.js';

// In-process backend for tests / CI where LocalStack isn't running. Same semantics as
// the AWS backend (one flat map per anchor path) but volatile. NOT for real secrets —
// selecting it in production is a misconfiguration; guarded in index.ts.

const PROVIDER_KEYS: Record<string, string[]> = {
  razorpay: ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET', 'RAZORPAY_WEBHOOK_SECRET'],
  cashfree: ['CASHFREE_APP_ID', 'CASHFREE_SECRET_KEY', 'CASHFREE_WEBHOOK_SECRET'],
  didit:    ['DIDIT_API_KEY', 'DIDIT_WEBHOOK_SECRET', 'DIDIT_WORKFLOW_ID'],
  treasury: ['TREASURY_SECRET'],
};

const store = new Map<string, Credentials>();
const pathFor = (slug: string) => `${env.SECRETS_PREFIX}/${env.SECRETS_ENV}/anchor/${slug}`;

function upsert(slug: string, provider: string, credentials: Credentials): SecretRef {
  const path = pathFor(slug);
  const current = store.get(path) ?? {};
  const owned = new Set([...(PROVIDER_KEYS[provider] ?? []), ...Object.keys(credentials)]);
  const next: Credentials = {};
  for (const [k, v] of Object.entries(current)) if (!owned.has(k)) next[k] = v;
  for (const [k, v] of Object.entries(credentials)) next[k] = v;
  store.set(path, next);
  return { provider, secretProvider: 'memory', secretPath: path, keyNames: Object.keys(credentials) };
}

export const memorySecretStore: SecretStore = {
  put: async (slug, provider, credentials) => upsert(slug, provider, credentials),
  rotate: async (slug, provider, credentials) => upsert(slug, provider, credentials),
  get: async (slug, provider) => {
    const map = store.get(pathFor(slug)) ?? {};
    const keys = PROVIDER_KEYS[provider] ?? Object.keys(map);
    const out: Credentials = {};
    for (const k of keys) if (map[k] !== undefined) out[k] = map[k];
    return out;
  },
  delete: async (slug, provider) => {
    const path = pathFor(slug);
    const map = store.get(path) ?? {};
    const owned = new Set(PROVIDER_KEYS[provider] ?? []);
    const next: Credentials = {};
    for (const [k, v] of Object.entries(map)) if (!owned.has(k)) next[k] = v;
    if (Object.keys(next).length === 0) store.delete(path);
    else store.set(path, next);
  },
  describe: async (slug, provider) => {
    const map = store.get(pathFor(slug)) ?? {};
    const owned = PROVIDER_KEYS[provider];
    const keyNames = owned ? owned.filter((k) => map[k] !== undefined) : Object.keys(map);
    return { exists: keyNames.length > 0, keyNames };
  },
};
