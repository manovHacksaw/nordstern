// Per-anchor branding. One customer-app image serves every anchor, so brand is
// resolved at RUNTIME from env injected by the provisioner (never NEXT_PUBLIC, which
// is build-time). Read only in server components; passed to the client via BrandProvider.
export interface Brand {
  name: string;      // business / anchor name
  assetCode: string; // issued asset (e.g. USDC, VEGA)
  currency: string;  // settlement fiat (e.g. INR)
  accent: string;    // primary accent hex — overrides --color-brand app-wide
  logoUrl: string | null;
}

const HEX = /^#([0-9a-fA-F]{6})$/;

export function getBrand(): Brand {
  const accent = process.env.ANCHOR_ACCENT ?? '';
  return {
    name: process.env.ANCHOR_NAME ?? 'NordStern Anchor',
    assetCode: process.env.ASSET_CODE ?? 'USDC',
    currency: process.env.ANCHOR_CURRENCY ?? 'INR',
    // Validate to a safe hex; fall back to the NordStern purple.
    accent: HEX.test(accent) ? accent : '#ab9ff2',
    logoUrl: process.env.ANCHOR_LOGO_URL || null,
  };
}
