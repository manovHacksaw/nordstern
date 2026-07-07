'use client';

import { useBrand } from '@/components/brand-context';
import { cn } from '@/lib/cn';

// Renders the business logo when a URL is configured; otherwise a branded monogram
// (first letter on the accent) — so the UI is never blank. Accent comes from the CSS
// var (bg-brand) and the readable text color from --color-brand-ink, so both re-tint
// per anchor and the monogram stays legible on any brand color.
export function BrandLogo({ size = 36, className }: { size?: number; className?: string }) {
  const { logoUrl, displayName } = useBrand();
  const initial = (displayName || 'A').charAt(0).toUpperCase();

  if (logoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={logoUrl}
        alt={`${displayName} logo`}
        width={size}
        height={size}
        className={cn('rounded-xl object-contain', className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={cn('flex items-center justify-center rounded-xl bg-brand font-bold text-[var(--color-brand-ink)]', className)}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {initial}
    </div>
  );
}
