'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Receipt, ArrowDownToLine, ArrowUpFromLine, ChevronRight, Download, Search, ArrowRight, Filter } from 'lucide-react';
import { useBrand } from '@/components/brand-context';
import { useCustomer } from '@/components/customer-context';
import { Panel, EmptyState, Badge, Skeleton, reveal, type Tone } from '@/components/ui';
import { myTransactions, type CustomerTx } from '@/lib/anchor';
import { inr, dateTime } from '@/lib/format';

type Filter = 'all' | 'buy' | 'sell' | 'pending';

const PHASE: Record<string, { label: string; tone: Tone }> = {
  completed: { label: 'Completed', tone: 'success' },
  awaiting_payment: { label: 'Awaiting payment', tone: 'warning' },
  payment_received: { label: 'Received', tone: 'info' },
  processing: { label: 'Processing', tone: 'info' },
  completing: { label: 'Almost done', tone: 'info' },
  failed: { label: 'Failed', tone: 'danger' },
  refunded: { label: 'Refunded', tone: 'neutral' },
};

export default function HistoryPage() {
  const brand = useBrand();
  const { customer } = useCustomer();
  const verified = customer?.kycStatus === 'approved';
  const [txns, setTxns] = useState<CustomerTx[] | null>(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  async function load() {
    setError('');
    try { setTxns(await myTransactions()); }
    catch (e) { setError(e instanceof Error ? e.message : 'Something went wrong'); setTxns([]); }
  }
  useEffect(() => { void load(); }, []);

  const rows = useMemo(() => {
    const byFilter = (txns ?? []).filter((t) =>
      filter === 'all' ? true : filter === 'pending' ? !['completed', 'failed', 'refunded'].includes(t.phase) : t.kind === filter,
    );
    const q = query.trim().toLowerCase();
    if (!q) return byFilter;
    return byFilter.filter((t) =>
      [t.reference, t.assetCode, t.kind, t.assetAmount, t.inrAmount, PHASE[t.phase]?.label]
        .filter(Boolean).some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [txns, filter, query]);

  // Client-side CSV of the currently-shown rows — no backend, purely presentational.
  function exportCsv() {
    const header = ['Date', 'Type', 'Asset', 'Amount', 'INR', 'Status', 'Reference'];
    const lines = rows.map((t) => [
      dateTime(t.createdAt), t.kind, t.assetCode ?? brand.assetCode, t.assetAmount ?? '',
      t.inrAmount ?? '', PHASE[t.phase]?.label ?? t.phase, t.reference ?? t.id,
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','));
    const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${brand.slug}-activity.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" style={reveal(0.02)}>
        <div>
          <p className="text-[19px] font-semibold tracking-tight text-ink">Activity</p>
          <p className="text-[12px] text-subtle">Every {brand.assetCode} purchase, sale, and settlement, in one place.</p>
        </div>
        <button onClick={exportCsv} disabled={!rows.length}
          className="inline-flex h-10 items-center gap-2 self-start rounded-full border border-black/[0.06] bg-canvas px-4 text-[12.5px] font-medium text-muted transition-colors hover:text-ink disabled:opacity-50">
          <Download className="h-4 w-4" /> Export
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2" style={reveal(0.06)}>
        {(['all', 'buy', 'sell', 'pending'] as Filter[]).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={filter === f
              ? 'rounded-full bg-ink px-4 py-1.5 text-[12.5px] font-medium capitalize text-white'
              : 'rounded-full border border-black/[0.06] bg-canvas px-4 py-1.5 text-[12.5px] font-medium capitalize text-muted transition-colors hover:text-ink'}>
            {f === 'all' ? 'All' : f === 'pending' ? 'In progress' : f}
          </button>
        ))}
        <div className="relative order-last w-full sm:order-none sm:ml-auto sm:w-60">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search reference, amount…"
            className="h-9 w-full rounded-full border border-black/[0.06] bg-canvas pl-9 pr-3 text-[12.5px] text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" />
        </div>
        <span className="hidden items-center gap-1.5 text-[12.5px] text-subtle sm:inline-flex">
          <Filter className="h-4 w-4" /> Newest first
        </span>
      </div>

      {error && <div className="rounded-xl bg-[var(--color-danger-bg)] px-3 py-2 text-sm text-[var(--color-danger)]">{error}</div>}

      {/* Table + empty state */}
      {txns === null ? (
        <Panel style={reveal(0.1)} className="p-0">
          <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-black/[0.05] px-6 py-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-subtle">
            <span>Transaction</span><span>Amount</span>
          </div>
          <div className="space-y-px p-2">{[0, 1, 2, 3].map((i) => <div key={i} className="p-3"><Skeleton className="h-9 w-full" /></div>)}</div>
        </Panel>
      ) : !rows.length ? (
        <Panel style={reveal(0.1)} className="p-0">
          <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-black/[0.05] px-6 py-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-subtle">
            <span>Transaction</span><span>Amount</span>
          </div>
          <EmptyState
            icon={<Receipt className="h-7 w-7" />}
            title={filter === 'all' && !query ? 'No transactions yet' : 'Nothing matches'}
            desc={filter === 'all' && !query ? 'Once you verify and make your first purchase, your history appears here.' : 'Try a different filter or search.'}
            action={filter === 'all' && !query && verified
              ? <Link href="/buy" className="inline-flex h-10 items-center gap-2 rounded-full bg-brand px-4 text-sm font-semibold text-[var(--color-brand-ink)] transition hover:opacity-90">Buy your first {brand.assetCode} <ArrowRight className="h-4 w-4" /></Link>
              : undefined}
          />
        </Panel>
      ) : (
        <Panel style={reveal(0.1)} className="p-0">
          <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-black/[0.05] px-6 py-3 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-subtle">
            <span>Transaction</span><span>Amount</span>
          </div>
          <div className="divide-y divide-black/[0.05]">
            {rows.map((t) => {
              const p = PHASE[t.phase] ?? { label: t.phase, tone: 'neutral' as Tone };
              const Icon = t.kind === 'buy' ? ArrowDownToLine : ArrowUpFromLine;
              return (
                <Link key={t.id} href={`/transactions/${t.id}`}
                  className="group grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-3.5 transition-colors hover:bg-black/[0.02] sm:px-6">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700"><Icon className="h-5 w-5" /></span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink">{t.kind === 'buy' ? 'Bought' : 'Sold'} {t.assetAmount ?? ''} {t.assetCode ?? brand.assetCode}</p>
                      <p className="truncate text-xs text-subtle">{dateTime(t.createdAt)} · <span className="font-mono">{t.reference ?? t.id.slice(0, 8).toUpperCase()}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold tabular-nums text-ink">{inr(t.inrAmount)}</p>
                      <Badge tone={p.tone}>{p.label}</Badge>
                    </div>
                    <ChevronRight className="hidden h-4 w-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand-700 sm:block" />
                  </div>
                </Link>
              );
            })}
          </div>
        </Panel>
      )}

      {/* Unverified CTA */}
      {!verified && (
        <div style={reveal(0.14)}
          className="flex flex-col items-center gap-4 rounded-mock border border-brand-100 bg-gradient-to-br from-brand-50 to-brand-100 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-[15px] font-semibold text-ink">Nothing to show — yet</p>
            <p className="mt-1 text-[12.5px] text-muted">Verify your identity to unlock buying and selling {brand.assetCode}.</p>
          </div>
          <Link href="/verify"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-white transition-colors hover:bg-ink/90 active:scale-[0.98]">
            Verify identity <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
