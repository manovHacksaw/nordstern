/** Asset catalog — prices, metadata, display order, fiat mapping. Verbatim from the design. */

export type AssetSym = 'XLM' | 'USDC' | 'EURC' | 'INRC';
export type FiatCode = 'INR' | 'USD' | 'EUR' | 'NGN';

/** USD price per unit. Includes NGNC (issued via cross-border, not a home balance). */
export const PRICES: Record<string, number> = {
  XLM: 0.1218,
  USDC: 1,
  EURC: 1.09,
  INRC: 0.012004,
  NGNC: 0.00065,
};

export type AssetMeta = { name: string; color: string; chg: string; up: boolean; issuer: string };

export const META: Record<AssetSym, AssetMeta> = {
  XLM: { name: 'Stellar Lumens', color: '#5B54C9', chg: '+3.24%', up: true, issuer: 'Native asset' },
  USDC: { name: 'USD Coin', color: '#2775CA', chg: '0.00%', up: true, issuer: 'Circle' },
  EURC: { name: 'Euro Coin', color: '#1A4D8F', chg: '+0.12%', up: true, issuer: 'Circle' },
  INRC: { name: 'Indian Rupee', color: '#00B39F', chg: '0.00%', up: true, issuer: 'Meridian' },
};

/** Home-screen token order. */
export const ORDER: AssetSym[] = ['XLM', 'USDC', 'EURC', 'INRC'];

/** Home-balance map. */
export type Balances = Record<AssetSym, number>;

/** Total portfolio value in USD (mirrors the prototype's `total()`). */
export function totalUsd(balances: Balances): number {
  return ORDER.reduce((t, s) => t + (balances[s] || 0) * (PRICES[s] || 0), 0);
}

export const FIAT: Record<string, { code: FiatCode; sym: string }> = {
  INRC: { code: 'INR', sym: '₹' },
  USDC: { code: 'USD', sym: '$' },
  EURC: { code: 'EUR', sym: '€' },
  NGNC: { code: 'NGN', sym: '₦' },
};

export function fiatFor(sym: string): { code: FiatCode; sym: string } {
  return FIAT[sym] ?? { code: 'USD', sym: '$' };
}
