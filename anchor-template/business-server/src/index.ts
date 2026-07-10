import { createApp } from './app.js';
import { startWithdrawalPoller } from './poller.js';
import { reconcileDepositReleases, startReleaseReconciler } from './releases.js';
import { startKycReconciler } from './adapters/kyc/didit.js';
import { runMigrations } from './migrate.js';
import { assertMainnetBootConfig } from './bootGuard.js';
import {
  PORT, ASSET_CODE, ASSET_ISSUER_PUBLIC, TREASURY_PUBLIC, PLATFORM_API_URL, IS_MAINNET, PROVIDERS,
} from './config.js';

// M0 boot guard: on mainnet, refuse to start unless every required production value is
// present and correct (treasury, Circle USDC issuer, Razorpay LIVE, DIDIT, NODE_ENV).
// Runs FIRST — before migrations, reconciliation, or serving — so we never touch money
// with a half-configured environment. No-op on testnet/dev.
assertMainnetBootConfig();

// Migrate-on-start (R6 M4.2) — replaces runtime initSchema() DDL. The idempotent
// baseline is a no-op on existing anchor DBs and creates fresh ones.
await runMigrations();

// Recover any deposit release left mid-flight by a prior crash before we serve
// traffic — settles on-chain-completed transfers and re-drives ones that never
// landed, so a restart never leaves funds sent-but-unrecorded.
await reconcileDepositReleases().catch((e) =>
  console.error('[reconcile] startup pass:', e instanceof Error ? e.message : e),
);

const app = createApp();
startWithdrawalPoller();
startReleaseReconciler();
// DIDIT webhooks can't reach per-anchor subdomains (one DIDIT account, many anchors) — poll
// PROCESSING sessions so KYC resolves without the callback. No-op unless the provider is DIDIT.
if (PROVIDERS.kyc === 'didit') startKycReconciler();

app.listen(PORT, () => {
  console.log(`\nNordStern Anchor — business-server on :${PORT}`);
  console.log(`  Network:   ${IS_MAINNET ? 'MAINNET' : 'TESTNET'}`);
  console.log(`  Asset:     ${ASSET_CODE}:${ASSET_ISSUER_PUBLIC || '(issuer not set)'}`);
  console.log(`  Treasury:  ${TREASURY_PUBLIC || '(not set)'}`);
  console.log(`  Platform:  ${PLATFORM_API_URL}`);
  console.log(`  Flows: SEP-24 deposit (USDC transfer) + withdrawal (poller payout)\n`);
});
