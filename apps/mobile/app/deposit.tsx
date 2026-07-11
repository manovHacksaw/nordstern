/**
 * Deposit (on-ramp) — 5 steps: Method → Amount → Review → Pay → Status (README §4).
 * State/step live in the wallet store; this screen renders the current step and wires
 * the sticky footer. The Amount→Review transition is KYC-gated (diverts to /kyc).
 */
import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { AmountInput } from '@/components/flow/amount-input';
import { FlowScaffold } from '@/components/flow/flow-scaffold';
import { MethodCard } from '@/components/flow/method-card';
import { ProgressBars } from '@/components/flow/progress-bars';
import { QuoteCard } from '@/components/flow/quote-card';
import { StatusHero } from '@/components/flow/status-hero';
import { StatusTimeline, type TimelineState } from '@/components/flow/status-timeline';
import { Alert } from '@/components/ui/alert';
import { PrimaryButton } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Icon } from '@/components/ui/icon';
import { AppText } from '@/components/ui/text';
import { anchorById, METHODS, METHOD_ICON } from '@/lib/anchors';
import type { AssetSym } from '@/lib/assets';
import { depositQuote } from '@/lib/quotes';
import { useWallet } from '@/store/wallet-store';
import { useTheme } from '@/theme/theme-context';

const UPI_APPS = [
  { name: 'Google Pay', initials: 'G', color: '#4285F4' },
  { name: 'PhonePe', initials: 'Pe', color: '#5F259F' },
  { name: 'Paytm', initials: 'P', color: '#00BAF2' },
  { name: 'BHIM', initials: 'B', color: '#00A9E0' },
];

const STEP_LABELS = ['Method', 'Amount', 'Review', 'Pay'];

