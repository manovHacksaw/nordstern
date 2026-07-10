import { Networks } from '@stellar/stellar-sdk';
import {
  IS_MAINNET, NET_PASS, ASSET_CODE, ASSET_ISSUER_PUBLIC,
  TREASURY_PUBLIC, TREASURY_SECRET, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET,
  DIDIT_API_KEY, PROVIDERS,
} from './config.js';

// ─── Mainnet boot guard (M0) ─────────────────────────────────────────────────────
// On mainnet, real customer money moves. Rather than boot with a missing or wrong
// production value and misbehave silently during a demo, we assert EVERY required
// value up front and refuse to start if any is absent or wrong. No defaults, no
// fallbacks, no warnings — FATAL and exit. Testnet/dev anchors (the same shared image)
// skip the guard entirely, so nothing non-mainnet is affected.

// Circle's official mainnet USDC issuer (verified against Circle developer docs).
const CIRCLE_USDC_MAINNET_ISSUER = 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN';

export function assertMainnetBootConfig(): void {
  if (!IS_MAINNET) return; // testnet / local dev — guard does not apply

  const problems: string[] = [];

  // Network must be the real public network.
  if (NET_PASS !== Networks.PUBLIC) {
    problems.push(`NETWORK_PASSPHRASE must be the PUBLIC network ("${Networks.PUBLIC}")`);
  }
  // Asset must be real Circle USDC — never a self-issued / same-named lookalike.
  if (ASSET_CODE !== 'USDC') {
    problems.push('ASSET_CODE must be "USDC" on mainnet (external-asset model)');
  }
  if (ASSET_ISSUER_PUBLIC !== CIRCLE_USDC_MAINNET_ISSUER) {
    problems.push(`ASSET_ISSUER_PUBLIC must be Circle's mainnet USDC issuer (${CIRCLE_USDC_MAINNET_ISSUER})`);
  }
  // Treasury (the funded USDC float we transfer from) must be present.
  if (!TREASURY_PUBLIC) problems.push('TREASURY_PUBLIC is required (funded mainnet treasury account)');
  if (!TREASURY_SECRET) problems.push('TREASURY_SECRET is required (to sign USDC transfers)');

  // On-ramp must be Razorpay LIVE — a real INR collection, never test mode.
  if (PROVIDERS.deposit !== 'razorpay') {
    problems.push('DEPOSIT_PROVIDER must be "razorpay" on mainnet (real on-ramp, no mock)');
  }
  if (!RAZORPAY_KEY_ID.startsWith('rzp_live_')) {
    problems.push('RAZORPAY_KEY_ID must be a LIVE key ("rzp_live_…") on mainnet — test keys move no real INR');
  }
  if (!RAZORPAY_KEY_SECRET) problems.push('RAZORPAY_KEY_SECRET is required');

  // Identity must be real DIDIT — never mock (mock KYC auto-approves everyone).
  if (PROVIDERS.kyc !== 'didit') {
    problems.push('KYC_PROVIDER must be "didit" on mainnet (real identity, no mock)');
  }
  if (!DIDIT_API_KEY) problems.push('DIDIT_API_KEY is required');

  // Deliberate production posture.
  if (process.env.NODE_ENV !== 'production') {
    problems.push('NODE_ENV must be "production" on mainnet');
  }

  if (problems.length > 0) {
    console.error('\n╔══════════════════════════════════════════════════════════════╗');
    console.error('║  FATAL — mainnet boot guard: refusing to start.              ║');
    console.error('╚══════════════════════════════════════════════════════════════╝\n');
    console.error('External-asset (mainnet USDC) mode requires all of these, and one or more is missing/wrong:\n');
    for (const p of problems) console.error('  ✗ ' + p);
    console.error('\nNo defaults. No fallbacks. Fix the environment and restart.\n');
    process.exit(1);
  }

  console.log('[boot-guard] mainnet production config validated ✓');
}
