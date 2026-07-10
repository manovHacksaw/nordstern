import type { Metadata } from 'next';
import './globals.css';
import { clearSansText, clearSansDisplay, mono } from '@/lib/fonts';
import { getBrand } from '@/lib/brand';
import { BrandProvider } from '@/components/brand-context';
import { CustomerProvider } from '@/components/customer-context';

// White-label: getBrand() reads per-anchor env at REQUEST time, so every page must render
// dynamically. Without this, standalone builds prerender with build-time defaults and every
// anchor looks the same. One image, N branded anchors — only when dynamic.
export const dynamic = 'force-dynamic';

// Per-anchor title/description — white-label, no NordStern branding leaked to customers.
export function generateMetadata(): Metadata {
  const brand = getBrand();
  return {
    title: `${brand.name} — Buy & sell, instantly`,
    description: `Add money and cash out in seconds with ${brand.name}.`,
    // Per-anchor favicon from the uploaded logo. Only set when present so we never point at a
    // broken image; without a logo, Next falls back to the default icon.
    ...(brand.logoUrl ? { icons: { icon: brand.logoUrl } } : {}),
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const brand = getBrand();
  // Colour is fixed to the NordStern brand palette for EVERY anchor (the per-anchor accent is
  // intentionally not applied to colour). Everything else — name, logo, asset, fiat, support —
  // stays white-label. The whole purple scale therefore resolves from globals.css tokens.
  return (
    <html lang="en" className={`${clearSansText.variable} ${clearSansDisplay.variable} ${mono.variable}`}>
      <body className="min-h-screen antialiased">
        <BrandProvider brand={brand}>
          <CustomerProvider>{children}</CustomerProvider>
        </BrandProvider>
      </body>
    </html>
  );
}
