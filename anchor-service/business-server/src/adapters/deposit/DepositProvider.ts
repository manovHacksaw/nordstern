// ─── Fiat-in seam (deposit instructions shown in the SEP-24 webview) ───────────
// Where UPI collection / bank wire details come from. Mock renders the wire
// placeholder; a real DepositProvider (UPI intent/QR + verification) is a later
// slice.

export interface DepositInstructions {
  label: string;   // heading, e.g. "Wire transfer to"
  lines: string[]; // display lines (bank/account/UPI id/QR reference)
  note: string;    // guidance shown under the card
}

export interface DepositProvider {
  instructions(params: { transactionId: string; amount: string; assetCode: string; memo: string }): Promise<DepositInstructions>;
}
