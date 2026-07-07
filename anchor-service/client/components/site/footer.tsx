'use client';

import { useBrand } from '@/components/brand-context';

export function Footer() {
  const brand = useBrand();
  const links = [
    brand.websiteUrl && { label: 'Website', href: brand.websiteUrl },
    brand.privacyUrl && { label: 'Privacy', href: brand.privacyUrl },
    brand.termsUrl && { label: 'Terms', href: brand.termsUrl },
    brand.supportEmail && { label: 'Support', href: `mailto:${brand.supportEmail}` },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="border-t border-line bg-canvas">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-subtle sm:flex-row sm:px-8">
        <p>© {new Date().getFullYear()} {brand.displayName}</p>
        {links.length > 0 && (
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {links.map((l) => (
              <a key={l.label} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="transition-colors hover:text-ink">
                {l.label}
              </a>
            ))}
          </nav>
        )}
        <p className="flex items-center gap-1.5">
          Infrastructure by
          <span className="font-semibold text-ink">Nord</span><span className="-ml-1.5 font-semibold text-brand-700">Stern</span>
        </p>
      </div>
    </footer>
  );
}
