import { FeeProvider, FeeQuery, FeeQuote } from './FeeProvider.js';
import { assetId } from '../../config.js';

// Mock fee — zero fee. Replaces the inline `'0'` stub. Real spread/fee logic
// (percentage from tenant_config) is a later slice.
export class MockFeeProvider implements FeeProvider {
  async quote(q: FeeQuery): Promise<FeeQuote> {
    return { asset: q.sendAsset ?? assetId(), amount: '0' };
  }
}
