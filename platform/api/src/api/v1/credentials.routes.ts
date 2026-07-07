import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../../middleware/requireAuth.js';
import { tenant } from '../../middleware/tenant.js';
import { validateBody } from '../../middleware/validate.js';
import { ah } from '../../lib/asyncHandler.js';
import { credentialsService } from '../../services/credentials.service.js';
import { recordAudit } from '../../services/audit.service.js';

// Operator-facing credential management for a provisioned anchor. Add / rotate /
// delete only — values are written straight to the SecretStore and are NEVER
// returned. Every response is the MASKED shape (which keys are set, when), so the
// UI can render placeholders without ever holding a secret. Mounted under
// /organizations/:orgId/anchors/:anchorId/credentials (mergeParams for both ids).
export const credentialsRouter = Router({ mergeParams: true });
credentialsRouter.use(requireAuth, tenant);

const bodySchema = z.object({
  credentials: z.record(z.string(), z.string()).refine((c) => Object.keys(c).length > 0, 'No credentials provided'),
});

// List all operator-managed providers (masked).
credentialsRouter.get('/', ah(async (req, res) => {
  res.json(await credentialsService.list(req.org!.id, req.params.anchorId as string));
}));

// Add / replace a provider's credentials.
credentialsRouter.put('/:provider',
  validateBody(bodySchema),
  ah(async (req, res) => {
    const masked = await credentialsService.set(req.org!.id, req.params.anchorId as string, req.params.provider as string, req.body.credentials);
    await recordAudit({
      action: 'anchor.credentials.set', actorType: 'user', actorUserId: req.user?.id ?? null,
      requestId: String(req.id), metadata: { anchorId: req.params.anchorId, provider: req.params.provider, keyNames: masked.keyNames },
    });
    res.json(masked);
  }));

// Rotate (replace) a provider's credentials.
credentialsRouter.post('/:provider/rotate',
  validateBody(bodySchema),
  ah(async (req, res) => {
    const masked = await credentialsService.set(req.org!.id, req.params.anchorId as string, req.params.provider as string, req.body.credentials, /* rotate */ true);
    await recordAudit({
      action: 'anchor.credentials.rotated', actorType: 'user', actorUserId: req.user?.id ?? null,
      requestId: String(req.id), metadata: { anchorId: req.params.anchorId, provider: req.params.provider },
    });
    res.json(masked);
  }));

// Delete a provider's credentials.
credentialsRouter.delete('/:provider', ah(async (req, res) => {
  await credentialsService.remove(req.org!.id, req.params.anchorId as string, req.params.provider as string);
  await recordAudit({
    action: 'anchor.credentials.deleted', actorType: 'user', actorUserId: req.user?.id ?? null,
    requestId: String(req.id), metadata: { anchorId: req.params.anchorId, provider: req.params.provider },
  });
  res.json({ ok: true });
}));
