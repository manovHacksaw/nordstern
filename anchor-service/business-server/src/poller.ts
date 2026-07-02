import { listTransactions, patchTransaction } from './platform.js';
import { assetId } from './config.js';
import { payout } from './adapters/index.js';

// ─── Withdrawal poller ─────────────────────────────────────────────────────────
// Every 15 s, pick up withdrawals the Observer moved to pending_anchor (the user's
// ANCH has arrived) and disburse fiat via the PayoutProvider, then complete.
// Event-driven replacement is a later slice.

async function processWithdrawal(tx: Record<string, any>): Promise<void> {
  const amount = tx.amount_expected?.amount ?? '0';
  const aid = assetId();

  console.log(`[withdrawal] Processing ${tx.id}: ${amount} from ${tx.destination_account}`);
  const result = await payout.disburse({
    transactionId: tx.id,
    amount,
    asset: aid,
    destination: tx.destination_account,
  });

  if (result.status !== 'completed') {
    console.log(`[withdrawal] ${tx.id} payout status=${result.status} (${result.message ?? ''}) — leaving pending`);
    return;
  }

  await patchTransaction(tx.id, {
    status: 'completed',
    amount_in:  { amount, asset: aid },
    amount_out: { amount, asset: aid },
    amount_fee: { amount: '0', asset: aid },
  });
  console.log(`[withdrawal] ${tx.id} → completed (ref ${result.reference ?? 'n/a'})`);
}

async function poll(): Promise<void> {
  try {
    const records = await listTransactions({ sep: '24', status: 'pending_anchor' });
    for (const tx of records.filter((r: any) => r.kind === 'withdrawal')) {
      await processWithdrawal(tx).catch(err =>
        console.error(`[withdrawal] Error processing ${tx.id}:`, err.message),
      );
    }
  } catch (err) {
    console.error('[poller] error:', (err as Error).message);
  }
}

export function startWithdrawalPoller(): void {
  setInterval(poll, 15_000);
}
