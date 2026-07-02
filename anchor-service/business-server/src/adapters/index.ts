import { PROVIDERS } from '../config.js';

import { KycProvider } from './kyc/KycProvider.js';
import { MockKycProvider } from './kyc/mock.js';
import { SurepassKycProvider } from './kyc/surepass.js';

import { FeeProvider } from './fee/FeeProvider.js';
import { MockFeeProvider } from './fee/mock.js';

import { PayoutProvider } from './payout/PayoutProvider.js';
import { MockPayoutProvider } from './payout/mock.js';

import { DepositProvider } from './deposit/DepositProvider.js';
import { MockDepositProvider } from './deposit/mock.js';

// ─── Adapter factory ───────────────────────────────────────────────────────────
// Selects one implementation per seam from env (mock-first). Instances are
// singletons for the process lifetime (one anchor per business-server).

function makeKyc(): KycProvider {
  switch (PROVIDERS.kyc) {
    case 'surepass': return new SurepassKycProvider();
    default:         return new MockKycProvider();
  }
}

function makeFee(): FeeProvider {
  switch (PROVIDERS.fee) {
    default: return new MockFeeProvider();
  }
}

function makePayout(): PayoutProvider {
  switch (PROVIDERS.payout) {
    default: return new MockPayoutProvider();
  }
}

function makeDeposit(): DepositProvider {
  switch (PROVIDERS.deposit) {
    default: return new MockDepositProvider();
  }
}

export const kyc     = makeKyc();
export const fee     = makeFee();
export const payout  = makePayout();
export const deposit = makeDeposit();

console.log(`[adapters] kyc=${PROVIDERS.kyc} fee=${PROVIDERS.fee} payout=${PROVIDERS.payout} deposit=${PROVIDERS.deposit}`);
