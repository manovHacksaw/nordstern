/**
 * Send abroad (cross-border, SEP-31) — 4 steps: Recipient → Amount → Review → Status
 * (README §6). USDC → local currency via a receiving anchor; the Amount→Review step is
 * KYC-gated. Rate/fee are simulated (flat 1%, ₦1650 demo rate). See lib/quotes.
 */
import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { AmountInput } from '@/components/flow/amount-input';
import { FlowScaffold } from '@/components/flow/flow-scaffold';
import { ProgressBars } from '@/components/flow/progress-bars';
import { QuoteCard } from '@/components/flow/quote-card';
import { StatusHero } from '@/components/flow/status-hero';
import { StatusTimeline, type TimelineState } from '@/components/flow/status-timeline';
import { Alert } from '@/components/ui/alert';
import { PrimaryButton } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Field } from '@/components/ui/field';
import { Icon } from '@/components/ui/icon';
import { AppText } from '@/components/ui/text';
import { crossborderQuote } from '@/lib/quotes';
import { useWallet } from '@/store/wallet-store';
import { useTheme } from '@/theme/theme-context';

const STEP_LABELS = ['Recipient', 'Amount', 'Review'];
const COUNTRIES = ['Nigeria', 'Kenya', 'Philippines', 'Mexico', 'Brazil'];
const DELIVERY = ['Bank deposit', 'Mobile money', 'Cash pickup'];

