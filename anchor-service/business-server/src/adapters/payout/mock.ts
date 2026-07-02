import { PayoutProvider, PayoutRequest, PayoutResult } from './PayoutProvider.js';

// Mock payout — simulates a fiat disbursement (no real bank/PSP). Preserves the
// original withdrawal behaviour: on Observer match, "release" fiat and complete.
export class MockPayoutProvider implements PayoutProvider {
  async disburse(req: PayoutRequest): Promise<PayoutResult> {
    console.log(`[payout:mock] Simulating fiat payout of ${req.amount} for tx ${req.transactionId}`);
    return { status: 'completed', reference: `MOCK-${req.transactionId.slice(0, 8)}` };
  }
}
