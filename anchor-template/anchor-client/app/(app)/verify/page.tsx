'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck, CheckCircle2, Clock, XCircle, ArrowRight, Loader2,
  IdCard, ScanFace, BadgeCheck, Lock,
} from 'lucide-react';
import { customer as identityApi } from '@/lib/customer';
import { startKyc } from '@/lib/anchor';
import { useCustomer } from '@/components/customer-context';
import { useBrand } from '@/components/brand-context';
import { Panel, Button, Spinner, reveal } from '@/components/ui';
import { DiditMark, NordSternMark, StellarMark } from '@/components/ecosystem';

type View = 'intro' | 'processing' | 'approved' | 'pending' | 'declined';

const STEPS = [
  { Icon: IdCard, title: 'Personal details', desc: 'Name, date of birth, and address.' },
  { Icon: ScanFace, title: 'Document & selfie', desc: 'A government ID and a quick liveness check.' },
  { Icon: BadgeCheck, title: 'Instant review', desc: 'Most checks finish in under a minute.' },
];

function viewFor(status: string): View {
  if (status === 'approved') return 'approved';
  if (status === 'declined') return 'declined';
  if (status === 'pending') return 'pending';
  return 'intro';
}

export default function VerifyPage() {
  const { customer, refresh } = useCustomer();
  const brand = useBrand();
  const router = useRouter();
  const [view, setView] = useState<View>(viewFor(customer?.kycStatus ?? 'unverified'));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const poll = useRef<ReturnType<typeof setInterval> | null>(null);

  // Poll the CENTRAL status (updated server-to-server after DIDIT) while waiting.
  useEffect(() => {
    if (view !== 'processing' && view !== 'pending') return;
    poll.current = setInterval(async () => {
      const { kycStatus } = await identityApi.kyc().catch(() => ({ kycStatus: 'unverified' as const }));
      if (kycStatus === 'approved' || kycStatus === 'declined') {
        setView(kycStatus === 'approved' ? 'approved' : 'declined');
        await refresh();
      }
    }, 4000);
    return () => { if (poll.current) clearInterval(poll.current); };
  }, [view, refresh]);

  async function start() {
    setBusy(true); setError('');
    try {
      const { url } = await startKyc(`${window.location.origin}/verify`);
      window.open(url, '_blank', 'noopener');
      setView('processing');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not start verification');
    } finally { setBusy(false); }
  }

  if (view === 'approved') {
    return (
      <Result icon={<CheckCircle2 className="h-16 w-16 text-[var(--color-success)]" />} title="Verified for the NordStern Network"
        body={`You can buy and sell with ${brand.name}, and across other participating services provisioned through NordStern, without verifying again.`}
        cta="Start buying" onCta={() => router.push('/buy')} footer />
    );
  }

  if (view === 'declined') {
    return (
      <Result icon={<XCircle className="h-16 w-16 text-[var(--color-danger)]" />} title="We couldn’t verify you"
        body="Something didn’t match. You can try again, or contact support if this keeps happening."
        cta="Try again" onCta={() => setView('intro')} secondary={{ label: 'Contact support', onClick: () => router.push('/support') }} />
    );
  }

  if (view === 'pending') {
    return (
      <Result icon={<Clock className="h-16 w-16 text-[var(--color-warning)]" />} title="Verification in review"
        body="We’re reviewing your details. This is usually quick — we’ll update this screen when it’s done." />
    );
  }

  if (view === 'processing') {
    return (
      <div className="mx-auto max-w-md">
        <Panel style={reveal(0.04)} className="flex flex-col items-center gap-3 p-10 text-center sm:p-12">
          <Loader2 className="h-12 w-12 animate-spin text-brand" />
          <p className="font-semibold text-ink">Finishing verification…</p>
          <p className="max-w-xs text-sm text-muted">Complete the steps in the window that opened. This screen updates automatically when you’re done.</p>
        </Panel>
      </div>
    );
  }

  // intro
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="text-center" style={reveal(0.02)}>
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-700">
          <ShieldCheck className="h-7 w-7" />
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink">Verify your identity</h1>
        <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
          A one-time check, handled securely by DIDIT, that unlocks buying and selling {brand.assetCode} here and across participating NordStern-powered services.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-subtle">
          <span>Identity by</span><DiditMark className="text-xs" />
          <span className="px-1">·</span>
          <span>Network by</span><NordSternMark className="text-xs" />
        </div>
      </div>

      {/* Steps */}
      <div className="grid gap-4 sm:grid-cols-3" style={reveal(0.08)}>
        {STEPS.map(({ Icon, title, desc }, i) => (
          <Panel key={title} className="p-5">
            <div className="flex items-center justify-between">
              <span className="grid size-11 place-items-center rounded-2xl bg-brand-50 text-brand-700"><Icon className="h-5 w-5" /></span>
              <span className="text-sm font-semibold text-subtle">0{i + 1}</span>
            </div>
            <p className="mt-4 font-semibold text-ink">{title}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">{desc}</p>
          </Panel>
        ))}
      </div>

      {error && (
        <div className="mx-auto max-w-md rounded-xl bg-[var(--color-danger-bg)] px-3 py-2 text-center text-sm text-[var(--color-danger)]">{error}</div>
      )}

      {/* CTA */}
      <div style={reveal(0.14)} className="relative overflow-hidden rounded-mock border border-brand-100 bg-gradient-to-br from-brand-50 to-brand-100 p-8 text-center">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-brand/20 blur-2xl" />
        <div className="relative">
          <p className="text-lg font-semibold text-ink">Ready in about a minute</p>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-muted">
            Have a government ID handy. Your details are encrypted and never shared beyond the verification.
          </p>
          <button onClick={start} disabled={busy}
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-sm font-medium text-white transition-colors hover:bg-ink/90 active:scale-[0.98] disabled:opacity-60">
            {busy ? <><Spinner className="h-5 w-5" /> Starting…</> : <>Start verification <ArrowRight className="h-4 w-4" /></>}
          </button>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-subtle">
            <span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Bank-grade encryption</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> One-time, reusable across the network</span>
          </div>
        </div>
      </div>

      {/* Trust rail */}
      <div className="grid grid-cols-3 gap-3" style={reveal(0.18)}>
        <TrustChip label="Identity"><DiditMark /></TrustChip>
        <TrustChip label="Infrastructure"><NordSternMark className="text-sm" /></TrustChip>
        <TrustChip label="Settlement"><StellarMark /></TrustChip>
      </div>
    </div>
  );
}

