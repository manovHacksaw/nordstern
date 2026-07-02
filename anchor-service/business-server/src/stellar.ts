import {
  Keypair, Horizon, TransactionBuilder, BASE_FEE, Operation, Asset,
} from '@stellar/stellar-sdk';
import {
  DISTRIBUTION_PUBLIC, DISTRIBUTION_SECRET, ASSET_ISSUER_PUBLIC, ASSET_CODE,
  HORIZON_URL, NET_PASS,
} from './config.js';

// ─── Stellar operations ────────────────────────────────────────────────────────

// Deterministic memo derived from the transaction ID. Used for withdrawals: the
// Platform stores it and the Observer matches incoming payments by it.
export function generateMemo(transactionId: string): string {
  return transactionId.replace(/-/g, '').slice(0, 8).toUpperCase();
}

// Deposit: send freshly-minted ANCH from the distribution account to the user.
export async function sendAnch(destinationAccount: string, amount: string): Promise<string> {
  if (!DISTRIBUTION_SECRET) throw new Error('DISTRIBUTION_SECRET not set');
  const horizonServer = new Horizon.Server(HORIZON_URL);
  const keypair = Keypair.fromSecret(DISTRIBUTION_SECRET);
  const asset = new Asset(ASSET_CODE, ASSET_ISSUER_PUBLIC);

  const distAccount = await horizonServer.loadAccount(DISTRIBUTION_PUBLIC);
  const tx = new TransactionBuilder(distAccount, { fee: BASE_FEE, networkPassphrase: NET_PASS })
    .addOperation(Operation.payment({ destination: destinationAccount, asset, amount }))
    .setTimeout(30)
    .build();

  tx.sign(keypair);
  const result = await horizonServer.submitTransaction(tx);
  return (result as any).hash;
}
