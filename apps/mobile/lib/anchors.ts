/**
 * Anchor directory + funding methods. Verbatim from the design prototype.
 *
 * This is the mock seam: in production the anchor list comes from SEP-1 (stellar.toml)
 * and method/fee data from the anchor's info endpoint. Keep this shape so a real
 * loader can drop in behind `getAnchors()` / `anchorById()`.
 */
import type { IconName } from '@/components/ui/icon';
import type { AssetSym } from './assets';

export type MethodId = 'upi' | 'gpay' | 'imps' | 'card' | 'ach' | 'sepa' | 'wire' | 'cashin';

export type Method = { label: string; desc: string; badge: string };

export const METHODS: Record<MethodId, Method> = {
  upi: { label: 'UPI', desc: 'Pay from any UPI app', badge: 'Instant' },
  gpay: { label: 'Google Pay', desc: 'One-tap with GPay', badge: 'Instant' },
  imps: { label: 'Bank transfer', desc: 'IMPS / NEFT', badge: '~5 min' },
  card: { label: 'Debit / credit card', desc: 'Visa · Mastercard · RuPay', badge: 'Instant' },
  ach: { label: 'Bank transfer', desc: 'ACH', badge: '1–2 days' },
  sepa: { label: 'Bank transfer', desc: 'SEPA', badge: '1 day' },
  wire: { label: 'Wire', desc: 'Same-day domestic wire', badge: 'Same day' },
  cashin: { label: 'Cash deposit', desc: 'At any MoneyGram location', badge: 'Minutes' },
};

/** Method → icon name (bank rails share the bank glyph; cash uses the cash glyph). */
export const METHOD_ICON: Record<MethodId, IconName> = {
  upi: 'upi',
  gpay: 'gpay',
  imps: 'bank',
  ach: 'bank',
  sepa: 'bank',
  wire: 'bank',
  card: 'card',
  cashin: 'cash',
};

export type Anchor = {
  id: string;
  name: string;
  tagline: string;
  color: string;
  initials: string;
  region: string;
  assets: string[];
  rails: MethodId[];
  railLabels: string;
  feeNum: number;
  fee: string;
  settle: string;
  kyc: string;
  connected: boolean;
  featured?: boolean;
  blurb: string;
};

export const ANCHORS: Anchor[] = [
  {
    id: 'meridian',
    name: 'Meridian',
    tagline: 'Your anchor',
    color: '#00B39F',
    initials: 'M',
    region: 'India',
    assets: ['INRC'],
    rails: ['upi', 'gpay', 'imps', 'card'],
    railLabels: 'UPI · GPay · Bank · Card',
    feeNum: 0.005,
    fee: '0.5%',
    settle: 'Instant',
    kyc: 'Verified · Tier 2',
    connected: true,
    featured: true,
    blurb: 'Instant Indian Rupee on- and off-ramp over UPI, Google Pay and bank transfer.',
  },
  {
    id: 'circle',
    name: 'Circle',
    tagline: 'USDC · EURC issuer',
    color: '#2775CA',
    initials: 'C',
    region: 'US · Europe',
    assets: ['USDC', 'EURC'],
    rails: ['ach', 'sepa', 'wire', 'card'],
    railLabels: 'ACH · SEPA · Wire · Card',
    feeNum: 0.01,
    fee: '1.0%',
    settle: '1–2 days',
    kyc: 'Required',
    connected: true,
    blurb: 'Issuer of USDC and EURC. Fund in US dollars or euros by bank or card.',
  },
  {
    id: 'moneygram',
    name: 'MoneyGram Access',
    tagline: 'Cash in / out',
    color: '#E0457B',
    initials: 'MG',
    region: 'Global',
    assets: ['USDC'],
    rails: ['cashin'],
    railLabels: 'Cash pickup · deposit',
    feeNum: 0.015,
    fee: '1.5%',
    settle: 'Minutes',
    kyc: 'Required',
    connected: false,
    blurb: 'Turn cash into USDC — and back — at 350,000+ retail locations worldwide.',
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    tagline: 'Latin America',
    color: '#7B61FF',
    initials: 'V',
    region: 'LatAm',
    assets: ['USDC'],
    rails: ['ach'],
    railLabels: 'Local bank',
    feeNum: 0.009,
    fee: '0.9%',
    settle: 'Same day',
    kyc: 'Required',
    connected: false,
    blurb: 'USDC on- and off-ramp across Latin America by local bank transfer.',
  },
  {
    id: 'cowrie',
    name: 'Cowrie',
    tagline: 'Nigeria',
    color: '#F2994A',
    initials: 'Co',
    region: 'Nigeria',
    assets: ['NGNC'],
    rails: ['ach'],
    railLabels: 'Bank transfer',
    feeNum: 0.012,
    fee: '1.2%',
    settle: 'Same day',
    kyc: 'Required',
    connected: false,
    blurb: 'Nigerian Naira on- and off-ramp by bank transfer.',
  },
  {
    id: 'settle',
    name: 'Settle Network',
    tagline: 'Argentina · Brazil',
    color: '#6C7BF2',
    initials: 'S',
    region: 'LatAm',
    assets: ['ARST', 'BRLT'],
    rails: ['ach'],
    railLabels: 'Local bank · PIX',
    feeNum: 0.011,
    fee: '1.1%',
    settle: 'Same day',
    kyc: 'Required',
    connected: false,
    blurb: 'Peso and real on- and off-ramp for Argentina and Brazil.',
  },
];

export function anchorById(id: string): Anchor {
  return ANCHORS.find((a) => a.id === id) ?? ANCHORS[0];
}

/** Which anchor issues a given asset (used to route deposit/withdraw from asset detail). */
export function issuerAnchor(sym: AssetSym): string {
  if (sym === 'INRC') return 'meridian';
  if (sym === 'USDC' || sym === 'EURC') return 'circle';
  return 'meridian';
}
