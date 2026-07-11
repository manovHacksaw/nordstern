/** Activity feed seed + status→tone mapping. Verbatim from the design prototype. */
import type { Tone } from '@/components/ui/badge';
import type { IconName } from '@/components/ui/icon';

export type ActivityStatus = 'Completed' | 'Processing' | 'Pending' | 'Failed';
export type ActivityType = 'deposit' | 'withdraw' | 'receive' | 'send' | 'swap' | 'crossborder';

export type ActivityRow = {
  id: number;
  type: ActivityType;
  title: string;
  sub: string;
  amount: string;
  up: boolean;
  status: ActivityStatus;
  time: string;
};

export const ACTIVITY: ActivityRow[] = [
  { id: 1, type: 'deposit', title: 'Deposit · Meridian', sub: 'UPI · aarav@okhdfc', amount: '+5,000.00 INRC', up: true, status: 'Completed', time: 'Today · 2:14 PM' },
  { id: 2, type: 'withdraw', title: 'Withdraw · Circle', sub: 'To bank ••4821', amount: '-200.00 USDC', up: false, status: 'Processing', time: 'Today · 11:02 AM' },
  { id: 3, type: 'receive', title: 'Received USDC', sub: 'From GB7X…9F2A', amount: '+500.00 USDC', up: true, status: 'Completed', time: 'Yesterday' },
  { id: 4, type: 'swap', title: 'Swapped XLM → USDC', sub: '350 XLM', amount: '+42.60 USDC', up: true, status: 'Completed', time: 'Yesterday' },
  { id: 5, type: 'deposit', title: 'Deposit · MoneyGram', sub: 'Cash · Walmart #221', amount: '+100.00 USDC', up: true, status: 'Pending', time: 'Jul 1' },
  { id: 6, type: 'crossborder', title: 'Sent to Nigeria', sub: 'Adaeze O. · bank', amount: '-150.00 USDC', up: false, status: 'Completed', time: 'Jun 30' },
  { id: 7, type: 'send', title: 'Sent XLM', sub: 'To vault.stellar', amount: '-50.00 XLM', up: false, status: 'Completed', time: 'Jun 30' },
];

/** Status → Badge tone (mirrors `STONE`). */
export const STATUS_TONE: Record<ActivityStatus, Tone> = {
  Completed: 'success',
  Processing: 'info',
  Pending: 'warning',
  Failed: 'error',
};

/** Activity type → leading icon (mirrors `TICON` keys — our icon set carries the same glyphs). */
export const TYPE_ICON: Record<ActivityType, IconName> = {
  deposit: 'deposit',
  withdraw: 'withdraw',
  receive: 'receive',
  send: 'send',
  swap: 'swap',
  crossborder: 'crossborder',
};
