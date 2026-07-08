import type { Request, Response, NextFunction } from 'express';
import { verifyAdminToken } from '../lib/jwt.js';
import { COOKIE_ADMIN } from '../config/constants.js';
import { unauthorized } from '../lib/errors.js';

// Gate the NordStern internal admin panel. Distinct realm from requireAuth (operators)
// and the customer session: only an `ns_admin` cookie with a `typ:'admin'` claim passes.
// The verified username is stashed on res.locals for audit — no global type surgery.
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_ADMIN];
  if (!token) return next(unauthorized('Not authenticated'));
  try {
    res.locals.admin = { username: verifyAdminToken(token).username };
    next();
  } catch {
    next(unauthorized('Invalid or expired admin session'));
  }
}
