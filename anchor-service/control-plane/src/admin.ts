import { Router, Response } from 'express';
import { pool } from './db.js';
import { requireAuth, requireAdmin, AuthedRequest } from './auth.js';

export const adminRouter = Router();
adminRouter.use(requireAuth as any);
adminRouter.use(requireAdmin as any);

// GET /admin/anchors — every anchor across all operators (platform admin only)
adminRouter.get('/anchors', async (_req: AuthedRequest, res: Response) => {
  const { rows } = await pool.query(`
    SELECT t.*, u.email as owner_email,
      COUNT(DISTINCT ra.id) FILTER (WHERE ra.resolved = false) as active_alerts
    FROM tenants t
    LEFT JOIN users u ON u.id = t.owner_user_id
    LEFT JOIN reconciliation_alerts ra ON ra.tenant_id = t.id
    GROUP BY t.id, u.email
    ORDER BY t.created_at DESC
  `);
  res.json(rows);
});

// PATCH /admin/anchors/:id — platform-admin metadata flag (suspend/activate).
// NOTE: metadata-only for now; it does not stop/start containers.
adminRouter.patch('/anchors/:id', async (req: AuthedRequest, res: Response) => {
  const { stack_status } = req.body as { stack_status: string };
  const { rows: [t] } = await pool.query(
    `UPDATE tenants SET stack_status=$1 WHERE id=$2 RETURNING *`,
    [stack_status, req.params.id],
  );
  res.json(t);
});
