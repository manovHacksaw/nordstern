import { Router, Response } from 'express';
import { pool } from './db.js';
import { requireAuth, AuthedRequest } from './auth.js';

export const configRouter = Router();
configRouter.use(requireAuth as any);

// Business rules are now scoped per anchor (an operator owns many). Every route
// verifies the caller owns the anchor before touching its config.
async function assertOwns(anchorId: string, userId: string): Promise<boolean> {
  const { rows } = await pool.query(
    `SELECT 1 FROM tenants WHERE id = $1 AND owner_user_id = $2`, [anchorId, userId],
  );
  return rows.length > 0;
}

// GET /config/:anchorId — business rules for one anchor
configRouter.get('/:anchorId', async (req: AuthedRequest, res: Response) => {
  if (!(await assertOwns(req.params.anchorId, req.userId!))) { res.status(404).json({ error: 'Not found' }); return; }
  const { rows: [cfg] } = await pool.query(
    `SELECT * FROM tenant_config WHERE tenant_id = $1`, [req.params.anchorId],
  );
  res.json(cfg ?? {});
});

// PUT /config/:anchorId — save business rules
configRouter.put('/:anchorId', async (req: AuthedRequest, res: Response) => {
  if (!(await assertOwns(req.params.anchorId, req.userId!))) { res.status(404).json({ error: 'Not found' }); return; }
  const {
    min_deposit, max_deposit, min_withdrawal, max_withdrawal, daily_limit,
    deposit_fee_pct, withdrawal_fee_pct,
    fiat_method_name, fiat_bank_name, fiat_account_number, fiat_routing_number, settlement_days,
    alert_mismatch_pct, alert_large_tx, webhook_url,
  } = req.body;

  await pool.query(
    `INSERT INTO tenant_config (
       tenant_id, min_deposit, max_deposit, min_withdrawal, max_withdrawal, daily_limit,
       deposit_fee_pct, withdrawal_fee_pct, fiat_method_name, fiat_bank_name,
       fiat_account_number, fiat_routing_number, settlement_days,
       alert_mismatch_pct, alert_large_tx, webhook_url, updated_at
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16, NOW())
     ON CONFLICT (tenant_id) DO UPDATE SET
       min_deposit=$2, max_deposit=$3, min_withdrawal=$4, max_withdrawal=$5, daily_limit=$6,
       deposit_fee_pct=$7, withdrawal_fee_pct=$8, fiat_method_name=$9, fiat_bank_name=$10,
       fiat_account_number=$11, fiat_routing_number=$12, settlement_days=$13,
       alert_mismatch_pct=$14, alert_large_tx=$15, webhook_url=$16, updated_at=NOW()`,
    [
      req.params.anchorId, min_deposit, max_deposit, min_withdrawal, max_withdrawal, daily_limit,
      deposit_fee_pct, withdrawal_fee_pct, fiat_method_name, fiat_bank_name,
      fiat_account_number, fiat_routing_number, settlement_days,
      alert_mismatch_pct, alert_large_tx, webhook_url,
    ],
  );
  res.json({ ok: true });
});

// GET /config/:anchorId/alerts — reconciliation alerts for one anchor
configRouter.get('/:anchorId/alerts', async (req: AuthedRequest, res: Response) => {
  if (!(await assertOwns(req.params.anchorId, req.userId!))) { res.status(404).json({ error: 'Not found' }); return; }
  const { rows } = await pool.query(
    `SELECT * FROM reconciliation_alerts WHERE tenant_id=$1 AND resolved=false ORDER BY created_at DESC LIMIT 10`,
    [req.params.anchorId],
  );
  res.json(rows);
});

// POST /config/:anchorId/alerts/inject — demo helper: injects a fake mismatch
configRouter.post('/:anchorId/alerts/inject', async (req: AuthedRequest, res: Response) => {
  if (!(await assertOwns(req.params.anchorId, req.userId!))) { res.status(404).json({ error: 'Not found' }); return; }
  const { rows: [tenant] } = await pool.query(`SELECT fiat_balance FROM tenants WHERE id=$1`, [req.params.anchorId]);
  const delta = 500;
  await pool.query(
    `INSERT INTO reconciliation_alerts (tenant_id, fiat_balance, onchain_balance, delta)
     VALUES ($1, $2, $3, $4)`,
    [req.params.anchorId, tenant.fiat_balance, Number(tenant.fiat_balance) - delta, delta],
  );
  res.json({ ok: true, delta });
});

// POST /config/:anchorId/alerts/:alertId/resolve
configRouter.post('/:anchorId/alerts/:alertId/resolve', async (req: AuthedRequest, res: Response) => {
  if (!(await assertOwns(req.params.anchorId, req.userId!))) { res.status(404).json({ error: 'Not found' }); return; }
  await pool.query(
    `UPDATE reconciliation_alerts SET resolved=true WHERE id=$1 AND tenant_id=$2`,
    [req.params.alertId, req.params.anchorId],
  );
  res.json({ ok: true });
});
