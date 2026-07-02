import { Networks } from '@stellar/stellar-sdk';

// ─── Environment ─────────────────────────────────────────────────────────────
// A business-server instance is single-tenant: the orchestrator injects one
// anchor's keys, asset, and adapter selection as env (DL-005/DL-006).

export const PORT               = process.env.PORT               ?? 3000;
export const PLATFORM_API_URL   = process.env.PLATFORM_API_URL   ?? 'http://anchor-platform:8085';
export const DISTRIBUTION_PUBLIC = process.env.DISTRIBUTION_PUBLIC ?? '';
export const DISTRIBUTION_SECRET = process.env.DISTRIBUTION_SECRET ?? '';
export const ASSET_ISSUER_PUBLIC = process.env.ASSET_ISSUER_PUBLIC ?? '';
export const ASSET_CODE         = process.env.ASSET_CODE         ?? 'ANCH';
export const HORIZON_URL        = process.env.HORIZON_URL        ?? 'https://horizon-testnet.stellar.org';
export const NET_PASS           = process.env.NETWORK_PASSPHRASE ?? Networks.TESTNET;
export const IS_MAINNET         = !HORIZON_URL.includes('testnet');

// SEP server (8080) sits alongside the Platform API (8085) on the same host.
export const SEP_SERVER_URL     = process.env.SEP_SERVER_URL ?? PLATFORM_API_URL.replace('8085', '8080');

export const assetId = () => `stellar:${ASSET_CODE}:${ASSET_ISSUER_PUBLIC}`;

// Adapter selection (mock-first). Real vendors live behind these seams.
export const PROVIDERS = {
  kyc:     process.env.KYC_PROVIDER     ?? 'mock',
  deposit: process.env.DEPOSIT_PROVIDER ?? 'mock',
  payout:  process.env.PAYOUT_PROVIDER  ?? 'mock',
  fee:     process.env.FEE_PROVIDER     ?? 'mock',
};
