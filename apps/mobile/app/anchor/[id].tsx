/**
 * Anchor detail (README §3) — understand an anchor and connect / deposit / withdraw.
 * Centered avatar/name/tagline + a connect toggle pill, a blurb, Supported-assets chips,
 * Funding-methods rows, a fee/settlement/identity card, and a sticky Deposit/Withdraw
 * footer. Subscribes to `conn` so the pill flips the instant it's toggled.
 */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { FlowScaffold } from '@/components/flow/flow-scaffold';
import { QuoteCard } from '@/components/flow/quote-card';
import { PrimaryButton, SecondaryButton } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { AppText } from '@/components/ui/text';
import { anchorById, METHODS, METHOD_ICON, type MethodId } from '@/lib/anchors';
import type { AssetSym } from '@/lib/assets';
import { useWallet } from '@/store/wallet-store';
import { useTheme } from '@/theme/theme-context';

export default function AnchorDetailScreen() {
  const router = useRouter();
  const { c, radius } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const anchor = anchorById(id ?? 'meridian');

  // Subscribe to `conn` so a toggle re-renders the pill; isConnected reads it.
  useWallet((s) => s.conn);
  const isConnected = useWallet((s) => s.isConnected);
  const toggleConnect = useWallet((s) => s.toggleConnect);
  const startDeposit = useWallet((s) => s.startDeposit);
  const startWithdraw = useWallet((s) => s.startWithdraw);

  const connected = isConnected(anchor.id);
  const asset0 = anchor.assets[0] as AssetSym;

  const footer = (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <View style={{ flex: 1 }}>
        <PrimaryButton
          label="Deposit"
          onPress={() => {
            startDeposit(anchor.id, asset0);
            router.push('/deposit');
          }}
        />
      </View>
      <View style={{ flex: 1 }}>
        <SecondaryButton
          label="Withdraw"
          onPress={() => {
            startWithdraw(anchor.id, asset0);
            router.push('/withdraw');
          }}
        />
      </View>
    </View>
  );

  return (
    <FlowScaffold title="Anchor details" onBack={() => router.back()} footer={footer}>
      {/* Identity */}
      <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 16 }}>
        <View
          style={{
            width: 66,
            height: 66,
            borderRadius: 999,
            backgroundColor: anchor.color,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AppText variant="h3" color="#fff" style={{ fontSize: 24 }}>
            {anchor.initials}
          </AppText>
        </View>
        <AppText variant="h3" color={c.text} style={{ fontSize: 22, marginTop: 14, marginBottom: 2 }}>
          {anchor.name}
        </AppText>
        <AppText dim style={{ fontSize: 13 }}>
          {anchor.tagline} · {anchor.region}
        </AppText>
        <Pressable
          onPress={() => toggleConnect(anchor.id)}
          style={{
            marginTop: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: connected ? c.successFill : c.brand100,
            borderRadius: 999,
            paddingVertical: 7,
            paddingHorizontal: 16,
          }}>
          <AppText variant="bodyStrong" color={connected ? c.success : c.brandText} style={{ fontSize: 13 }}>
            {connected ? '✓ Connected · tap to remove' : 'Connect anchor'}
          </AppText>
        </Pressable>
      </View>

      <AppText dim style={{ fontSize: 14, lineHeight: 21, textAlign: 'center', marginHorizontal: 4, marginBottom: 18 }}>
        {anchor.blurb}
      </AppText>

      {/* Supported assets */}
      <View
        style={{
          backgroundColor: c.surface,
          borderWidth: 1,
          borderColor: c.border,
          borderRadius: radius.lg,
          padding: 16,
          marginBottom: 12,
        }}>
        <AppText dim3 style={{ fontSize: 12, marginBottom: 10 }}>
          Supported assets
        </AppText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {anchor.assets.map((sym) => (
            <View
              key={sym}
              style={{
                backgroundColor: c.surface2,
                borderWidth: 1,
                borderColor: c.border,
                borderRadius: 999,
                paddingVertical: 6,
                paddingHorizontal: 12,
              }}>
              <AppText variant="monoStrong" color={c.text} style={{ fontSize: 13 }}>
                {sym}
              </AppText>
            </View>
          ))}
        </View>
      </View>

      {/* Funding methods */}
      <View
        style={{
          backgroundColor: c.surface,
          borderWidth: 1,
          borderColor: c.border,
          borderRadius: radius.lg,
          padding: 16,
          marginBottom: 12,
        }}>
        <AppText dim3 style={{ fontSize: 12, marginBottom: 6 }}>
          Funding methods
        </AppText>
        {anchor.rails.map((rid: MethodId) => (
          <View key={rid} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                backgroundColor: c.surface2,
                borderWidth: 1,
                borderColor: c.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon name={METHOD_ICON[rid]} size={19} color={c.brand500} strokeWidth={1.8} />
            </View>
            <View>
              <AppText variant="bodyStrong" color={c.text}>
                {METHODS[rid].label}
              </AppText>
              <AppText variant="caption" dim>
                {METHODS[rid].desc}
              </AppText>
            </View>
          </View>
        ))}
      </View>

      {/* Fee / settlement / identity */}
      <QuoteCard
        rows={[
          { label: 'Fee', value: anchor.fee },
          { label: 'Settlement', value: anchor.settle },
          { label: 'Identity', value: anchor.kyc, plain: true },
        ]}
      />
    </FlowScaffold>
  );
}
