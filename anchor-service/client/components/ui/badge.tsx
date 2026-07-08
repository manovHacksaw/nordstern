import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'outline' | 'solid' | 'brand' | 'muted' | 'up' | 'down' | 'pending';

const VARIANT: Record<Variant, string> = {
  outline: 'border border-line bg-white text-ink',
  solid: 'bg-ink text-white',
  brand: 'bg-brand-100 text-brand-800',
  muted: 'bg-surface text-muted',
  up: 'bg-emerald-100 text-emerald-700',
  down: 'bg-red-100 text-red-700',
  pending: 'bg-amber-100 text-amber-700',
};

// Small rounded label / chip. Used for eyebrows and transaction status tags.
export function Badge({ children, className, variant = 'outline' }: { children: ReactNode; className?: string; variant?: Variant }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-pill px-2.5 py-0.5 text-xs font-medium', VARIANT[variant], className)}>
      {children}
    </span>
  );
}
