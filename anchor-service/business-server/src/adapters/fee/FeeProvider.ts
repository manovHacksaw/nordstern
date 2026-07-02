// ─── Fee seam (Platform `fee` callback) ────────────────────────────────────────
export interface FeeQuery {
  sendAsset?: string;
  receiveAsset?: string;
  amount?: string;
  type?: string;
}

export interface FeeQuote {
  asset: string;
  amount: string;
}

export interface FeeProvider {
  quote(q: FeeQuery): Promise<FeeQuote>;
}
