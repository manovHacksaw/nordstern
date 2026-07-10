import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Metric tile — one number that matters. Matches the landing Kori KPI: label, big tabular value,
// sublabel, optional icon. Keeps every KPI visually identical across modules.
export function Stat({
  label,
  value,
  sub,
  icon: Icon,
  loading,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  loading?: boolean;
  accent?: 'default' | 'danger';
}) {
  return (
    <Card className="p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_2px_5px_rgba(24,22,54,0.05),0_22px_48px_-24px_rgba(34,24,78,0.24)]">
      <div className="flex items-start justify-between">
        <p className="text-[12.5px] font-medium text-muted-foreground">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-subtle" />}
      </div>
      {loading ? (
        <Skeleton className="mt-4 h-7 w-28" />
      ) : (
        <p
          className={
            accent === 'danger'
              ? 'mt-3.5 text-[27px] font-medium leading-none tracking-[-0.02em] tabular-nums text-[color:var(--color-down)] sm:text-[29px]'
              : 'mt-3.5 text-[27px] font-medium leading-none tracking-[-0.02em] tabular-nums text-[#1c1b26] sm:text-[29px]'
          }
        >
          {value}
        </p>
      )}
      {sub != null && <p className="mt-2.5 text-[11.5px] text-subtle">{loading ? '' : sub}</p>}
    </Card>
  );
}
