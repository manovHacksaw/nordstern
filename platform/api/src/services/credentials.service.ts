import { and, eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { secretRefs, anchors } from '../db/schema.js';
import { secretStore } from '../lib/secrets/index.js';
import type { Credentials } from '../lib/secrets/index.js';
import { badRequest, notFound } from '../lib/errors.js';

// Providers an OPERATOR may manage. `didit` is intentionally absent — identity
// verification is platform-owned and central (see R5 Identity Service), never a
// per-anchor credential the business sets.
const OPERATOR_PROVIDERS = new Set(['razorpay', 'cashfree', 'treasury']);

// The masked view an operator sees: which keys are set + when. NEVER values.
export interface MaskedCredential {
  provider: string;
  configured: boolean;
  keyNames: string[];
  secretProvider: string | null;
  lastRotatedAt: Date | null;
  updatedAt: Date | null;
}

async function anchorOr404(orgId: string, anchorId: string) {
  const anchor = await db.query.anchors.findFirst({
    where: and(eq(anchors.id, anchorId), eq(anchors.organizationId, orgId)),
  });
  if (!anchor) throw notFound('Anchor not found');
  return anchor;
}

async function upsertRef(orgId: string, anchorId: string, slug: string, ref: {
  provider: string; secretProvider: string; secretPath: string; keyNames: string[];
}, rotated: boolean) {
  await db.insert(secretRefs).values({
    organizationId: orgId,
    anchorId,
    slug,
    provider: ref.provider,
    secretProvider: ref.secretProvider,
    secretPath: ref.secretPath,
    keyNames: ref.keyNames,
    lastRotatedAt: rotated ? new Date() : null,
  }).onConflictDoUpdate({
    target: [secretRefs.slug, secretRefs.provider],
    set: {
      secretProvider: ref.secretProvider,
      secretPath: ref.secretPath,
      keyNames: ref.keyNames,
      ...(rotated ? { lastRotatedAt: new Date() } : {}),
      updatedAt: new Date(),
    },
  });
}

export const credentialsService = {
  // Write (or replace) a provider's credentials → SecretStore, persist only the ref.
  async set(orgId: string, anchorId: string, provider: string, credentials: Credentials, rotate = false) {
    if (!OPERATOR_PROVIDERS.has(provider)) throw badRequest(`Unsupported provider '${provider}'`);
    if (!credentials || Object.keys(credentials).length === 0) throw badRequest('No credentials provided');
    // Reject empty values outright — an empty string is not a credential.
    for (const [k, v] of Object.entries(credentials)) {
      if (typeof v !== 'string' || v.trim() === '') throw badRequest(`Empty value for '${k}'`);
    }
    const anchor = await anchorOr404(orgId, anchorId);
    const ref = rotate
      ? await secretStore.rotate(anchor.slug, provider, credentials)
      : await secretStore.put(anchor.slug, provider, credentials);
    await upsertRef(orgId, anchorId, anchor.slug, ref, /* rotated */ true);
    return this.describe(orgId, anchorId, provider);
  },

  async remove(orgId: string, anchorId: string, provider: string) {
    if (!OPERATOR_PROVIDERS.has(provider)) throw badRequest(`Unsupported provider '${provider}'`);
    const anchor = await anchorOr404(orgId, anchorId);
    await secretStore.delete(anchor.slug, provider);
    await db.delete(secretRefs).where(and(eq(secretRefs.slug, anchor.slug), eq(secretRefs.provider, provider)));
  },

  // Masked single-provider view (reads DB ref + store shape, never values).
  async describe(orgId: string, anchorId: string, provider: string): Promise<MaskedCredential> {
    const anchor = await anchorOr404(orgId, anchorId);
    const row = await db.query.secretRefs.findFirst({
      where: and(eq(secretRefs.slug, anchor.slug), eq(secretRefs.provider, provider)),
    });
    return {
      provider,
      configured: !!row && (row.keyNames?.length ?? 0) > 0,
      keyNames: row?.keyNames ?? [],
      secretProvider: row?.secretProvider ?? null,
      lastRotatedAt: row?.lastRotatedAt ?? null,
      updatedAt: row?.updatedAt ?? null,
    };
  },

  // Masked list of every operator-managed provider for the anchor.
  async list(orgId: string, anchorId: string): Promise<MaskedCredential[]> {
    return Promise.all([...OPERATOR_PROVIDERS].map((p) => this.describe(orgId, anchorId, p)));
  },
};