export default function DepositScreen() {
  const router = useRouter();
  const { c, radius } = useTheme();

  const step = useWallet((s) => s.step);
  const anchorId = useWallet((s) => s.anchorId);
  const asset = useWallet((s) => s.asset) as AssetSym;
  const method = useWallet((s) => s.method);
  const fiat = useWallet((s) => s.fiat);
  const txStatus = useWallet((s) => s.txStatus);

  const setMethod = useWallet((s) => s.setMethod);
  const setField = useWallet((s) => s.setField);
  const proceed = useWallet((s) => s.proceed);
  const prevStep = useWallet((s) => s.prevStep);
  const requestReview = useWallet((s) => s.requestReview);
  const runTx = useWallet((s) => s.runTx);

  const anchor = anchorById(anchorId);
  const q = depositQuote(fiat, anchor, asset);

  const onBack = () => {
    if (step === 0) router.back();
    else prevStep();
  };

  const onReview = () => {
    const divert = requestReview();
    if (divert) router.push('/kyc');
  };

  const isUpi = method === 'upi' || method === 'gpay';
  const isCard = method === 'card';
  const isBank = method === 'imps' || method === 'ach' || method === 'sepa' || method === 'wire';
  const isCash = method === 'cashin';

  const timeline: { label: string; state: TimelineState }[] = [
    { label: 'Payment received', state: txStatus === 'processing' ? 'active' : 'done' },
    {
      label: `Converting to ${asset}`,
      state: txStatus === 'processing' ? 'pending' : txStatus === 'converting' ? 'active' : 'done',
    },
    { label: 'Delivered to your wallet', state: txStatus === 'completed' ? 'done' : 'pending' },
  ];

  // ---- footer per step ----
  let footer: React.ReactNode = null;
  if (step === 0)
    footer = (
      <PrimaryButton
        label={method ? 'Continue' : 'Choose a method'}
        disabled={!method}
        onPress={proceed}
      />
    );
  else if (step === 1) footer = <PrimaryButton label="Continue" onPress={onReview} />;
  else if (step === 2) footer = <PrimaryButton label="Confirm & continue" onPress={proceed} />;
  else if (step === 3) footer = <PrimaryButton label={`Pay ${q.youPay}`} onPress={runTx} />;
  // Done pops the whole pushed flow back to the tab root, regardless of launch site
  // (Home action, featured banner, asset detail, anchor detail). See decisions.md D-007.
  else if (step === 4) footer = <PrimaryButton label="Done" onPress={() => router.dismissAll()} />;

  return (
    <FlowScaffold
      title="Deposit"
      showBack={step < 4}
      onBack={onBack}
      progress={step < 4 ? <ProgressBars labels={STEP_LABELS} step={step} /> : null}
      footer={footer}>
      {/* Step 0 · Method */}
      {step === 0 && (
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              backgroundColor: c.surface,
              borderWidth: 1,
              borderColor: c.border,
              borderRadius: radius.md,
              padding: 12,
              marginBottom: 18,
            }}>
            <AnchorBadge color={anchor.color} initials={anchor.initials} />
            <View style={{ flex: 1 }}>
              <AppText dim3 style={{ fontSize: 11.5 }}>
                Adding {asset} via
              </AppText>
              <AppText variant="title" color={c.text}>
                {anchor.name}
              </AppText>
            </View>
          </View>
          <AppText variant="bodyStrong" dim3 style={{ fontSize: 13, marginBottom: 12 }}>
            Choose how to pay
          </AppText>
          {anchor.rails.map((id) => (
            <MethodCard
              key={id}
              icon={METHOD_ICON[id]}
              label={METHODS[id].label}
              desc={METHODS[id].desc}
              badge={METHODS[id].badge}
              selected={method === id}
              onPress={() => setMethod(id)}
            />
          ))}
        </View>
      )}

      {/* Step 1 · Amount + quote */}
      {step === 1 && (
        <View>
          <AmountInput
            label="You pay"
            prefix={q.fiatSym}
            value={fiat}
            onChangeText={(v) => setField('fiat', v)}
            chips={['1,000', '5,000', '10,000'].map((v) => ({ label: q.fiatSym + v, value: v }))}
            onChip={(v) => setField('fiat', v)}
          />
          <View style={{ marginTop: 18 }}>
            <QuoteCard
              rows={[
                { label: 'You pay', value: q.youPay },
                { label: `Anchor fee · ${q.feePct}`, value: q.feeStr },
                { label: 'Rate', value: q.rateStr },
                { label: 'You receive', value: q.youGet, emphasize: true },
              ]}
            />
          </View>
          <ArrivesLine eta={q.eta} />
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
                { label: 'Pay with', value: method ? METHODS[method].label : '', plain: true },
                { label: 'Anchor', value: anchor.name, plain: true },
                { label: 'You pay', value: q.youPay },
                { label: 'Anchor fee', value: q.feeStr },
                { label: 'Arrives', value: q.eta, plain: true },
              ]}
            />
          </View>
          <View style={{ marginTop: 14 }}>
            <Alert tone="success" icon="shield">
              Identity verified · your info is shared securely with the anchor.
            </Alert>
          </View>
        </View>
      )}

      {/* Step 3 · Pay (method-specific) */}
      {step === 3 && (
        <View>
          {isUpi && (
            <View>
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: c.surface,
                  borderWidth: 1,
                  borderColor: c.border,
                  borderRadius: radius.lg,
                  paddingVertical: 20,
                  paddingHorizontal: 16,
                }}>
                <AppText dim3 style={{ fontSize: 12 }}>
                  Paying to
                </AppText>
                <AppText variant="h3" color={c.text} style={{ fontSize: 17, marginTop: 2 }}>
                  {anchor.name}
                </AppText>
                <AppText variant="mono" dim style={{ fontSize: 12.5 }}>
                  meridian@stellar
                </AppText>
                <AppText variant="display" color={c.text} style={{ fontSize: 36, marginTop: 14 }}>
                  {q.youPay}
                </AppText>
              </View>
              <AppText variant="bodyStrong" dim3 style={{ fontSize: 13, marginTop: 18, marginBottom: 12 }}>
                Choose a UPI app
              </AppText>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {UPI_APPS.map((ap) => (
                  <View
                    key={ap.name}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      gap: 6,
                      backgroundColor: c.surface,
                      borderWidth: 1,
                      borderColor: c.border,
                      borderRadius: radius.md,
                      paddingVertical: 12,
                      paddingHorizontal: 4,
                    }}>
                    <View
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 999,
                        backgroundColor: ap.color,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <AppText variant="bodyStrong" color="#fff" style={{ fontSize: 13 }}>
                        {ap.initials}
                      </AppText>
                    </View>
                    <AppText dim style={{ fontSize: 10, textAlign: 'center' }}>
                      {ap.name}
                    </AppText>
                  </View>
                ))}
              </View>
            </View>
          )}

          {isCard && (
            <View>
              <AppText variant="bodyStrong" dim3 style={{ fontSize: 13, marginBottom: 12 }}>
                Card details
              </AppText>
              <View style={{ gap: 12 }}>
                <Field label="Card number" placeholder="1234 5678 9012 3456" keyboardType="number-pad" mono />
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Field label="Expiry" placeholder="MM / YY" mono />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Field label="CVC" placeholder="123" keyboardType="number-pad" mono />
                  </View>
                </View>
                <Field label="Name on card" placeholder="Aarav Sharma" />
              </View>
            </View>
          )}

          {isBank && (
            <View>
              <AppText variant="bodyStrong" dim3 style={{ fontSize: 13, marginBottom: 12 }}>
                Transfer to this account
              </AppText>
              <QuoteCard
                rows={[
                  { label: 'Account number', value: '5729 1183 4471' },
                  { label: 'IFSC', value: 'MERD0000123' },
                  { label: 'Beneficiary', value: 'Meridian Payments', plain: true },
                  { label: 'Amount', value: q.youPay, valueColor: c.brand500 },
                ]}
              />
              <View style={{ marginTop: 12 }}>
                <Alert tone="info" icon="info">
                  Send the exact amount from your bank app, then tap below to confirm.
                </Alert>
              </View>
            </View>
          )}

          {isCash && (
            <View
              style={{
                alignItems: 'center',
                backgroundColor: c.surface,
                borderWidth: 1,
                borderColor: c.border,
                borderRadius: radius.lg,
                paddingVertical: 22,
                paddingHorizontal: 16,
              }}>
              <AppText dim3 style={{ fontSize: 12 }}>
                Reference code
              </AppText>
              <AppText variant="monoLg" color={c.text} style={{ fontSize: 26, letterSpacing: 1, marginTop: 6 }}>
                MG-4821-9930
              </AppText>
              <AppText dim style={{ fontSize: 12.5, marginTop: 12, textAlign: 'center', lineHeight: 19 }}>
                Show this code at any MoneyGram location and pay {q.youPay} in cash.
              </AppText>
            </View>
          )}
        </View>
      )}

      {/* Step 4 · Status */}
      {step === 4 && (
        <View>
          <StatusHero
            done={txStatus === 'completed'}
            title={txStatus === 'completed' ? 'Deposit complete' : 'Processing your deposit'}
            caption={q.receivedText}
            captionColor={c.success}
          />
          <StatusTimeline rows={timeline} />
        </View>
      )}
    </FlowScaffold>
  );
}

function AnchorBadge({ color, initials }: { color: string; initials: string }) {
  return (
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 999,
        backgroundColor: color,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <AppText variant="title" color="#fff" style={{ fontSize: 14 }}>
        {initials}
      </AppText>
    </View>
  );
}

function ArrivesLine({ eta }: { eta: string }) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 14 }}>
      <Icon name="clock" size={15} color={c.text3} strokeWidth={1.8} />
      <AppText dim3 style={{ fontSize: 12 }}>
        Arrives {eta}
      </AppText>
    </View>
  );
}
