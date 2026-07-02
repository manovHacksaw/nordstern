// ─── Fiat payout seam (withdrawal fiat-out) ────────────────────────────────────
// Where a real PSP (Cashfree Payouts / RazorpayX) plugs in. Mock is the default;
// real disbursement moves actual money and is gated (AGENTS.md §7).

export interface PayoutRequest {
  transactionId: string;
  amount: string;
  asset: string;
  destination?: string;
}

export interface PayoutResult {
  status: 'completed' | 'pending' | 'failed';
  reference?: string;
  message?: string;
}

export interface PayoutProvider {
  disburse(req: PayoutRequest): Promise<PayoutResult>;
}
