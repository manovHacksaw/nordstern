import { DepositProvider, DepositInstructions } from './DepositProvider.js';

// Mock deposit — the "wire to ACME Test Bank" placeholder. Clicking confirm in
// the webview simulates the wire and releases tokens (no real fiat).
export class MockDepositProvider implements DepositProvider {
  async instructions(params: { amount: string; assetCode: string; memo: string }): Promise<DepositInstructions> {
    return {
      label: 'Wire transfer to',
      lines: ['ACME Test Bank · Account #4821-7700', 'Routing: 021000021', `Reference memo: ${params.memo}`],
      note: `No real bank transfer needed here. Click confirm to simulate the wire transfer and instantly receive ${params.assetCode} tokens in your Stellar wallet.`,
    };
  }
}
