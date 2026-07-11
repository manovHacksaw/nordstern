/** Wallet / Home — net worth at a glance + entry to every money movement (README §1). */
import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { ActivityRow } from '@/components/wallet/activity-row';
import { BalanceHeader } from '@/components/wallet/balance-header';
import { FeaturedBanner } from '@/components/wallet/featured-banner';
import { QuickActions } from '@/components/wallet/quick-actions';
import { Segmented } from '@/components/wallet/segmented';
import { TokenRow } from '@/components/wallet/token-row';
import { ACTIVITY } from '@/lib/activity';
import { ORDER, totalUsd } from '@/lib/assets';
import { money } from '@/lib/format';
import { useWallet } from '@/store/wallet-store';

export default function HomeScreen() {
  const router = useRouter();
  const balances = useWallet((s) => s.balances);
  const balancesHidden = useWallet((s) => s.balancesHidden);
  const homeTab = useWallet((s) => s.homeTab);
  const setField = useWallet((s) => s.setField);
  const startDeposit = useWallet((s) => s.startDeposit);
  const startWithdraw = useWallet((s) => s.startWithdraw);
  const flash = useWallet((s) => s.flash);

  const total = balancesHidden ? '••••••' : money(totalUsd(balances));

  return (
    <Screen scroll edges={['top']} contentStyle={{ paddingBottom: 24 }}>
      <BalanceHeader
        total={total}
        onScan={() => flash('info', 'Scan to pay', 'The QR scanner would open here.')}
      />

      <View style={{ paddingHorizontal: 18, paddingTop: 16, paddingBottom: 18 }}>
        <QuickActions
          onDeposit={() => {
            startDeposit();
            router.push('/deposit');
          }}
          onWithdraw={() => {
            startWithdraw();
            router.push('/withdraw');
          }}
          onSend={() => router.push('/send')}
          onReceive={() => router.push('/receive')}
          onSwap={() => router.push('/swap')}
        />
      </View>

      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        <FeaturedBanner
          icon="upi"
          title="Add money instantly"
          subtitle="UPI, Google Pay & bank via Meridian"
          onPress={() => {
            startDeposit('meridian', 'INRC');
            router.push('/deposit');
          }}
        />
      </View>

      <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
        <Segmented
          options={[
            { value: 'tokens', label: 'Tokens' },
            { value: 'activity', label: 'Activity' },
          ]}
          value={homeTab}
          onChange={(v) => setField('homeTab', v)}
        />
      </View>

      {homeTab === 'tokens' ? (
        <View style={{ paddingHorizontal: 8 }}>
          {ORDER.map((sym) => (
            <TokenRow
              key={sym}
              sym={sym}
              balance={balances[sym] || 0}
              hidden={balancesHidden}
              onPress={() => router.push(`/asset/${sym}`)}
            />
          ))}
        </View>
      ) : (
        <View style={{ paddingHorizontal: 12 }}>
          {ACTIVITY.slice(0, 4).map((row) => (
            <ActivityRow key={row.id} row={row} border />
          ))}
        </View>
      )}
    </Screen>
  );
}
