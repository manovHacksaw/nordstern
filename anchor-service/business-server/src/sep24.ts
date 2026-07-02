import { Router } from 'express';
import {
  ASSET_CODE, ASSET_ISSUER_PUBLIC, DISTRIBUTION_PUBLIC, IS_MAINNET, assetId,
} from './config.js';
import { fetchTransaction, patchTransaction } from './platform.js';
import { generateMemo, sendAnch } from './stellar.js';
import { deposit } from './adapters/index.js';

// ─── SEP-24 interactive flow ───────────────────────────────────────────────────
// The Anchor Platform redirects the wallet's webview here. Deposit fiat-in
// instructions come from the DepositProvider seam; withdrawal shows the address +
// memo to send ANCH back (fiat-out happens in the poller via PayoutProvider).

export const sep24Router = Router();

sep24Router.get('/interactive', async (req, res) => {
  const { transaction_id } = req.query as Record<string, string>;
  if (!transaction_id) { res.status(400).send('<h3>Missing transaction_id</h3>'); return; }

  let tx: Record<string, any>;
  try {
    tx = await fetchTransaction(transaction_id);
  } catch (err) {
    res.status(500).send(`<h3>Error</h3><pre>${err}</pre>`);
    return;
  }

  const amount = tx.amount_expected?.amount ?? '?';
  const kind   = tx.kind ?? 'deposit';
  const memo   = generateMemo(transaction_id);
  const isWithdrawal = kind === 'withdrawal';

  let fiatInCard = '';
  if (!isWithdrawal) {
    const instr = await deposit.instructions({ transactionId: transaction_id, amount, assetCode: ASSET_CODE, memo });
    fiatInCard = `
  <div class="card">
    <div class="label">${instr.label}</div>
    <div class="value">${instr.lines.join('<br>')}</div>
  </div>
  <p class="note">${instr.note}</p>`;
  }

  res.type('html').send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${isWithdrawal ? 'Withdraw' : 'Deposit'} ${ASSET_CODE}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; max-width: 480px; margin: 2rem auto; padding: 1rem; color: #111; }
    h2   { font-size: 1.4rem; margin-bottom: 0.25rem; }
    .sub { font-size: 0.8rem; color: #666; margin-bottom: 1.5rem; }
    .card { background: #f8f8f8; border: 1px solid #e5e5e5; border-radius: 8px;
            padding: 0.9rem 1rem; margin: 0.75rem 0; }
    .label { font-size: 0.75rem; color: #888; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.04em; }
    .value { font-family: monospace; font-size: 0.88rem; word-break: break-all; }
    .big   { font-size: 1.6rem; font-weight: 700; font-family: inherit; }
    .note  { font-size: 0.78rem; color: #888; margin: 0.75rem 0 1rem; line-height: 1.5; }
    button { display: block; width: 100%; padding: 0.8rem; background: ${isWithdrawal ? '#7c3aed' : '#2563eb'};
             color: #fff; font-size: 1rem; border: none; border-radius: 8px; cursor: pointer; margin-top: 0.5rem; }
    button:hover { opacity: 0.9; }
    .badge { display: inline-block; background: #fef3c7; color: #92400e;
             font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; margin-left: 6px; }
  </style>
</head>
<body>
  <h2>${isWithdrawal ? 'Withdraw' : 'Deposit'} ${ASSET_CODE} <span class="badge">${IS_MAINNET ? 'MAINNET' : 'TESTNET'}</span></h2>
  <p class="sub">Transaction: <code>${transaction_id}</code></p>

  <div class="card">
    <div class="label">Amount</div>
    <div class="value big">${amount} ${ASSET_CODE}</div>
  </div>

  ${isWithdrawal ? `
  <div class="card">
    <div class="label">Send your ${ASSET_CODE} tokens to this Stellar address</div>
    <div class="value">${DISTRIBUTION_PUBLIC}</div>
  </div>
  <div class="card">
    <div class="label">Required memo (text) — include this exactly</div>
    <div class="value">${memo}</div>
  </div>
  <p class="note">
    After sending ${ASSET_CODE} tokens on Stellar with the memo above, click confirm.
    The anchor will verify receipt and release your fiat.
  </p>
  ` : fiatInCard}

  <form method="POST" action="/sep24/interactive/complete">
    <input type="hidden" name="transaction_id"      value="${transaction_id}" />
    <input type="hidden" name="destination_account" value="${tx.destination_account ?? ''}" />
    <input type="hidden" name="amount"              value="${amount}" />
    <input type="hidden" name="kind"                value="${kind}" />
    <input type="hidden" name="memo"                value="${memo}" />
    <button type="submit">
      ${isWithdrawal ? `Confirm — I have sent ${amount} ${ASSET_CODE}` : `Confirm — Release ${amount} ${ASSET_CODE} to my wallet`}
    </button>
  </form>
</body>
</html>`);
});

sep24Router.post('/interactive/complete', async (req, res) => {
  const { transaction_id, destination_account, amount, kind, memo } = req.body as Record<string, string>;
  const log: string[] = [];
  const aid = assetId();
  let stellarTxHash = '';

  try {
    if (kind === 'withdrawal') {
      log.push('Updating status → pending_user_transfer_start…');
      await patchTransaction(transaction_id, {
        status: 'pending_user_transfer_start',
        memo,
        memo_type: 'text',
      });
      log.push(`✓ Status: pending_user_transfer_start (memo: ${memo})`);

      res.type('html').send(`<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>Waiting for transfer</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 480px; margin: 2rem auto; padding: 1rem; }
  .title { font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem; }
  .card { background: #f8f8f8; border: 1px solid #e5e5e5; border-radius: 8px; padding: 0.9rem 1rem; margin: 0.75rem 0; }
  .label { font-size: 0.75rem; color: #888; margin-bottom: 3px; text-transform: uppercase; }
  .value { font-family: monospace; font-size: 0.88rem; word-break: break-all; }
  .note  { font-size: 0.82rem; color: #555; margin-top: 1rem; line-height: 1.5; }
</style></head>
<body>
  <div class="title">⏳ Waiting for your ${ASSET_CODE} transfer</div>
  <div class="card"><div class="label">Send to</div><div class="value">${DISTRIBUTION_PUBLIC}</div></div>
  <div class="card"><div class="label">Amount</div><div class="value">${amount} ${ASSET_CODE}</div></div>
  <div class="card"><div class="label">Memo (text) — required</div><div class="value">${memo}</div></div>
  <p class="note">
    Once you send ${amount} ${ASSET_CODE} to the address above with memo <strong>${memo}</strong>,
    the anchor's Observer detects it and releases your fiat. You can close this page.
  </p>
  <script>
    try { window.parent.postMessage({ type: 'sep24_withdrawal_pending', txId: '${transaction_id}', memo: '${memo}', amount: '${amount}', destination: '${DISTRIBUTION_PUBLIC}' }, '*'); } catch(e) {}
  </script>
</body></html>`);
      return;
    }

    // Deposit path.
    log.push('Updating status → pending_anchor…');
    await patchTransaction(transaction_id, { status: 'pending_anchor' });
    log.push('✓ Status: pending_anchor');

    log.push(`Sending ${amount} ${ASSET_CODE} to ${destination_account}…`);
    stellarTxHash = await sendAnch(destination_account, amount);
    log.push(`✓ Stellar tx: ${stellarTxHash}`);

    log.push('Updating status → completed…');
    await patchTransaction(transaction_id, {
      status: 'completed',
      amount_in:  { amount, asset: aid },
      amount_out: { amount, asset: aid },
      amount_fee: { amount: '0', asset: aid },
      stellar_transactions: [{ id: stellarTxHash }],
    });
    log.push('✓ Status: completed');

    res.type('html').send(`<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>Deposit Complete</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 480px; margin: 2rem auto; padding: 1rem; }
  .ok  { color: #16a34a; font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
  .row { font-size: 0.85rem; padding: 3px 0; color: #444; }
  a    { color: #2563eb; font-size: 0.85rem; }
</style></head>
<body>
  <div class="ok">✓ Deposit complete</div>
  <p>${amount} ${ASSET_CODE} sent to your Stellar wallet.</p>
  <div style="margin-top:1rem">${log.map(l => `<div class="row">${l}</div>`).join('')}</div>
  <p style="margin-top:1rem">
    <a href="https://stellar.expert/explorer/${IS_MAINNET ? 'public' : 'testnet'}/tx/${stellarTxHash}" target="_blank">View on Stellar Expert →</a>
  </p>
  <script>
    try { window.parent.postMessage({ type: 'sep24_deposit_complete', txId: '${transaction_id}', hash: '${stellarTxHash}' }, '*'); } catch(e) {}
  </script>
</body></html>`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[complete] error:', msg);
    res.status(500).type('html').send(`<html><body style="font-family:monospace;padding:1rem;color:#dc2626">
      <h3>Error</h3><pre>${msg}</pre>
      <h4>Steps before error:</h4>${log.map(l => `<div>${l}</div>`).join('')}
    </body></html>`);
  }
});
