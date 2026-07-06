/**
 * Quote math — pure functions mirroring the prototype's `depData`/`wdData`/`cbData`.
 *
 * These are the mock pricing seam. In production a real quote comes from SEP-38
 * (`/price`) and the anchor's fee schedule; keep these signatures so a live quote
 * source can slot in behind them without touching the flow screens.
 */
import type { Anchor } from './anchors';
import type { AssetSym } from './assets';
import { fiatFor } from './assets';
import { fmt, parse } from './format';

export type DepositQuote = {
  fiatN: number;
  feeN: number;
  getN: number;
  fiatSym: string;
  fiatCode: string;
  youPay: string;
  feeStr: string;
  feePct: string;
  rateStr: string;
  youGet: string;
  receivedText: string;
  eta: string;
};

/** On-ramp: user pays fiat, receives `asset`. Fee = fiat × anchor.feeNum. */
export function depositQuote(fiat: string, anchor: Anchor, asset: AssetSym): DepositQuote {
  const f = fiatFor(asset);
  const fiatN = parse(fiat);
  const feeN = fiatN * anchor.feeNum;
  const getN = fiatN - feeN;
  return {
    fiatN,
    feeN,
    getN,
    fiatSym: f.sym,
    fiatCode: f.code,
    youPay: f.sym + fmt(fiatN),
    feeStr: f.sym + fmt(feeN),
    feePct: anchor.fee,
    rateStr: '1 ' + asset + ' = ' + f.sym + '1.00',
    youGet: fmt(getN) + ' ' + asset,
    receivedText: '+' + fmt(getN) + ' ' + asset,
    eta: anchor.settle,
  };
}

export type WithdrawQuote = {
  amtN: number;
  feeN: number;
  getN: number;
  fiatSym: string;
  fiatCode: string;
  youSend: string;
  feeStr: string;
  feePct: string;
  rateStr: string;
  youGet: string;
  eta: string;
};

/** Off-ramp: user sends `asset`, receives fiat. Fee = amount × anchor.feeNum. */
export function withdrawQuote(assetAmt: string, anchor: Anchor, asset: AssetSym): WithdrawQuote {
  const f = fiatFor(asset);
  const amtN = parse(assetAmt);
  const feeN = amtN * anchor.feeNum;
  const getN = amtN - feeN;
  return {
    amtN,
    feeN,
    getN,
    fiatSym: f.sym,
    fiatCode: f.code,
    youSend: fmt(amtN, 2) + ' ' + asset,
    feeStr: fmt(feeN, 2) + ' ' + asset,
    feePct: anchor.fee,
    rateStr: '1 ' + asset + ' = ' + f.sym + '1.00',
    youGet: f.sym + fmt(getN),
    eta: anchor.settle,
  };
}

export type CrossborderQuote = {
  sendN: number;
  feeN: number;
  recvN: number;
  youSend: string;
  feeStr: string;
  rateStr: string;
  youGet: string;
};

/** SEP-31 send-abroad: USDC → local currency. Flat 1% fee, fixed ₦1650 demo rate. */
export function crossborderQuote(cbAmt: string): CrossborderQuote {
  const sendN = parse(cbAmt);
  const feeN = sendN * 0.01;
  const rate = 1650;
  const recvN = (sendN - feeN) * rate;
  return {
    sendN,
    feeN,
    recvN,
    youSend: fmt(sendN, 2) + ' USDC',
    feeStr: fmt(feeN, 2) + ' USDC',
    rateStr: '1 USDC = ₦' + fmt(rate, 0),
    youGet: '₦' + fmt(recvN, 0),
  };
}