export default function CrossborderScreen() {
  const router = useRouter();
  const { c, radius } = useTheme();

  const step = useWallet((s) => s.step);
  const cbCountry = useWallet((s) => s.cbCountry);
  const cbMethod = useWallet((s) => s.cbMethod);
  const cbName = useWallet((s) => s.cbName);
  const cbAccount = useWallet((s) => s.cbAccount);
  const cbAmt = useWallet((s) => s.cbAmt);
  const txStatus = useWallet((s) => s.txStatus);

  const setField = useWallet((s) => s.setField);
  const proceed = useWallet((s) => s.proceed);
  const prevStep = useWallet((s) => s.prevStep);
  const requestReview = useWallet((s) => s.requestReview);
  const runTx = useWallet((s) => s.runTx);

  const q = crossborderQuote(cbAmt);

  const onBack = () => {
    if (step === 0) router.back();
    else prevStep();
  };
  const onReview = () => {
    if (requestReview()) router.push('/kyc');
  };

  const timeline: { label: string; state: TimelineState }[] = [
    { label: 'Submitted to anchor', state: txStatus === 'processing' ? 'active' : 'done' },
    {
      label: 'Converting USDC → NGN',
      state: txStatus === 'processing' ? 'pending' : txStatus === 'converting' ? 'active' : 'done',
    },
    { label: `Delivered to ${cbName || 'recipient'}`, state: txStatus === 'completed' ? 'done' : 'pending' },
  ];

  let footer: React.ReactNode = null;
  if (step === 0) footer = <PrimaryButton label="Continue" onPress={proceed} />;
  else if (step === 1) footer = <PrimaryButton label="Continue" onPress={onReview} />;
  else if (step === 2) footer = <PrimaryButton label="Confirm & send" onPress={runTx} />;
  else if (step === 3) footer = <PrimaryButton label="Done" onPress={() => router.dismissAll()} />;

  return (
    <FlowScaffold
      title="Send abroad"
      showBack={step < 3}
      onBack={onBack}
      progress={step < 3 ? <ProgressBars labels={STEP_LABELS} step={step} /> : null}
      footer={footer}>
      {/* Step 0 · Recipient */}
      {step === 0 && (
        <View>
          <AppText variant="bodyStrong" dim3 style={{ fontSize: 13, marginTop: 6, marginBottom: 10 }}>
            Recipient country
          </AppText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
            {COUNTRIES.map((ctry) => (
              <Chip
                key={ctry}
                label={ctry}
                selected={cbCountry === ctry}
                onPress={() => setField('cbCountry', ctry)}
              />
            ))}
          </View>

          <AppText variant="bodyStrong" dim3 style={{ fontSize: 13, marginBottom: 10 }}>
            Delivery method
          </AppText>
          <View style={{ gap: 10, marginBottom: 18 }}>
            {DELIVERY.map((m) => {
              const chosen = cbMethod === m;
              return (
                <Pressable
                  key={m}
                  onPress={() => setField('cbMethod', m)}
                  style={{
                    paddingVertical: 13,
                    paddingHorizontal: 14,
                    borderRadius: radius.md,
                    backgroundColor: c.surface,
                    borderWidth: 1.5,
                    borderColor: chosen ? c.brand500 : c.border,
                  }}>
                  <AppText variant="bodyStrong" color={chosen ? c.brand500 : c.text2}>
                    {m}
                  </AppText>
                </Pressable>
              );
            })}
          </View>

          <View style={{ gap: 12 }}>
            <Field
              label="Recipient full name"
              placeholder="e.g. Adaeze Okonkwo"
              value={cbName}
              onChangeText={(v) => setField('cbName', v)}
            />
            <Field
              label="Account / phone"
              placeholder="Account or mobile number"
              value={cbAccount}
              onChangeText={(v) => setField('cbAccount', v)}
            />
          </View>
        </View>
      )}

      {/* Step 1 · Amount */}
      {step === 1 && (
        <View>
          <AmountInput label="You send" suffix="USDC" value={cbAmt} onChangeText={(v) => setField('cbAmt', v)} />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              marginTop: 8,
              marginBottom: 4,
            }}>
            <View style={{ flex: 1, height: 1, backgroundColor: c.border }} />
            <Icon name="arrowDown" size={20} color={c.text3} strokeWidth={1.8} />
            <View style={{ flex: 1, height: 1, backgroundColor: c.border }} />
          </View>
          <View style={{ alignItems: 'center' }}>
            <AppText dim style={{ fontSize: 13 }}>
              They receive
            </AppText>
            <AppText variant="display" color={c.brand500} style={{ fontSize: 30, marginTop: 4 }}>
              {q.youGet}
            </AppText>
          </View>
          <View style={{ marginTop: 18 }}>
            <QuoteCard
              rows={[
                { label: 'Rate', value: q.rateStr },
                { label: 'Fee', value: q.feeStr },
              ]}
            />
          </View>
        </View>
      )}

      {/* Step 2 · Review (gated) */}
      {step === 2 && (
        <View>
          <View style={{ alignItems: 'center', paddingTop: 16, paddingBottom: 4 }}>
            <AppText dim style={{ fontSize: 13 }}>
              They receive
            </AppText>
            <AppText variant="display" color={c.text} style={{ fontSize: 34, marginTop: 4 }}>
              {q.youGet}
            </AppText>
          </View>
          <View style={{ marginTop: 14 }}>
            <QuoteCard
              rows={[
                { label: 'Recipient', value: cbName || '—', plain: true },
                { label: 'Destination', value: `${cbCountry} · ${cbMethod}`, plain: true },
                { label: 'You send', value: q.youSend },
                { label: 'Fee', value: q.feeStr },
              ]}
            />
          </View>
          <View style={{ marginTop: 14 }}>
            <Alert tone="info" icon="info">
              Sent over Stellar via SEP-31. The receiving anchor pays out locally.
            </Alert>
          </View>
        </View>
      )}

      {/* Step 3 · Status */}
      {step === 3 && (
        <View>
          <StatusHero
            done={txStatus === 'completed'}
            title={txStatus === 'completed' ? 'Money is on its way' : 'Sending your transfer'}
            caption={`${q.youGet} to ${cbName || 'recipient'}`}
            captionColor={c.success}
          />
          <StatusTimeline rows={timeline} />
        </View>
      )}
    </FlowScaffold>
  );
}
