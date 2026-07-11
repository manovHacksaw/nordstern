/**
 * Withdraw (off-ramp) — 4 steps: Amount → Destination → Review → Status (README §5).
 * Mirrors the deposit flow's chrome/store wiring; the Destination→Review transition is
 * KYC-gated (diverts to /kyc). Fiat payout is simulated — no real PSP. See decisions.md.
 */
import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { AmountInput } from '@/components/flow/amount-input';
import { FlowScaffold } from '@/components/flow/flow-scaffold';
import { ProgressBars } from '@/components/flow/progress-bars';
import { QuoteCard } from '@/components/flow/quote-card';
import { StatusHero } from '@/components/flow/status-hero';
import { StatusTimeline, type TimelineState } from '@/components/flow/status-timeline';
import { Alert } from '@/components/ui/alert';
import { PrimaryButton } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { AppText } from '@/components/ui/text';
import { Segmented } from '@/components/wallet/segmented';
import { anchorById } from '@/lib/anchors';
import type { AssetSym } from '@/lib/assets';
import { fmt } from '@/lib/format';
import { withdrawQuote } from '@/lib/quotes';
import { useWallet, type DestType } from '@/store/wallet-store';
import { useTheme } from '@/theme/theme-context';

const STEP_LABELS = ['Amount', 'Destination', 'Review'];

const DEST_META: Record<DestType, { label: string; placeholder: string }> = {
  upi: { label: 'UPI ID', placeholder: 'name@bank' },
  bank: { label: 'Bank account number', placeholder: '5729 1183 4471' },
  cash: { label: 'Recipient name', placeholder: 'Full name' },
};

