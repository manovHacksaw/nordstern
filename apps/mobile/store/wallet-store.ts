/**
 * Wallet store — the app's state machine. Mirrors the design prototype's `DCLogic`
 * (see `design_handoff_stellar_anchor_wallet/Stellar Anchor Wallet.dc.html`), minus
 * the prototype's own `screen`/`stack` navigation: routing is expo-router's job here,
 * so screens call `router.push`/`router.back` and read flow state from this store.
 *
 * Everything is timer-simulated (processing → converting @1.2s → completed @2.6s).
 * No real network, no funds, no signing — this is a demo build. See decisions.md.
 */
import { create } from 'zustand';

import type { Tone } from '@/components/ui/badge';
import { anchorById, type Anchor } from '@/lib/anchors';
import type { MethodId } from '@/lib/anchors';
import { type AssetSym, type Balances, totalUsd } from '@/lib/assets';
import { fmt, parse } from '@/lib/format';
import { depositQuote } from '@/lib/quotes';

export type Flow = 'deposit' | 'withdraw' | 'crossborder' | null;
export type TxStatus = 'processing' | 'converting' | 'completed';
export type DestType = 'upi' | 'bank' | 'cash';
export type Toast = { tone: Tone; title: string; msg: string } | null;

/** The fields KYC entry may need to restore on the underlying flow (review = step 2). */
type KycReturn = number | null;

type WalletState = {
  balances: Balances;
  homeTab: 'tokens' | 'activity';

  // active flow
  flow: Flow;
  step: number;
  anchorId: string;
  asset: AssetSym;
  method: MethodId | null;

  // deposit / withdraw inputs
  fiat: string;
  assetAmt: string;
  destType: DestType;
  dest: string;

  // cross-border inputs
  cbCountry: string;
  cbMethod: string;
  cbName: string;
  cbAccount: string;
  cbAmt: string;

  // kyc
  kycVerified: boolean;
  kycStep: number;
  kycReturn: KycReturn;
  kycDone: boolean; // one-shot: consumed by the KYC screen to pop back
  kName: string;
  kDob: string;
  kAddr: string;
  kIdType: string;
  kIdNum: string;
  kSelfie: boolean;

  // ui
  toast: Toast;
  balancesHidden: boolean;
  conn: Record<string, boolean>;
  faceId: boolean;
  notif: boolean;
  txStatus: TxStatus;
};

type WalletActions = {
  // derived
  total: () => number;
  anchor: () => Anchor;
  isConnected: (id: string) => boolean;
  needKyc: () => boolean;

  // generic setters
  setField: <K extends keyof WalletState>(key: K, value: WalletState[K]) => void;
  setMethod: (m: MethodId | null) => void;
  setMax: () => void;

  // flow entry (screens navigate; this seeds flow state)
  startDeposit: (anchorId?: string, asset?: AssetSym) => void;
  startWithdraw: (anchorId?: string, asset?: AssetSym) => void;
  startCrossborder: () => void;

  // flow control
  proceed: () => void;
  prevStep: () => void;
  /** Amount→Review gate. Returns true if a KYC divert is required (caller pushes /kyc). */
  requestReview: () => boolean;
  runTx: () => void;

  // kyc
  startKyc: () => void;
  kycNext: () => void;
  kycBack: () => void;
  finishKyc: () => void;
  consumeKycDone: () => void;

  // misc
  toggleConnect: (id: string) => void;
  toggleHide: () => void;
  toggleFace: () => void;
  toggleNotif: () => void;
  flash: (tone: Tone, title: string, msg: string) => void;
  reset: () => void;
};

export type WalletStore = WalletState & WalletActions;

const initial: WalletState = {
  balances: { XLM: 4208.55, USDC: 1250, EURC: 300, INRC: 18400 },
  homeTab: 'tokens',
  flow: null,
  step: 0,
  anchorId: 'meridian',
  asset: 'INRC',
  method: null,
  fiat: '5,000',
  assetAmt: '4,975',
  destType: 'upi',
  dest: '',
  cbCountry: 'Nigeria',
  cbMethod: 'Bank deposit',
  cbName: '',
  cbAccount: '',
  cbAmt: '150',
  kycVerified: false,
  kycStep: 0,
  kycReturn: null,
  kycDone: false,
  kName: 'Aarav Sharma',
  kDob: '',
  kAddr: '',
  kIdType: 'Aadhaar',
  kIdNum: '',
  kSelfie: false,
  toast: null,
  balancesHidden: false,
  conn: {},
  faceId: true,
  notif: true,
  txStatus: 'processing',
};

