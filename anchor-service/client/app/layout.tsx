import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { getBrand } from '@/lib/brand';
import { BrandProvider } from '@/components/brand-context';
import './globals.css';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'], display: 'swap' });
const mono = JetBrains_Mono({ variable: '--font-mono', subsets: ['latin'], display: 'swap' });

export function generateMetadata(): Metadata {
  const brand = getBrand();
  return {
    title: `${brand.name} — Buy ${brand.assetCode}`,
    description: `Buy and manage ${brand.assetCode} with ${brand.name}. Powered by NordStern.`,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const brand = getBrand();
  // Override the accent app-wide so the whole token system re-tints per anchor.
  const accentVars = { ['--color-brand' as string]: brand.accent } as React.CSSProperties;
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`} style={accentVars}>
      <body className="min-h-screen antialiased">
        <BrandProvider brand={brand}>{children}</BrandProvider>
      </body>
    </html>
  );
}
