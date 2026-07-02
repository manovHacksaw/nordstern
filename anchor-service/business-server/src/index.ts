import { createApp } from './app.js';
import { startWithdrawalPoller } from './poller.js';
import {
  PORT, DISTRIBUTION_PUBLIC, ASSET_ISSUER_PUBLIC, ASSET_CODE, PLATFORM_API_URL,
} from './config.js';

const app = createApp();
startWithdrawalPoller();

app.listen(PORT, () => {
  console.log(`\nBusiness Server listening on :${PORT}`);
  console.log(`  Asset:        ${ASSET_CODE}`);
  console.log(`  Distribution: ${DISTRIBUTION_PUBLIC || '(not set)'}`);
  console.log(`  Issuer:       ${ASSET_ISSUER_PUBLIC || '(not set)'}`);
  console.log(`  Platform API: ${PLATFORM_API_URL}`);
  console.log(`  Polling withdrawals every 15 s\n`);
});
