/**
 * KYC / identity verification — 4 steps + verifying (README §7). Entered from a
 * KYC-gated flow (deposit/withdraw/crossborder review) or from Settings. On success
 * the store flips `kycVerified` and raises a one-shot `kycDone` flag; this screen
 * consumes it to pop back to wherever it came from (router.back()).
 */
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

import { FlowScaffold } from '@/components/flow/flow-scaffold';
import { ProgressBars } from '@/components/flow/progress-bars';
import { Spinner } from '@/components/flow/status-hero';
import { Alert } from '@/components/ui/alert';
import { PrimaryButton, SecondaryButton } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Field } from '@/components/ui/field';
import { Icon } from '@/components/ui/icon';
import { AppText } from '@/components/ui/text';
import { useWallet } from '@/store/wallet-store';
import { useTheme } from '@/theme/theme-context';

const STEP_LABELS = ['Personal details', 'Address', 'ID document', 'Selfie'];
const ID_TYPES = ['Aadhaar', 'PAN card', 'Passport', 'Driver’s licence'];

export default function KycScreen() {
  const router = useRouter();
  const { c, radius } = useTheme();

  const kycStep = useWallet((s) => s.kycStep);
  const kName = useWallet((s) => s.kName);
  const kDob = useWallet((s) => s.kDob);
  const kAddr = useWallet((s) => s.kAddr);
  const kIdType = useWallet((s) => s.kIdType);
  const kIdNum = useWallet((s) => s.kIdNum);
  const kSelfie = useWallet((s) => s.kSelfie);
  const kycDone = useWallet((s) => s.kycDone);

  const setField = useWallet((s) => s.setField);
  const kycNext = useWallet((s) => s.kycNext);
  const kycBack = useWallet((s) => s.kycBack);
  const finishKyc = useWallet((s) => s.finishKyc);
  const consumeKycDone = useWallet((s) => s.consumeKycDone);

  // On verification success the flow restored its own step; pop back to it.
  useEffect(() => {
    if (kycDone) {
      consumeKycDone();
      router.back();
    }
  }, [kycDone, consumeKycDone, router]);

  const onBack = () => {
    if (kycStep === 0) router.back();
    else kycBack();
  };

  let footer: React.ReactNode = null;
  if (kycStep === 0 || kycStep === 1 || kycStep === 2)
    footer = <PrimaryButton label="Continue" onPress={kycNext} />;
  else if (kycStep === 3)
    footer = kSelfie ? (
      <PrimaryButton label="Submit for verification" onPress={finishKyc} />
    ) : (
      <PrimaryButton label="Capture a selfie first" disabled />
    );

  return (
    <FlowScaffold
      title="Verify identity"
      showBack={kycStep < 4}
      onBack={onBack}
      progress={kycStep < 4 ? <ProgressBars labels={STEP_LABELS} step={kycStep} /> : null}
      footer={footer}>
      {/* Step 0 · Personal */}
      {kycStep === 0 && (
        <View style={{ gap: 12 }}>
          <Alert tone="brand" icon="shield">
            Anchors are regulated. Your details are verified once and reused across every deposit and withdrawal.
          </Alert>
          <Field label="Legal name" placeholder="Full name" value={kName} onChangeText={(v) => setField('kName', v)} />
          <Field
            label="Date of birth"
            placeholder="DD / MM / YYYY"
            value={kDob}
            onChangeText={(v) => setField('kDob', v)}
          />
          <Field label="Country" value="India" editable={false} />
        </View>
      )}

      {/* Step 1 · Address */}
      {kycStep === 1 && (
        <View style={{ gap: 12 }}>
          <Field
            label="Residential address"
            placeholder="Street address"
            value={kAddr}
            onChangeText={(v) => setField('kAddr', v)}
          />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1.4 }}>
              <Field label="City" placeholder="City" />
            </View>
            <View style={{ flex: 1 }}>
              <Field label="PIN code" placeholder="560001" keyboardType="number-pad" mono />
            </View>
          </View>
        </View>
      )}

      {/* Step 2 · ID document */}
      {kycStep === 2 && (
        <View>
          <AppText variant="bodyStrong" dim3 style={{ fontSize: 13, marginBottom: 10 }}>
            Document type
          </AppText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {ID_TYPES.map((t) => (
              <Chip key={t} label={t} selected={kIdType === t} onPress={() => setField('kIdType', t)} />
            ))}
          </View>
          <Field
            label="Document number"
            placeholder="XXXX XXXX XXXX"
            value={kIdNum}
            onChangeText={(v) => setField('kIdNum', v)}
            mono
          />
          <View
            style={{
              marginTop: 14,
              borderWidth: 2,
              borderColor: c.border,
              borderStyle: 'dashed',
              borderRadius: radius.lg,
              paddingVertical: 26,
              paddingHorizontal: 16,
              alignItems: 'center',
              backgroundColor: c.surface,
            }}>
            <Icon name="cameraDoc" size={30} color={c.brand500} strokeWidth={1.7} />
            <AppText variant="bodyStrong" color={c.text} style={{ fontSize: 14, marginTop: 8 }}>
              Photograph your document
            </AppText>
            <AppText dim style={{ fontSize: 12, marginTop: 3 }}>
              Front side · well lit · all corners visible
            </AppText>
          </View>
        </View>
      )}

      {/* Step 3 · Selfie */}
      {kycStep === 3 && (
        <View style={{ alignItems: 'center', paddingVertical: 10 }}>
          <View
            style={{
              width: 160,
              height: 160,
              borderRadius: 999,
              borderWidth: 2,
              borderColor: c.border,
              borderStyle: 'dashed',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: c.surface,
            }}>
            {kSelfie ? (
              <Icon name="check" size={60} color={c.success} strokeWidth={2.2} />
            ) : (
              <Icon name="person" size={46} color={c.text3} strokeWidth={1.6} />
            )}
          </View>
          {kSelfie ? (
            <View style={{ alignItems: 'center', marginTop: 16 }}>
              <AppText variant="title" color={c.text}>
                Looks good
              </AppText>
              <AppText dim style={{ fontSize: 12.5, marginTop: 2 }}>
                Your selfie was captured.
              </AppText>
            </View>
          ) : (
            <View style={{ alignItems: 'center', marginTop: 16 }}>
              <AppText variant="title" color={c.text}>
                Take a selfie
              </AppText>
              <AppText dim style={{ fontSize: 12.5, marginTop: 2, marginBottom: 16 }}>
                Center your face in the circle.
              </AppText>
              <SecondaryButton
                label="Capture selfie"
                onPress={() => setField('kSelfie', true)}
                style={{ width: 160, height: 44 }}
              />
            </View>
          )}
        </View>
      )}

      {/* Verifying */}
      {kycStep === 4 && (
        <View style={{ alignItems: 'center', paddingVertical: 40 }}>
          <Spinner />
          <AppText variant="h3" color={c.text} style={{ fontSize: 20, marginTop: 18 }}>
            Verifying your identity
          </AppText>
          <AppText dim style={{ fontSize: 13, marginTop: 4 }}>
            This usually takes a few seconds.
          </AppText>
        </View>
      )}
    </FlowScaffold>
  );
}
