/**
 * Asset detail (README §8) — avatar / mono balance / % change, a Perano sparkline,
 * Deposit / Withdraw / Swap, an issuer card, and a Recent list filtered to this asset.
 * Deposit/Withdraw route to the asset's issuing anchor (lib/anchors issuerAnchor).
 */
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { FlowScaffold } from '@/components/flow/flow-scaffold';
import { QuoteCard } from '@/components/flow/quote-card';
import { PrimaryButton, SecondaryButton } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { AppText } from '@/components/ui/text';
import { issuerAnchor } from '@/lib/anchors';
import { ACTIVITY, TYPE_ICON } from '@/lib/activity';
import { META, PRICES, type AssetSym } from '@/lib/assets';
import { fmt, money } from '@/lib/format';
import { useWallet } from '@/store/wallet-store';
import { useTheme } from '@/theme/theme-context';

export default function AssetDetailScreen() {
  const router = useRouter();
  const { c, radius } = useTheme();
  const { sym: symParam } = useLocalSearchParams<{ sym: string }>();
  const sym = (symParam ?? 'XLM') as AssetSym;

  const balances = useWallet((s) => s.balances);
  const startDeposit = useWallet((s) => s.startDeposit);
  const startWithdraw = useWallet((s) => s.startWithdraw);

  const m = META[sym];
  const bal = balances[sym] || 0;
  const usd = bal * (PRICES[sym] || 0);
  const recent = ACTIVITY.filter((x) => x.amount.includes(sym));

  return (
    <FlowScaffold title={m?.name ?? sym} onBack={() => router.back()}>
      {/* Balance header */}
      <View style={{ alignItems: 'center', paddingTop: 8, paddingBottom: 4 }}>
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 999,
            backgroundColor: m.color,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AppText variant="h3" color="#fff" style={{ fontSize: 20 }}>
            {sym.slice(0, 2)}
          </AppText>
        </View>
        <AppText variant="mono" color={c.text} style={{ fontSize: 32, marginTop: 12 }}>
          {fmt(bal, 2)} {sym}
        </AppText>
        <AppText variant="mono" dim style={{ fontSize: 14 }}>
          {money(usd)} · <AppText variant="mono" color={m.up ? c.success : c.error} style={{ fontSize: 14 }}>{m.chg}</AppText>
        </AppText>
      </View>

      {/* Sparkline */}
      <View style={{ height: 96, marginTop: 16, marginBottom: 8 }}>
        <Svg width="100%" height="100%" viewBox="0 0 300 96" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={c.brand500} stopOpacity={0.28} />
              <Stop offset="100%" stopColor={c.brand500} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Path
            d="M0 70 L30 62 L60 66 L90 48 L120 54 L150 36 L180 42 L210 26 L240 32 L270 18 L300 22 L300 96 L0 96 Z"
            fill="url(#spark)"
          />
          <Path
            d="M0 70 L30 62 L60 66 L90 48 L120 54 L150 36 L180 42 L210 26 L240 32 L270 18 L300 22"
            fill="none"
            stroke={c.brand500}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>

      {/* Actions */}
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 14, marginBottom: 4 }}>
        <View style={{ flex: 1 }}>
          <PrimaryButton
            label="Deposit"
            style={{ height: 44 }}
            onPress={() => {
              startDeposit(issuerAnchor(sym), sym);
              router.push('/deposit');
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <SecondaryButton
            label="Withdraw"
            style={{ height: 44 }}
            onPress={() => {
              startWithdraw(issuerAnchor(sym), sym);
              router.push('/withdraw');
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <SecondaryButton label="Swap" style={{ height: 44 }} onPress={() => router.push('/swap')} />
        </View>
      </View>

      {/* Issuer / asset */}
      <View style={{ marginTop: 16 }}>
        <QuoteCard
          rows={[
            { label: 'Issuer', value: m.issuer, plain: true },
            { label: 'Asset', value: sym },
          ]}
        />
      </View>

      {/* Recent (filtered to this asset) */}
      <AppText variant="bodyStrong" dim3 style={{ fontSize: 13, marginTop: 20, marginHorizontal: 2, marginBottom: 6 }}>
        Recent
      </AppText>
      {recent.map((x) => (
        <View
          key={x.id}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingVertical: 11,
            paddingHorizontal: 2,
            borderBottomWidth: 1,
            borderBottomColor: c.border,
          }}>
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 999,
              backgroundColor: c.surface2,
              borderWidth: 1,
              borderColor: c.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name={TYPE_ICON[x.type]} size={18} color={c.brand500} strokeWidth={1.9} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <AppText variant="bodyStrong" color={c.text}>
              {x.title}
            </AppText>
            <AppText variant="caption" dim>
              {x.time}
            </AppText>
          </View>
          <AppText variant="mono" color={x.up ? c.success : c.text} style={{ fontSize: 13.5 }}>
            {x.amount}
          </AppText>
        </View>
      ))}
    </FlowScaffold>
  );
}
