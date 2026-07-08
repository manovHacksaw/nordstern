import { Router } from 'express';
import { z } from 'zod';
import { applicationService } from '../../services/application.service.js';
import { applicationsRepo } from '../../repositories/applications.repo.js';
import { recordAudit } from '../../services/audit.service.js';
import { signAdminToken } from '../../lib/jwt.js';
import { setAdminCookie, clearAdminCookie } from '../../lib/cookies.js';
import { requireAdmin } from '../../middleware/requireAdmin.js';
import { validateBody } from '../../middleware/validate.js';
import { authLimiter } from '../../middleware/rateLimit.js';
import { ah } from '../../lib/asyncHandler.js';
import { unauthorized, badRequest } from '../../lib/errors.js';
import { env } from '../../config/env.js';

// NordStern INTERNAL admin — the staff surface that reviews & approves anchor
// applications. A DISTINCT realm from operator (requireAuth) and customer auth: a
// single demo username/password issues an `ns_admin` cookie that is never
// interchangeable with the others. This is the deliberate stand-in for the real
// super-admin ROLE (Product 4 / founder-onboarding M4) — kept isolated so a
// customer/operator can never cross into admin.
export const adminRouter = Router();

// Reuse the auth throttle so the trivial demo credential can't be brute-forced trivially.
adminRouter.post('/login',
  authLimiter,
  validateBody(z.object({ username: z.string().min(1), password: z.string().min(1) })),
  ah(async (req, res) => {
    const { username, password } = req.body as { username: string; password: string };
    if (username !== env.ADMIN_USERNAME || password !== env.ADMIN_PASSWORD) {
      throw unauthorized('Invalid admin credentials');
    }
    setAdminCookie(res, signAdminToken(username));
    res.json({ ok: true, username });
  }));

adminRouter.post('/logout', ah(async (_req, res) => {
  clearAdminCookie(res);
  res.json({ ok: true });
}));

adminRouter.get('/me', requireAdmin, ah(async (_req, res) => {
  res.json({ username: res.locals.admin.username });
}));

// Full application queue (newest first), for the review table.
adminRouter.get('/applications', requireAdmin, ah(async (_req, res) => {
  res.json(await applicationService.list());
}));

// Approve → mint the invitation. Returns the raw token so the panel can render the
// redeem link (the only time it's ever shown). Provisioning still only happens when
// the founder redeems + a Test-mode app (production stays gated) — this just onboards.
adminRouter.post('/applications/:id/approve', requireAdmin, ah(async (req, res) => {
  const id = req.params.id as string;
  const result = await applicationService.approve(id);
  await recordAudit({
    action: 'application.approved', actorType: 'system', actorUserId: null,
    requestId: String(req.id),
    metadata: { applicationId: id, email: result.email, via: 'admin-panel', admin: res.locals.admin.username },
  });
  res.json({ email: result.email, rawToken: result.rawToken, applicationId: id });
}));

// Reject an application (no invitation minted).
adminRouter.post('/applications/:id/reject', requireAdmin, ah(async (req, res) => {
  const id = req.params.id as string;
  const app = await applicationsRepo.findById(id);
  if (!app) throw badRequest('Application not found');
  if (app.status === 'approved') throw badRequest('Cannot reject an already-approved application');
  const updated = await applicationsRepo.updateStatus(id, 'rejected');
  await recordAudit({
    action: 'application.rejected', actorType: 'system', actorUserId: null,
    requestId: String(req.id),
    metadata: { applicationId: id, via: 'admin-panel', admin: res.locals.admin.username },
  });
  res.json({ ok: true, status: updated.status });
}));
