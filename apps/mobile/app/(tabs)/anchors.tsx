/**
 * Anchors directory (README §2) — browse anchors, connect them, and enter cross-border
 * send. H1 + blurb, a "Send money abroad" gradient banner (→ crossborder), then the
 * Connected / Available groups. Subscribes to `conn` so connect/disconnect re-splits
 * the list live. In production the anchor list comes from SEP-1 (see lib/anchors).
 */
import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { AppText } from '@/components/ui/text';
import { AnchorCard } from '@/components/wallet/anchor-card';
import { FeaturedBanner } from '@/components/wallet/featured-banner';
import { ANCHORS } from '@/lib/anchors';
import { useWallet } from '@/store/wallet-store';
import { useTheme } from '@/theme/theme-context';

export default function AnchorsScreen() {
  const router = useRouter();
  const { c } = useTheme();

  // Subscribe to `conn` for reactivity; isConnected() reads the same overrides.
  useWallet((s) => s.conn);
  const isConnected = useWallet((s) => s.isConnected);
  const startCrossborder = useWallet((s) => s.startCrossborder);

  const connected = ANCHORS.filter((a) => isConnected(a.id));
  const available = ANCHORS.filter((a) => !isConnected(a.id));

  return (
    <Screen scroll edges={['top']} contentStyle={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 24 }}>
      <AppText variant="h1" style={{ marginTop: 8, marginHorizontal: 2, marginBottom: 4 }}>
        Anchors
      </AppText>
      <AppText dim style={{ fontSize: 13.5, marginHorizontal: 2, marginBottom: 16, lineHeight: 19 }}>
        Move between crypto and your local money. Connect an anchor to deposit or withdraw.
      </AppText>

      <View style={{ marginBottom: 18 }}>
        <FeaturedBanner
          icon="crossborder"
          title="Send money abroad"
          subtitle="Cross-border payout via SEP-31"
          onPress={() => {
            startCrossborder();
            router.push('/crossborder');
          }}
        />
      </View>

      <AppText variant="bodyStrong" dim3 style={{ fontSize: 13, marginHorizontal: 2, marginBottom: 10 }}>
        Connected
      </AppText>
      {connected.map((a) => (
        <AnchorCard key={a.id} anchor={a} connected onPress={() => router.push(`/anchor/${a.id}`)} />
      ))}

      <AppText
        variant="bodyStrong"
        dim3
        style={{ fontSize: 13, marginHorizontal: 2, marginTop: 8, marginBottom: 10 }}>
        Available
      </AppText>
      {available.map((a) => (
        <AnchorCard key={a.id} anchor={a} onPress={() => router.push(`/anchor/${a.id}`)} />
      ))}
    </Screen>
  );
}
