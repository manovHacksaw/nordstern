import { Router } from 'express';
import { Horizon } from '@stellar/stellar-sdk';
import {
  DISTRIBUTION_PUBLIC, ASSET_CODE, ASSET_ISSUER_PUBLIC, HORIZON_URL, PROVIDERS, assetId,
} from './config.js';
import { listTransactions } from './platform.js';

// ─── Operator summary (read-only) ────────────────────────────────────────────────
// Feeds the per-anchor operator console overview. Everything here is derived from
// authoritative sources (Horizon for treasury, the Anchor Platform for transactions)
// — no synthetic data. Each source degrades independently so one outage doesn't blank
// the whole page.
export const adminRouter = Router();

adminRouter.get('/summary', async (_req, res) => {
  // Treasury: the distribution/float account's on-chain balances.
  let treasury: { asset: string; balance: string | null; xlm: string | null; account: string } = {
    asset: ASSET_CODE, balance: null, xlm: null, account: DISTRIBUTION_PUBLIC,
  };
  try {
    if (DISTRIBUTION_PUBLIC) {
      const acct = await new Horizon.Server(HORIZON_URL).loadAccount(DISTRIBUTION_PUBLIC);
      const assetBal = acct.balances.find(
        (b: any) => b.asset_code === ASSET_CODE && b.asset_issuer === ASSET_ISSUER_PUBLIC,
      );
      const xlmBal = acct.balances.find((b: any) => b.asset_type === 'native');
      treasury.balance = assetBal ? (assetBal as any).balance : '0';
      treasury.xlm = xlmBal ? (xlmBal as any).balance : '0';
    }
  } catch { /* treasury stays null — surfaced as "unavailable" in the UI */ }

  // Transactions: SEP-24 records from the Platform API (authoritative state).
  let transactions: { total: number; recent: any[] } = { total: 0, recent: [] };
  try {
    const records = await listTransactions({ sep: '24', order: 'desc' });
    transactions.total = records.length;
    transactions.recent = records.slice(0, 8).map((t: any) => ({
      id: t.id,
      kind: t.kind,
      status: t.status,
      amountIn: t.amount_in ?? null,
      amountOut: t.amount_out ?? null,
      startedAt: t.started_at ?? null,
    }));
  } catch { /* leave empty */ }

  res.json({
    asset: { code: ASSET_CODE, issuer: ASSET_ISSUER_PUBLIC, id: assetId() },
    treasury,
    transactions,
    rails: {
      kyc: PROVIDERS.kyc,
      deposit: PROVIDERS.deposit,
      payout: PROVIDERS.payout,
      fee: PROVIDERS.fee,
    },
  });
});
