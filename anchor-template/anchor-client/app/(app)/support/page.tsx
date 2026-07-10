'use client';

import { useState } from 'react';
import { Mail, ChevronDown, MessageCircle, ArrowRight } from 'lucide-react';
import { useBrand } from '@/components/brand-context';
import { Panel, reveal } from '@/components/ui';

const FAQ = [
  { q: 'How long does a buy take?', a: 'Most buys complete within a few minutes once your payment is confirmed. You can track progress live on the transaction screen.' },
  { q: 'How do I get verified?', a: 'You complete a one-time identity check. Once verified, you can buy and sell right away — and you won’t need to verify again.' },
  { q: 'Do I need a wallet?', a: 'Your account is your email. You can optionally link one or more wallets in your profile to send and receive.' },
  { q: 'What are the fees?', a: 'Any fee is shown clearly before you confirm a buy or sell — no surprises.' },
];

export default function SupportPage() {
  const brand = useBrand();
  const email = brand.supportEmail || `support@${brand.slug}.example`;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div style={reveal(0.02)}>
        <p className="text-[19px] font-semibold tracking-tight text-ink">Support</p>
        <p className="text-[12px] text-subtle">We’re here to help with anything about {brand.name}.</p>
      </div>

      <Panel style={reveal(0.06)} className="flex items-center gap-4 p-5 sm:flex-row sm:items-center">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-700"><MessageCircle className="h-5 w-5" /></span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">Need a hand?</p>
          <p className="text-[12.5px] text-subtle">Our team usually replies within a few hours.</p>
        </div>
        <a href={`mailto:${email}`}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-white transition-colors hover:bg-ink/90 active:scale-[0.98]">
          <Mail className="h-4 w-4" /> <span className="hidden sm:inline">Email us</span>
        </a>
      </Panel>

      <div style={reveal(0.1)}>
        <h2 className="mb-3 px-1 text-lg font-semibold text-ink">Frequently asked</h2>
        <Panel className="divide-y divide-black/[0.05] p-0">
          {FAQ.map((f, i) => (
            <div key={i}>
              <button className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left" onClick={() => setOpen(open === i ? null : i)}>
                <span className="text-sm font-medium text-ink">{f.q}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-subtle transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && <p className="px-5 pb-4 text-sm leading-relaxed text-muted">{f.a}</p>}
            </div>
          ))}
        </Panel>
      </div>

      <div style={reveal(0.14)}
        className="flex flex-col items-center gap-4 rounded-mock border border-brand-100 bg-gradient-to-br from-brand-50 to-brand-100 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="text-[15px] font-semibold text-ink">Still need help?</p>
          <p className="mt-1 text-[12.5px] text-muted">Include your transaction reference from the activity screen so we can help faster.</p>
        </div>
        <a href={`mailto:${email}`}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-white transition-colors hover:bg-ink/90 active:scale-[0.98]">
          Email {email} <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
