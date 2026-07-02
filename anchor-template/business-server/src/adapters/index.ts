import { PROVIDERS } from '../config.js';

import { RateProvider } from './rate/RateProvider.js';
import { MockRateProvider } from './rate/mock.js';

import { DepositProvider } from './deposit/DepositProvider.js';
import { MockDepositProvider } from './deposit/mock.js';

// ─── Adapter factory ───────────────────────────────────────────────────────────
// One implementation per seam, selected from env (mock-first). Real vendors
// (UPI collection, live FX, Cashfree payout, HyperVerge KYC) slot in here in
// Phase D without touching the SEP-24 flow logic.

function makeRate(): RateProvider {
  switch (PROVIDERS.fee) {          // FEE_PROVIDER selects the FX/pricing source
    default: return new MockRateProvider();
  }
}

function makeDeposit(): DepositProvider {
  switch (PROVIDERS.deposit) {
    default: return new MockDepositProvider();
  }
}

export const rate    = makeRate();
export const deposit = makeDeposit();

console.log(`[adapters] rate=${PROVIDERS.fee} deposit=${PROVIDERS.deposit} (kyc=${PROVIDERS.kyc} payout=${PROVIDERS.payout} — Phase D)`);
