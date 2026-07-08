import rateLimit from 'express-rate-limit';

// Tighter limit on auth endpoints (brute-force / enumeration protection).
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

// Public application submission — blunt spam without blocking a real founder.
export const applicationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

// Expensive, resource-spawning actions (redeem → real provisioning: containers,
// on-chain funding, a new database). Strict — a founder redeems once.
export const provisionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
});

// Loose cap for provisioning-status polling (the redeem page polls every ~3s).
// High enough never to break a legitimate provision, low enough to cap abuse.
export const pollLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});
