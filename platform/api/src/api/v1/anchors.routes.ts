import { Router } from 'express';
import { and, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { anchors, memberships } from '../../db/schema.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { ah } from '../../lib/asyncHandler.js';
import { badRequest, notFound, forbidden } from '../../lib/errors.js';

// Per-anchor console bootstrap: given the console's own slug, return which anchor it
// manages + branding, scoped to the logged-in operator's memberships. This is how a
// console.<slug> container (which only knows its slug) learns its {orgId, anchorId}
// for the R2a credentials API and its authoritative business name for branding.
export const anchorsRouter = Router();
anchorsRouter.use(requireAuth);

// GET /anchors/resolve?slug=<slug>
anchorsRouter.get('/resolve', ah(async (req, res) => {
  const slug = String(req.query.slug ?? '').trim();
  if (!slug) throw badRequest('slug is required');

  const anchor = await db.query.anchors.findFirst({ where: eq(anchors.slug, slug) });
  if (!anchor) throw notFound('Anchor not found');

  // Enforce that the caller is a member of this anchor's organization.
  const member = await db.query.memberships.findFirst({
    where: and(eq(memberships.organizationId, anchor.organizationId), eq(memberships.userId, req.user!.id)),
  });
  if (!member) throw forbidden('You do not operate this anchor');

  res.json({
    organizationId: anchor.organizationId,
    anchorId: anchor.id,
    name: anchor.name,
    slug: anchor.slug,
    status: anchor.status,
    network: anchor.network,
    role: member.role,
  });
}));