// Timers live outside the store so re-runs can clear the previous cycle.
let t1: ReturnType<typeof setTimeout> | undefined;
let t2: ReturnType<typeof setTimeout> | undefined;
let tToast: ReturnType<typeof setTimeout> | undefined;
let tKyc: ReturnType<typeof setTimeout> | undefined;

export const useWallet = create<WalletStore>((set, get) => ({
  ...initial,

  total: () => totalUsd(get().balances),
  anchor: () => anchorById(get().anchorId),
  isConnected: (id) => {
    const o = get().conn[id];
    return o == null ? anchorById(id).connected : o;
  },
  needKyc: () => !get().kycVerified,

  setField: (key, value) => set({ [key]: value } as Partial<WalletState>),
  setMethod: (m) => set({ method: m }),
  setMax: () => set((s) => ({ assetAmt: fmt(s.balances[s.asset] || 0, 2) })),

  startDeposit: (anchorId, asset) =>
    set((s) => ({
      flow: 'deposit',
      step: 0,
      anchorId: anchorId ?? s.anchorId,
      asset: asset ?? s.asset,
      method: null,
      txStatus: 'processing',
    })),
  startWithdraw: (anchorId, asset) =>
    set((s) => ({
      flow: 'withdraw',
      step: 0,
      anchorId: anchorId ?? s.anchorId,
      asset: asset ?? s.asset,
      destType: 'upi',
      txStatus: 'processing',
    })),
  startCrossborder: () => set({ flow: 'crossborder', step: 0, txStatus: 'processing' }),

  proceed: () => set((s) => ({ step: s.step + 1 })),
  prevStep: () => set((s) => ({ step: Math.max(0, s.step - 1) })),

  // Gate lives ONLY here (Amount→Review). If unverified, we do NOT advance the step —
  // the caller pushes /kyc and the underlying flow stays on Amount, so backing out of
  // KYC cannot reach a confirmable Review. finishKyc() sets step=review on success.
  requestReview: () => {
    if (get().needKyc()) {
      set({ kycReturn: 2, kycStep: 0, kycDone: false });
      return true;
    }
    set({ step: 2 });
    return false;
  },

  runTx: () => {
    const flow = get().flow;
    set((s) => ({ step: s.step + 1, txStatus: 'processing' }));
    if (t1) clearTimeout(t1);
    if (t2) clearTimeout(t2);
    t1 = setTimeout(() => set({ txStatus: 'converting' }), 1200);
    t2 = setTimeout(() => {
      set((s) => {
        const b = { ...s.balances };
        if (flow === 'deposit') {
          // Bump by exactly what Review showed (getN), not the stale assetAmt. See decisions.md D-005.
          b[s.asset] = (b[s.asset] || 0) + depositQuote(s.fiat, anchorById(s.anchorId), s.asset).getN;
        } else if (flow === 'withdraw') {
          b[s.asset] = Math.max(0, (b[s.asset] || 0) - parse(s.assetAmt));
        } else if (flow === 'crossborder') {
          b.USDC = Math.max(0, (b.USDC || 0) - parse(s.cbAmt));
        }
        return { txStatus: 'completed', balances: b };
      });
    }, 2600);
  },

  startKyc: () => set({ kycStep: 0, kycReturn: null, kycDone: false }),
  kycNext: () => set((s) => ({ kycStep: s.kycStep + 1 })),
  kycBack: () => set((s) => ({ kycStep: Math.max(0, s.kycStep - 1) })),
  finishKyc: () => {
    set({ kycStep: 4 }); // verifying spinner
    if (tKyc) clearTimeout(tKyc);
    tKyc = setTimeout(() => {
      set((s) => ({
        kycVerified: true,
        kycDone: true,
        step: s.kycReturn != null ? s.kycReturn : s.step,
      }));
      get().flash('success', 'Identity verified', 'You’re all set to move money.');
    }, 1800);
  },
  consumeKycDone: () => set({ kycDone: false }),

  toggleConnect: (id) => {
    const now = !get().isConnected(id);
    set((s) => ({ conn: { ...s.conn, [id]: now } }));
    const a = anchorById(id);
    get().flash(
      'success',
      now ? 'Anchor connected' : 'Anchor disconnected',
      now ? `${a.name} is ready to use.` : `${a.name} was removed.`
    );
  },
  toggleHide: () => set((s) => ({ balancesHidden: !s.balancesHidden })),
  toggleFace: () => set((s) => ({ faceId: !s.faceId })),
  toggleNotif: () => set((s) => ({ notif: !s.notif })),
  flash: (tone, title, msg) => {
    set({ toast: { tone, title, msg } });
    if (tToast) clearTimeout(tToast);
    tToast = setTimeout(() => set({ toast: null }), 3200);
  },
  reset: () => set(initial),
}));
