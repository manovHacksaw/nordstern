import { Router } from 'express';
import type { Request } from 'express';
import { listTransactions, fetchTransaction } from './platform.js';
import { createSession } from './adapters/kyc/didit.js';
import { ASSET_CODE } from './config.js';
import { requireCustomerSession, fetchCustomerWallets } from './customerSession.js';

// ─── Customer-facing API (ns_customer session) ──────────────────────────────────
// Tenant-isolated to THIS anchor. History is scoped to the authenticated customer's
// linked wallets — never another customer's transactions. Financial data stays
// authoritative in this anchor (Platform API); we only read + relabel it. No new store.

export const customerApiRouter = Router();
customerApiRouter.use('/customer', requireCustomerSession);

// SEP-24 status → friendly customer phase. Only real statuses.
function phase(status: string): string {
  const s = status.toLowerCase();
  if (s === 'completed') return 'completed';
  if (s === 'refunded') return 'refunded';
  if (s === 'error' || s === 'expired') return 'failed';
  if (s === 'pending_stellar') return 'completing';
  if (s === 'pending_anchor' || s === 'pending_external') return 'processing';
  if (s.startsWith('pending_user') || s === 'incomplete') return 'awaiting_payment';
  return 'processing';
}

const amt = (a: any): string | null => (a && a.amount != null ? String(a.amount) : null);

// Every Stellar account a transaction could belong to.
function txAccounts(tx: Record<string, any>): string[] {
  return [tx.sep10_account, tx.customers?.sender?.account, tx.destination_account].filter(Boolean);
}

function toCustomerTx(tx: Record<string, any>) {
  const kind = tx.kind === 'withdrawal' ? 'sell' : 'buy';
  return {
    id: tx.id,
    kind,
    phase: phase(String(tx.status ?? '')),
    assetAmount: amt(tx.amount_out) ?? amt(tx.amount_expected) ?? amt(tx.amount_in),
    inrAmount: amt(tx.amount_in),
    reference: String(tx.id ?? '').slice(0, 8).toUpperCase() || null,
    createdAt: tx.started_at ?? null,
    completedAt: tx.completed_at ?? null,
    assetCode: ASSET_CODE,
    // Technical (UI shows only under "Advanced"):
    rawStatus: String(tx.status ?? ''),
    stellarId: tx.stellar_transactions?.[0]?.id ?? null,
    destination: tx.destination_account ?? null,
  };
}

function customerId(req: Request): string {
  return (req as Request & { customerId?: string }).customerId!;
}

// GET /customer/transactions — this customer's history on THIS anchor.
customerApiRouter.get('/customer/transactions', async (req, res) => {
  try {
    const addresses = new Set(await fetchCustomerWallets(customerId(req)));
    if (addresses.size === 0) { res.json({ transactions: [] }); return; }
    const records = await listTransactions({ sep: '24', order: 'desc' });
    const mine = records
      .filter((tx) => txAccounts(tx).some((a) => addresses.has(a)))
      .map(toCustomerTx)
      .sort((a, b) => String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')));
    res.json({ transactions: mine });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /customer/transactions/:id — one, only if it belongs to this customer.
customerApiRouter.get('/customer/transactions/:id', async (req, res) => {
  try {
    const addresses = new Set(await fetchCustomerWallets(customerId(req)));
    const tx = await fetchTransaction(req.params.id as string).catch(() => null);
    if (!tx || !txAccounts(tx).some((a) => addresses.has(a))) {
      res.status(404).json({ error: 'not found' });
      return;
    }
    res.json(toCustomerTx(tx));
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// POST /customer/kyc/start — begin DIDIT verification tied to the CUSTOMER identity.
// vendor_data = customerId so the webhook decision propagates to the central profile.
// The client never sets its own status; this only starts a hosted session.
customerApiRouter.post('/customer/kyc/start', async (req, res) => {
  try {
    const id = customerId(req);
    // Optional same-origin return URL the client passes so DIDIT sends the user back
    // to the app; validated to an http(s) URL to avoid open redirects.
    const raw = String((req.body ?? {}).returnUrl ?? '');
    const returnUrl = /^https?:\/\//.test(raw) ? raw : undefined;
    const session = await createSession(id, undefined, returnUrl);
    res.json({ url: session.url, status: session.status });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const friendly = /credits|top ?up/i.test(msg)
      ? 'Verification is temporarily unavailable. Please try again later.'
      : 'Could not start verification. Please try again.';
    res.status(502).json({ error: friendly });
  }
});
