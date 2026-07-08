// ─── SecretStore (production-grade secrets, day one) ─────────────────────────────
// The ONE interface every part of the platform uses to handle PSP / banking /
// treasury credentials. Callers never learn where a secret physically lives — that
// is entirely the backend's concern (AWS Secrets Manager in prod, the same API on
// LocalStack in dev). Credentials are NEVER persisted in the application database;
// only a `SecretRef` (metadata) is. See docs decision-log DL-010.

// A flat map of env-style keys → secret values, e.g.
//   { RAZORPAY_KEY_ID: '…', RAZORPAY_KEY_SECRET: '…', RAZORPAY_WEBHOOK_SECRET: '…' }
export type Credentials = Record<string, string>;

// What we DO persist in the DB: never a value, only a pointer + non-secret shape.
export interface SecretRef {
  provider: string;        // logical group: 'razorpay' | 'cashfree' | 'didit' | 'treasury' | …
  secretProvider: string;  // physical backend: 'aws' | 'memory'
  secretPath: string;      // e.g. 'nordstern/testnet/anchor/mizupay'
  keyNames: string[];      // the KEYS this provider owns (never the values) — powers masked UI
}

export interface SecretStore {
  // Write (create-or-merge) this provider's credentials for an anchor. Returns the
  // ref to persist. Idempotent: re-putting overwrites this provider's keys only.
  put(slug: string, provider: string, credentials: Credentials): Promise<SecretRef>;

  // Read back the provider's credentials (provisioner / injection use only).
  get(slug: string, provider: string): Promise<Credentials>;

  // Replace this provider's credentials wholesale (semantically distinct from put so
  // callers can express "rotate" intent; timestamps/audit treat it as a rotation).
  rotate(slug: string, provider: string, credentials: Credentials): Promise<SecretRef>;

  // Remove this provider's keys from the anchor's secret (leaves other providers).
  delete(slug: string, provider: string): Promise<void>;

  // Non-secret shape for the operator UI: which keys are set + when. NEVER values.
  describe(slug: string, provider: string): Promise<{ exists: boolean; keyNames: string[] }>;
}
