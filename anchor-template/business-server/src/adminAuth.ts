import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import { PLATFORM_JWT_ACCESS_SECRET } from './config.js';

// ─── Operator authentication for the money-admin API ────────────────────────────
// The /admin router exposes money-moving operations (treasury sweep/pause, refund,
// retry, API-key management, compliance resolution). The operator console proxies to
// it same-origin, forwarding the platform session cookie (`ns_access`, an HS256 JWT
// signed by platform-api with JWT_ACCESS_SECRET). We verify that token here so an
// unauthenticated caller — including anyone hitting the public Traefik `api.<slug>`
// host directly — cannot invoke financial operations.
//
// FAIL CLOSED: if the shared secret is not configured we reject every /admin request
// rather than silently allowing them. The provisioner always injects the secret; a
// misconfigured stack loses the dashboard, never its treasury.
//
// Scope note: this proves "a signed-in platform operator", not yet "an operator of
// THIS anchor's org" — cross-org scoping is a follow-up refinement, tracked separately.

const b64urlDecode = (s: string): Buffer =>
  Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64');

function verifyPlatformToken(token: string): { sub: string } | null {
  if (!PLATFORM_JWT_ACCESS_SECRET) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, payload, signature] = parts;

  // 1. Signature (HS256 over `header.payload`), constant-time compared.
  const expected = crypto
    .createHmac('sha256', PLATFORM_JWT_ACCESS_SECRET)
    .update(`${header}.${payload}`)
    .digest();
  let given: Buffer;
  try { given = b64urlDecode(signature); } catch { return null; }
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return null;

  // 2. Alg + expiry + subject.
  let head: { alg?: string }; let claims: { sub?: string; exp?: number };
  try {
    head = JSON.parse(b64urlDecode(header).toString('utf8'));
    claims = JSON.parse(b64urlDecode(payload).toString('utf8'));
  } catch { return null; }
  if (head.alg !== 'HS256') return null;
  if (typeof claims.exp === 'number' && claims.exp * 1000 < Date.now()) return null;
  if (!claims.sub) return null;
  return { sub: claims.sub };
}

// Pull `ns_access` from the forwarded Cookie header, or a Bearer token.
function extractToken(req: Request): string | null {
  const auth = req.headers.authorization;
  if (auth?.startsWith('Bearer ')) return auth.slice(7);
  const cookie = req.headers.cookie;
  if (!cookie) return null;
  for (const part of cookie.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === 'ns_access') return decodeURIComponent(v.join('='));
  }
  return null;
}

export function requireOperator(req: Request, res: Response, next: NextFunction): void {
  const token = extractToken(req);
  const claims = token ? verifyPlatformToken(token) : null;
  if (!claims) {
    res.status(401).json({ error: 'unauthenticated: operator session required' });
    return;
  }
  (req as Request & { operator?: { sub: string } }).operator = claims;
  next();
}
