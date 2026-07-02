import { Router } from 'express';
import { DISTRIBUTION_PUBLIC } from './config.js';
import { generateMemo } from './stellar.js';
import { kyc, fee } from './adapters/index.js';

// ─── Platform callbacks ────────────────────────────────────────────────────────
// The decisions the Anchor Platform delegates to us. KYC and fee are answered by
// swappable adapters (ARCHITECTURE §4).

export const callbacksRouter = Router();

// Unique deposit address (distribution account + deterministic memo).
callbacksRouter.post('/unique_address', (req, res) => {
  const txId = req.body?.transaction?.id ?? '';
  const memo = txId ? generateMemo(txId) : Math.random().toString(36).slice(2, 8).toUpperCase();
  res.json({ uniqueAddress: { stellarAddress: DISTRIBUTION_PUBLIC, memo, memoType: 'text' } });
});

// Fee quote.
callbacksRouter.post('/fee', async (req, res) => {
  const quote = await fee.quote({
    sendAsset: req.body.sendAsset,
    receiveAsset: req.body.receiveAsset,
    amount: req.body.amount,
    type: req.body.type,
  });
  res.json({ fee: quote });
});

// SEP-12 customer (KYC).
callbacksRouter.get('/customer', async (req, res) => {
  const result = await kyc.getCustomer({
    id: req.query.id as string | undefined,
    account: req.query.account as string | undefined,
    memo: req.query.memo as string | undefined,
    type: req.query.type as string | undefined,
  });
  res.json(result);
});

callbacksRouter.put('/customer', async (req, res) => {
  const result = await kyc.putCustomer({ id: req.body.id, account: req.body.account, fields: req.body });
  res.json(result);
});

callbacksRouter.delete('/customer/:id', async (req, res) => {
  await kyc.deleteCustomer(req.params.id);
  res.status(204).send();
});