export default function WithdrawScreen() {
  const router = useRouter();
  const { c, radius } = useTheme();

  const step = useWallet((s) => s.step);
  const anchorId = useWallet((s) => s.anchorId);
  const asset = useWallet((s) => s.asset) as AssetSym;
  const assetAmt = useWallet((s) => s.assetAmt);
  const destType = useWallet((s) => s.destType);
  const dest = useWallet((s) => s.dest);
  const balances = useWallet((s) => s.balances);
  const txStatus = useWallet((s) => s.txStatus);

  const setField = useWallet((s) => s.setField);
  const setMax = useWallet((s) => s.setMax);
  const proceed = useWallet((s) => s.proceed);
  const prevStep = useWallet((s) => s.prevStep);
  const requestReview = useWallet((s) => s.requestReview);
  const runTx = useWallet((s) => s.runTx);

  const anchor = anchorById(anchorId);
  const q = withdrawQuote(assetAmt, anchor, asset);
  const balanceStr = `${fmt(balances[asset] || 0, 2)} ${asset}`;

  const onBack = () => {
    if (step === 0) router.back();
    else prevStep();
  };
  const onReview = () => {
    if (requestReview()) router.push('/kyc');
  };

  const timeline: { label: string; state: TimelineState }[] = [
    { label: `Sent to ${anchor.name}`, state: txStatus === 'processing' ? 'active' : 'done' },
    {
      label: `Converting to ${q.fiatCode || 'cash'}`,
      state: txStatus === 'processing' ? 'pending' : txStatus === 'converting' ? 'active' : 'done',
    },
    { label: 'Paid out to you', state: txStatus === 'completed' ? 'done' : 'pending' },
  ];

  let footer: React.ReactNode = null;
  if (step === 0) footer = <PrimaryButton label="Continue" onPress={proceed} />;
  else if (step === 1) footer = <PrimaryButton label="Continue" onPress={onReview} />;
  else if (step === 2) footer = <PrimaryButton label="Confirm & withdraw" onPress={runTx} />;
  else if (step === 3) footer = <PrimaryButton label="Done" onPress={() => router.dismissAll()} />;

  return (
    <FlowScaffold
      title="Withdraw"
      showBack={step < 3}
      onBack={onBack}
      progress={step < 3 ? <ProgressBars labels={STEP_LABELS} step={step} /> : null}
      footer={footer}>
      {/* Step 0 · Amount */}
      {step === 0 && (
        <View>
          <AmountInput
            label="You withdraw"
            suffix={asset}
            value={assetAmt}
            onChangeText={(v) => setField('assetAmt', v)}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: 12,
            }}>
            <AppText variant="mono" dim3 style={{ fontSize: 12 }}>
              Available {balanceStr}
            </AppText>
            <AppText
              onPress={setMax}
              variant="bodyStrong"
              color={c.brandText}
              style={{
                fontSize: 11,
                backgroundColor: c.brand100,
                borderRadius: 999,
                paddingVertical: 4,
                paddingHorizontal: 10,
                overflow: 'hidden',
              }}>
              MAX
            </AppText>
          </View>
          <View style={{ marginTop: 16 }}>
            <QuoteCard
              rows={[
                { label: 'You send', value: q.youSend },
                { label: `Anchor fee · ${q.feePct}`, value: q.feeStr },
                { label: 'Rate', value: q.rateStr },
                { label: 'You receive', value: q.youGet, emphasize: true },
              ]}
            />
          </View>
        </View>
      )}

      {/* Step 1 · Destination */}
      {step === 1 && (
        <View>
          <AppText variant="bodyStrong" dim3 style={{ fontSize: 13, marginTop: 6, marginBottom: 10 }}>
            Where should the money go?
          </AppText>
          <View style={{ marginBottom: 16 }}>
            <Segmented<DestType>
              options={[
                { value: 'upi', label: 'UPI ID' },
                { value: 'bank', label: 'Bank account' },
                { value: 'cash', label: 'Cash pickup' },
              ]}
              value={destType}
              onChange={(v) => setField('destType', v)}
            />
          </View>
          <Field
            label={DEST_META[destType].label}
            placeholder={DEST_META[destType].placeholder}
            value={dest}
            onChangeText={(v) => setField('dest', v)}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 11,
              backgroundColor: c.surface,
              borderWidth: 1,
              borderColor: c.border,
              borderRadius: radius.md,
              padding: 12,
              marginTop: 16,
            }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                backgroundColor: anchor.color,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <AppText variant="bodyStrong" color="#fff" style={{ fontSize: 13 }}>
                {anchor.initials}
              </AppText>
            </View>
            <View>
              <AppText dim3 style={{ fontSize: 11.5 }}>
                Cashing out via
              </AppText>
              <AppText variant="bodyStrong" color={c.text}>
                {anchor.name}
              </AppText>
            </View>
          </View>
        </View>
      )}

      {/* Step 2 · Review (gated) */}
      {step === 2 && (
        <View>
          <View style={{ alignItems: 'center', paddingTop: 16, paddingBottom: 4 }}>
            <AppText dim style={{ fontSize: 13 }}>
              You&rsquo;ll receive
            </AppText>
            <AppText variant="display" color={c.text} style={{ fontSize: 34, marginTop: 4 }}>
              {q.youGet}
            </AppText>
          </View>
          <View style={{ marginTop: 14 }}>
            <QuoteCard
              rows={[
                { label: 'You send', value: q.youSend },
                { label: 'Anchor fee', value: q.feeStr },
                { label: 'Sent to', value: dest || DEST_META[destType].placeholder, plain: true },
                { label: 'Arrives', value: q.eta, plain: true },
              ]}
            />
          </View>
          <View style={{ marginTop: 14 }}>
            <Alert tone="success" icon="shield">
              Identity verified · Meridian Tier 2
            </Alert>
          </View>
        </View>
      )}

      {/* Step 3 · Status */}
      {step === 3 && (
        <View>
          <StatusHero
            done={txStatus === 'completed'}
            title={txStatus === 'completed' ? 'Withdrawal complete' : 'Processing withdrawal'}
            caption={q.youGet}
            captionColor={c.text}
          />
          <StatusTimeline rows={timeline} />
        </View>
      )}
    </FlowScaffold>
  );
}
