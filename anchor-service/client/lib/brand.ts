// Per-anchor branding. One customer-app image serves every anchor, so brand is
// resolved at RUNTIME from env injected by the provisioner (never NEXT_PUBLIC, which
// is build-time). Read only in server components; passed to the client via BrandProvider.
export interface Brand {
  name: string;        // legal/business name
  displayName: string; // shown in UI (defaults to name)
  assetCode: string;   // issued asset (e.g. USDC, MIZU)
  currency: string;    // settlement fiat (e.g. INR)
  accent: string;      // primary accent hex — overrides --color-brand app-wide
  logoUrl: string | null;
  supportEmail: string | null;
  websiteUrl: string | null;
  privacyUrl: string | null;
  termsUrl: string | null;
}

const HEX = /^#([0-9a-fA-F]{6})$/;
const clean = (v: string | undefined) => (v && v.trim() ? v.trim() : null);

// Readable text color (black/white) for content sitting ON the accent — so buttons and
// the monogram stay legible whether the business picks a light or dark brand color.
export function readableOn(hex: string): string {
  const c = hex.replace('#', '');
  if (c.length !== 6) return '#ffffff';
  const r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? '#0b0b0b' : '#ffffff';
}

export function getBrand(): Brand {
  const accent = process.env.ANCHOR_ACCENT ?? '';
  const name = process.env.ANCHOR_NAME ?? 'NordStern Anchor';
  return {
    name,
    displayName: process.env.ANCHOR_DISPLAY_NAME?.trim() || name,
    assetCode: process.env.ASSET_CODE ?? 'USDC',
    currency: process.env.ANCHOR_CURRENCY ?? 'INR',
    // Validate to a safe hex; fall back to the NordStern purple.
    accent: HEX.test(accent) ? accent : '#ab9ff2',
    logoUrl: clean(process.env.ANCHOR_LOGO_URL),
    supportEmail: clean(process.env.ANCHOR_SUPPORT_EMAIL),
    websiteUrl: clean(process.env.ANCHOR_WEBSITE_URL),
    privacyUrl: clean(process.env.ANCHOR_PRIVACY_URL),
    termsUrl: clean(process.env.ANCHOR_TERMS_URL),
  };
}
