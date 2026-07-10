'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpFromLine, ShieldCheck, Wallet, ArrowRight, Loader2, CheckCircle2, AlertCircle, Info, Landmark } from 'lucide-react';
import { useBrand } from '@/components/brand-context';
import { useCustomer } from '@/components/customer-context';
import { Panel, PanelHead, Button, Spinner, Badge, reveal } from '@/components/ui';
import { FadeUp } from '@/components/motion';
import { getQuote, startSell, myTransaction, withdrawInstructions, sendWithdrawal, type CustomerTx } from '@/lib/anchor';
import { ensureWalletLinked } from '@/lib/link-wallet';
import { settler, type SettlementSession } from '@/lib/settlement';
import { inr } from '@/lib/format';
import { DiditMark } from '@/components/ecosystem';

type Step = 'amount' | 'confirm' | 'send' | 'processing' | 'done' | 'error';

const PHASE_LABEL: Record<string, string> = {
  awaiting_payment: 'Waiting for your transfer',
  processing: 'Processing your payout',
  completing: 'Sending to your bank',
  completed: 'Cash sent',
  failed: 'Couldn’t complete',
  refunded: 'Returned',
};

export default function SellPage() {
  const brand = useBrand();
  const { customer } = useCustomer();
  const router = useRouter();
  const [step, setStep] = useState<Step>('amount');
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState<{ inrAmount: string; inrPerUnit: string } | null>(null);
  const [limits, setLimits] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [session, setSession] = useState<SettlementSession | null>(null);
  const [txId, setTxId] = useState<string | null>(null);
  const [tx, setTx] = useState<CustomerTx | null>(null);
  const poll = useRef<ReturnType<typeof setInterval> | null>(null);
  const verified = customer?.kycStatus === 'approved';

  // Load min/max once so we validate as the user types (before any handoff).
  useEffect(() => {
    getQuote(1, 'sell')
      .then((q) => setLimits({ min: q.minAmount ?? null, max: q.maxAmount ?? null }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const n = Number(amount);
    if (!n || n <= 0) { setQuote(null); return; }
    let alive = true;
    const t = setTimeout(async () => {
      try { const q = await getQuote(n, 'sell'); if (alive) setQuote({ inrAmount: q.inrAmount ?? '0', inrPerUnit: q.inrPerUnit }); }
      catch { if (alive) setQuote(null); }
    }, 250);
    return () => { alive = false; clearTimeout(t); };
  }, [amount]);

  const nAmount = Number(amount);
  const limitError =
    limits.min != null && nAmount > 0 && nAmount < limits.min
      ? `Minimum is ${limits.min} ${brand.assetCode}`
      : limits.max != null && nAmount > limits.max
        ? `Maximum is ${limits.max} ${brand.assetCode}`
        : '';

  useEffect(() => {
    if (step !== 'processing' || !txId || !session) return;
    poll.current = setInterval(async () => {
      // Customer-session poll (cookie-auth) — SEP-10 /sep/tx/:id 404s for the native app.
      const t = await myTransaction(txId).catch(() => null);
      if (!t) return; setTx(t);
      if (t.phase === 'completed') setStep('done');
      else if (t.phase === 'failed' || t.phase === 'refunded') { setStep('error'); setError('This transaction didn’t complete.'); }
    }, 3000);
    return () => { if (poll.current) clearInterval(poll.current); };
  }, [step, txId, session]);

  async function confirmAndAuthorize() {
    setBusy(true); setError('');
    try {
      const addr = (await settler.available()) ?? (await settler.connect());
      // Link this wallet to the central customer (proven ownership) so KYC (verified once) is
      // reused and this sell shows in the customer's history. Best-effort — a decline won't
      // block the sell.
      await ensureWalletLinked(addr).catch(() => {});
      const s = await settler.authorize(addr); setSession(s);
      const { id } = await startSell(s, Number(amount).toFixed(2), brand.assetCode);
      setTxId(id); setStep('send');
    } catch (e) { setError(e instanceof Error ? 'Could not start your sell. Please try again.' : 'Error'); }
    finally { setBusy(false); }
  }

  // Native "click to send": build the transfer to the treasury, pop the wallet to confirm,
  // submit, then advance to the live tracking panel (the processing poll detects receipt →
  // payout → done automatically).
  async function doSend() {
    if (!txId || !session) return;
    setBusy(true); setError('');
    try {
      const { treasury, memo } = await withdrawInstructions(txId);
      await sendWithdrawal(session.walletAddress, treasury, Number(amount).toFixed(2), memo);
      setStep('processing');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send. Please try again.');
    } finally { setBusy(false); }
  }

  return (
    <div className="space-y-5">
      <FadeUp>
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-brand-50 text-brand-700"><ArrowUpFromLine className="h-5 w-5" /></span>
          <div>
            <h1 className="text-[19px] font-semibold tracking-tight text-ink">Sell {brand.assetCode}</h1>
            <p className="text-[12px] text-subtle">Convert {brand.assetCode} back to {brand.fiatCurrency}, paid straight to your bank.</p>
          </div>
        </div>
      </FadeUp>

      {!verified && step === 'amount' && (
        <Panel style={reveal(0.04)} className="flex items-center gap-3 border-[color:color-mix(in_srgb,var(--color-warning)_40%,transparent)] bg-[var(--color-warning-bg)]/40 p-4">
          <ShieldCheck className="h-5 w-5 shrink-0 text-[var(--color-warning)]" />
          <p className="flex-1 text-sm text-ink">Verify your identity first — it only takes a minute.</p>
          <Button size="sm" variant="outline" onClick={() => router.push('/verify')}>Verify</Button>
        </Panel>
      )}

      {step === 'amount' && (
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          {/* Converter */}
          <div className="space-y-4">
            <Panel style={reveal(0.06)} className="space-y-5 p-5 sm:p-6">
              <div>
                <label className="text-[12.5px] font-medium text-muted">You sell</label>
                <div className="mt-2 flex items-baseline gap-2 rounded-xl border border-black/[0.06] bg-surface px-4 py-3 transition-colors focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
                  <input autoFocus inputMode="decimal" placeholder="0" value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                    className="w-full bg-transparent text-4xl font-bold tracking-tight text-ink outline-none" />
                  <span className="text-lg font-semibold text-brand-700">{brand.assetCode}</span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-surface px-4 py-3 text-sm">
                <span className="text-muted">You receive</span>
                <span className="text-lg font-bold tabular-nums text-ink">{quote ? inr(quote.inrAmount) : '—'}</span>
              </div>

              {quote && !limitError && (
                <p className="flex items-center justify-between text-xs text-subtle">
                  <span>Rate</span>
                  <span className="font-medium text-muted">1 {brand.assetCode} ≈ {inr(quote.inrPerUnit)}</span>
                </p>
              )}
              {limitError
                ? <p className="text-xs font-medium text-[var(--color-danger)]">{limitError}</p>
                : (limits.min != null && limits.max != null) &&
                  <p className="text-xs text-subtle">Between {limits.min} and {limits.max} {brand.assetCode} per transaction</p>}
            </Panel>

            {error && <Msg text={error} />}

            <Button variant="gradient" size="block" disabled={!quote || busy || !!limitError} onClick={() => setStep('confirm')}>
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Side info */}
          <div className="space-y-5">
            <Panel style={reveal(0.1)} className="p-5">
              <PanelHead title="How selling works" />
              <div className="space-y-3">
                <StepRow Icon={ShieldCheck} title="Verify once" desc="A one-time identity check with DIDIT." />
                <StepRow Icon={ArrowUpFromLine} title={`Sell ${brand.assetCode}`} desc="At the live conversion rate." />
                <StepRow Icon={Landmark} title="Paid to your bank" desc={`${brand.fiatCurrency} settled to your linked account.`} />
              </div>
            </Panel>

            <div className="flex items-start gap-3 rounded-mock border border-black/[0.05] bg-canvas p-4 text-[13px] text-muted" style={reveal(0.14)}>
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
              <p>Identity is verified securely with <DiditMark className="text-[13px]" />. Your wallet approval only proves ownership — nothing leaves your wallet until you send on the next step.</p>
            </div>
          </div>
        </div>
      )}

      {step === 'confirm' && (
        <div className="mx-auto max-w-md space-y-4">
          <Panel style={reveal(0.04)} className="space-y-3 p-5 sm:p-6">
            <Row label="You sell" value={`${amount} ${brand.assetCode}`} />
            <Row label="You receive" value={inr(quote?.inrAmount)} strong />
            <div className="flex items-start gap-2 rounded-xl bg-surface px-3 py-2.5 text-xs text-muted">
              <Wallet className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Your wallet will ask you to approve — this just proves the wallet is yours. Nothing leaves your wallet yet: you’ll send the {brand.assetCode} on the next step, then we pay the cash to your bank.</span>
            </div>
          </Panel>
          {error && <Msg text={error} />}
          <Button variant="gradient" size="block" disabled={busy} onClick={confirmAndAuthorize}>
            {busy ? <><Spinner className="h-5 w-5" /> Confirming…</> : <><ShieldCheck className="h-4 w-4" /> Confirm securely</>}
          </Button>
          <button className="w-full text-center text-sm text-muted transition-colors hover:text-ink" onClick={() => setStep('amount')}>Back</button>
        </div>
      )}

      {step === 'send' && (
        <div className="mx-auto max-w-md">
          <Panel style={reveal(0.04)} className="flex flex-col items-center gap-3 p-6 text-center sm:p-8">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-700"><Wallet className="h-6 w-6" /></div>
            <p className="font-semibold text-ink">Send {amount} {brand.assetCode}</p>
            <p className="max-w-xs text-sm text-muted">Confirm the transfer in your wallet. We’ll detect it automatically and pay {inr(quote?.inrAmount)} to your bank — no copying or memos needed.</p>
            {error && <Msg text={error} />}
            <Button variant="gradient" size="block" disabled={busy} onClick={doSend}>
              {busy ? <><Spinner className="h-5 w-5" /> Confirm in your wallet…</> : <><Wallet className="h-4 w-4" /> Send from wallet</>}
            </Button>
            <button className="text-sm text-muted transition-colors hover:text-ink" onClick={() => { setStep('confirm'); setError(''); }}>Back</button>
          </Panel>
        </div>
      )}

      {step === 'processing' && (
        <div className="mx-auto max-w-md">
          <Panel style={reveal(0.04)} className="flex flex-col items-center gap-4 p-8 text-center sm:p-10">
            <Loader2 className="h-10 w-10 animate-spin text-brand" />
            <div>
              <p className="font-semibold text-ink">{PHASE_LABEL[tx?.phase ?? 'processing']}</p>
              <p className="mt-1 text-sm text-muted">This usually takes a minute. You can leave this screen — it’ll keep going.</p>
            </div>
          </Panel>
        </div>
      )}

      {step === 'done' && (
        <div className="mx-auto max-w-md">
          <Panel style={reveal(0.04)} className="space-y-4 p-5 sm:p-6">
            <div className="flex flex-col items-center gap-2 py-2 text-center">
              <CheckCircle2 className="h-14 w-14 text-[var(--color-success)]" />
              <p className="text-xl font-bold text-ink">Cash sent</p>
              <p className="text-sm text-muted">{inr(tx?.inrAmount ?? quote?.inrAmount)} is on its way to your bank.</p>
            </div>
            <div className="space-y-2 rounded-xl bg-surface p-4">
              <Row label="Sold" value={`${amount} ${brand.assetCode}`} />
              <Row label="Credited to bank" value={inr(tx?.inrAmount ?? quote?.inrAmount)} strong />
              <Row label="UTR" value={tx?.payoutReference ?? tx?.reference ?? txId?.slice(0, 8).toUpperCase() ?? '—'} />
              <div className="flex items-center justify-between"><span className="text-sm text-muted">Status</span><Badge tone="success">Paid</Badge></div>
            </div>
            <Button variant="outline" size="block" onClick={() => router.push('/home')}>Done</Button>
          </Panel>
        </div>
      )}

      {step === 'error' && (
        <div className="mx-auto max-w-md">
          <Panel style={reveal(0.04)} className="flex flex-col items-center gap-3 p-8 text-center sm:p-10">
            <AlertCircle className="h-12 w-12 text-[var(--color-danger)]" />
            <p className="text-lg font-bold text-ink">Couldn’t complete</p>
            <p className="max-w-xs text-sm text-muted">{error}</p>
            <Button variant="outline" size="block" onClick={() => { setStep('amount'); setError(''); setTx(null); }}>Try again</Button>
          </Panel>
        </div>
      )}
    </div>
  );
}

function StepRow({ Icon, title, desc }: { Icon: typeof Info; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-brand-50 text-brand-700"><Icon className="h-[18px] w-[18px]" /></span>
      <div>
        <p className="text-[13px] font-medium text-ink">{title}</p>
        <p className="text-[11.5px] text-subtle">{desc}</p>
      </div>
    </div>
  );
}
function Row({ label, value, strong }: { label: string; value: string | null | undefined; strong?: boolean }) {
  return <div className="flex items-center justify-between"><span className="text-sm text-muted">{label}</span><span className={strong ? 'text-lg font-bold tabular-nums text-ink' : 'font-medium tabular-nums text-ink'}>{value ?? '—'}</span></div>;
}
function Msg({ text }: { text: string }) { return <div className="rounded-xl bg-[var(--color-danger-bg)] px-3 py-2.5 text-sm text-[var(--color-danger)]">{text}</div>; }
