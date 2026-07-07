'use client';

import { useQuery } from '@tanstack/react-query';
import { Wallet, ArrowLeftRight, Landmark, Loader2 } from 'lucide-react';
import { bizGet } from '@/lib/api';
import { useAnchor } from '@/components/anchor-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Real anchor data from this anchor's business-server (/biz/admin/summary): treasury
// balance from Horizon, SEP-24 transactions from the Anchor Platform. No synthetic data.
interface Summary {
  asset: { code: string; issuer: string };
  treasury: { asset: string; balance: string | null; xlm: string | null; account: string };
  transactions: {
    total: number;
    recent: { id: string; kind: string; status: string; amountIn: string | null; amountOut: string | null; startedAt: string | null }[];
  };
  rails: { kyc: string; deposit: string; payout: string; fee: string };
}

const fmt = (v: string | null) => (v == null ? '—' : Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 }));

export default function OverviewPage() {
  const { name, loading } = useAnchor();
  const { data, isLoading, error } = useQuery({
    queryKey: ['summary'],
    queryFn: () => bizGet<Summary>('/admin/summary'),
    refetchInterval: 15000,
  });

  if (loading) return <div className="flex items-center gap-2 text-sm text-subtle"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>;

  const activeRails = data ? Object.entries(data.rails).filter(([, v]) => v !== 'mock').map(([k]) => k) : [];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Overview</h1>
        <p className="text-sm text-subtle">
          Operating <span className="font-medium text-ink">{name}</span>
          {data && <> — issuing <span className="font-medium text-ink">{data.asset.code}</span></>}.
        </p>
      </div>

      {error ? (
        <Card><CardContent className="py-6 text-sm text-subtle">Live data unavailable — the anchor may still be warming up.</CardContent></Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-subtle">Treasury Balance</CardTitle>
                <Wallet className="h-4 w-4 text-subtle" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-ink">
                  {isLoading ? '…' : fmt(data?.treasury.balance ?? null)}{' '}
                  <span className="text-sm font-medium text-subtle">{data?.asset.code}</span>
                </div>
                <p className="text-xs text-subtle">{isLoading ? '' : `${fmt(data?.treasury.xlm ?? null)} XLM for fees`}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-subtle">Transactions</CardTitle>
                <ArrowLeftRight className="h-4 w-4 text-subtle" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-ink">{isLoading ? '…' : data?.transactions.total ?? 0}</div>
                <p className="text-xs text-subtle">SEP-24 lifetime</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-subtle">Active Rails</CardTitle>
                <Landmark className="h-4 w-4 text-subtle" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-ink">{isLoading ? '…' : activeRails.length}</div>
                <p className="text-xs text-subtle">{activeRails.length ? activeRails.join(' · ') : 'all mock (add keys in Credentials)'}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base">Recent transactions</CardTitle></CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center gap-2 text-sm text-subtle"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
              ) : !data?.transactions.recent.length ? (
                <p className="py-4 text-sm text-subtle">No transactions yet. They&apos;ll appear here as customers deposit and withdraw.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-line text-left text-xs text-subtle">
                        <th className="py-2 pr-4 font-medium">Kind</th>
                        <th className="py-2 pr-4 font-medium">Status</th>
                        <th className="py-2 pr-4 font-medium">In</th>
                        <th className="py-2 pr-4 font-medium">Out</th>
                        <th className="py-2 font-medium">Started</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.transactions.recent.map((t) => (
                        <tr key={t.id} className="border-b border-line/60">
                          <td className="py-2 pr-4 capitalize text-ink">{t.kind}</td>
                          <td className="py-2 pr-4"><StatusPill status={t.status} /></td>
                          <td className="py-2 pr-4 text-ink">{t.amountIn ?? '—'}</td>
                          <td className="py-2 pr-4 text-ink">{t.amountOut ?? '—'}</td>
                          <td className="py-2 text-subtle">{t.startedAt ? new Date(t.startedAt).toLocaleString() : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const ok = status === 'completed';
  const pending = status.startsWith('pending');
  const cls = ok ? 'bg-emerald-100 text-emerald-700' : pending ? 'bg-amber-100 text-amber-700' : 'bg-surface-2 text-subtle';
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${cls}`}>{status}</span>;
}
