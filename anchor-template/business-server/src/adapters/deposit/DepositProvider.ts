// ─── DepositProvider seam (fiat-in) ────────────────────────────────────────────
// Produces the instructions shown to the user for paying INR into the anchor.
// Phase B ships a mock "wire / UPI" screen; Phase D swaps in a real UPI collection
// (upi://pay intent + QR) with backend verification before USDC is released.

export interface DepositInstructions {
  label: string;
  lines: string[];
  note: string;
}

export interface DepositProvider {
  instructions(args: {
    transactionId: string;
    inrAmount: string;
    usdcAmount: string;
    memo: string;
  }): Promise<DepositInstructions>;
}
