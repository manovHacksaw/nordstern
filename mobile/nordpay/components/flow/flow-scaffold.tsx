/**
 * Shared chrome for a pushed multi-step flow (deposit / withdraw / crossborder / kyc):
 * a left-aligned back+title header, optional progress bars, a scrollable body, and a
 * sticky bottom footer. The screen decides which chrome to show per step (the final
 * status/verifying step hides the back arrow and progress).
 */
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CircleButton } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { AppText } from '@/components/ui/text';
import { useTheme } from '@/theme/theme-context';

export function FlowScaffold({
  title,
  showBack = true,
  onBack,
  progress,
  footer,
  children,
}: {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  progress?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { c } = useTheme();
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.canvas }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 12,
            paddingTop: 8,
            paddingBottom: 2,
            minHeight: 46,
          }}>
          {showBack && (
            <CircleButton onPress={onBack}>
              <Icon name="back" size={20} color={c.text} strokeWidth={2} />
            </CircleButton>
          )}
          <AppText variant="bodyStrong" color={c.text} style={{ fontSize: 16 }}>
            {title}
          </AppText>
        </View>

        {progress}

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 4, paddingBottom: 14 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>

        {footer && (
          <View
            style={{
              paddingHorizontal: 18,
              paddingTop: 12,
              paddingBottom: 26,
              backgroundColor: c.canvas,
              borderTopWidth: 1,
              borderTopColor: c.border,
            }}>
            {footer}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
