'use client';

import { ExternalLink } from 'lucide-react';
import { useAnchor } from '@/components/anchor-context';
import { cn } from '@/lib/cn';

// Deep-links Stellar accounts and on-chain transaction hashes to the block explorer
// (stellar.expert), on the anchor's own network. Use for G… addresses and stellar_transaction
// hashes — NOT for the Anchor Platform's internal transaction UUID (that isn't on-chain).

const netSlug = (n: string) => (n === 'mainnet' || n === 'public' ? 'public' : 'testnet');

export function explorerUrl(kind: 'account' | 'tx', value: string, network: string): string {
  return `https://stellar.expert/explorer/${netSlug(network)}/${kind}/${value}`;
}

export function ExplorerLink({
  kind, value, children, className, icon = true,
}: {
  kind: 'account' | 'tx';
  value: string | null | undefined;
  children?: React.ReactNode;
  className?: string;
  icon?: boolean;
}) {
  const { network } = useAnchor();
  if (!value) return <span className={className}>—</span>;
  return (
    <a
      href={explorerUrl(kind, value, network)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}  // don't trigger a parent row's onClick
      className={cn('inline-flex items-center gap-1 transition-colors hover:text-brand-700 hover:underline', className)}
      title="View on Stellar block explorer"
    >
      {children ?? value}
      {icon && <ExternalLink className="h-3 w-3 shrink-0 opacity-50" />}
    </a>
  );
}
