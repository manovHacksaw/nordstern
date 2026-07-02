import {
  Keypair, Networks, Horizon, Asset, TransactionBuilder, BASE_FEE, Operation,
} from '@stellar/stellar-sdk';

// ─── Stellar provisioning ──────────────────────────────────────────────────────
// Extracted from the old tenants.ts and scripts/setup-testnet.mjs so the factory
// and the CLI share one implementation. Testnet-only (Friendbot); mainnet is a
// deliberate later config swap (AGENTS.md §7).

const HORIZON_URL        = process.env.HORIZON_URL        ?? 'https://horizon-testnet.stellar.org';
const FRIENDBOT_URL      = process.env.FRIENDBOT_URL      ?? 'https://friendbot.stellar.org';
const NETWORK_PASSPHRASE = process.env.NETWORK_PASSPHRASE ?? Networks.TESTNET;
const INITIAL_SUPPLY     = process.env.INITIAL_SUPPLY     ?? '1000000';
const TRUST_LIMIT        = '10000000';

const horizon = new Horizon.Server(HORIZON_URL);

export interface AnchorKeypairs {
  signing: Keypair;
  distribution: Keypair;
  issuer: Keypair;
}

const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

export function generateKeypairs(): AnchorKeypairs {
  return {
    signing:      Keypair.random(),
    distribution: Keypair.random(),
    issuer:       Keypair.random(),
  };
}

/** Derive a valid Stellar asset code (1–12 alphanumerics) from an anchor slug. */
export function assetCodeFromSlug(slug: string): string {
  const cleaned = slug.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 12);
  return cleaned || 'ANCH';
}

async function fund(kp: Keypair): Promise<void> {
  const res = await fetch(`${FRIENDBOT_URL}?addr=${kp.publicKey()}`);
  if (!res.ok) throw new Error(`Friendbot failed for ${kp.publicKey()}: ${await res.text()}`);
}

/**
 * Fund all three accounts, create the distribution→issuer trustline, and mint the
 * initial supply to the distribution account. Idempotency is the caller's job
 * (provisioning runs once per anchor).
 */
export async function provisionAssetOnChain(kps: AnchorKeypairs, assetCode: string): Promise<void> {
  await fund(kps.signing);
  await fund(kps.distribution);
  await fund(kps.issuer);
  await wait(5000); // let the ledger confirm account creation

  const asset = new Asset(assetCode, kps.issuer.publicKey());

  const distAcc = await horizon.loadAccount(kps.distribution.publicKey());
  const trustTx = new TransactionBuilder(distAcc, { fee: BASE_FEE, networkPassphrase: NETWORK_PASSPHRASE })
    .addOperation(Operation.changeTrust({ asset, limit: TRUST_LIMIT }))
    .setTimeout(30).build();
  trustTx.sign(kps.distribution);
  await horizon.submitTransaction(trustTx);
  await wait(3000);

  const issuerAcc = await horizon.loadAccount(kps.issuer.publicKey());
  const mintTx = new TransactionBuilder(issuerAcc, { fee: BASE_FEE, networkPassphrase: NETWORK_PASSPHRASE })
    .addOperation(Operation.payment({ destination: kps.distribution.publicKey(), asset, amount: INITIAL_SUPPLY }))
    .setTimeout(30).build();
  mintTx.sign(kps.issuer);
  await horizon.submitTransaction(mintTx);
}