function TrustChip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-black/[0.05] bg-canvas px-4 py-3 text-center">
      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-subtle">{label}</span>
      <span className="flex items-center text-sm">{children}</span>
    </div>
  );
}

function Result({ icon, title, body, cta, onCta, secondary, footer }: {
  icon: React.ReactNode; title: string; body: string; cta?: string; onCta?: () => void; secondary?: { label: string; onClick: () => void }; footer?: boolean;
}) {
  return (
    <div className="mx-auto max-w-md">
      <Panel style={reveal(0.04)} className="flex flex-col items-center gap-3 p-10 text-center">
        {icon}
        <p className="text-xl font-bold text-ink">{title}</p>
        <p className="max-w-sm text-sm leading-relaxed text-muted">{body}</p>
        {footer && (
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-subtle">
            <span>✓ Verified by</span><DiditMark /><span aria-hidden>·</span><NordSternMark className="text-[11px]" /><span>Network</span>
          </div>
        )}
        <div className="mt-2 flex w-full flex-col gap-2">
          {cta && onCta && <Button variant="gradient" size="block" onClick={onCta}>{cta}</Button>}
          {secondary && <Button variant="outline" size="block" onClick={secondary.onClick}>{secondary.label}</Button>}
        </div>
      </Panel>
    </div>
  );
}
