/**
 * Screen scaffolding: a canvas-colored safe-area surface, and a flow header
 * (back arrow + title) for pushed stack screens.
 */
import { useRouter } from 'expo-router';
import { View, ScrollView, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/theme-context';
import { CircleButton } from './button';
import { Icon } from './icon';
import { AppText } from './text';

export function Screen({
  children,
  scroll,
  edges = ['top'],
  contentStyle,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  edges?: Edge[];
  contentStyle?: ViewStyle;
}) {
  const { c } = useTheme();
  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: c.canvas }}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[{ paddingBottom: 24 }, contentStyle]}
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

/** Back header for pushed flow screens. `onBack` overrides the default router.back(). */
export function FlowHeader({
  title,
  onBack,
  hideBack,
  right,
}: {
  title?: string;
  onBack?: () => void;
  hideBack?: boolean;
  right?: React.ReactNode;
}) {
  const { c } = useTheme();
  const router = useRouter();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingTop: 6,
        paddingBottom: 10,
        minHeight: 44,
      }}>
      <View style={{ width: 38 }}>
        {!hideBack && (
          <CircleButton onPress={onBack ?? (() => router.back())}>
            <Icon name="back" size={18} color={c.text} />
          </CircleButton>
        )}
      </View>
      {!!title && (
        <AppText variant="title" style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center' }}>
          {title}
        </AppText>
      )}
      <View style={{ width: 38, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}
