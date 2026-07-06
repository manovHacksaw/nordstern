/**
 * Transient toast pinned above the tab bar. State + auto-dismiss (3.2s) live in the
 * wallet store (`flash`); this host just renders the current toast. Mounted once at
 * the root so it overlays every screen. (Sheet-up animation is a Task 15 polish item.)
 */
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from './icon';
import { AppText } from './text';
import { useWallet } from '@/store/wallet-store';
import { useTheme } from '@/theme/theme-context';

const TONE_ICON: Record<string, IconName> = {
  success: 'check',
  info: 'info',
  warning: 'info',
  error: 'close',
  brand: 'info',
  neutral: 'info',
};

export function ToastHost() {
  const { c, radius, shadowMd } = useTheme();
  const insets = useSafeAreaInsets();
  const toast = useWallet((s) => s.toast);
  if (!toast) return null;

  const toneColor =
    toast.tone === 'success'
      ? c.success
      : toast.tone === 'info'
        ? c.info
        : toast.tone === 'warning'
          ? c.warning
          : toast.tone === 'error'
            ? c.error
            : c.brand500;

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: insets.bottom + 74,
      }}>
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            backgroundColor: c.surface2,
            borderWidth: 1,
            borderColor: c.border,
            borderRadius: radius.md,
            paddingVertical: 12,
            paddingHorizontal: 14,
          },
          shadowMd,
        ]}>
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 999,
            backgroundColor: toneColor + '28',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name={TONE_ICON[toast.tone] ?? 'info'} size={17} color={toneColor} strokeWidth={2} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="bodyStrong" color={c.text}>
            {toast.title}
          </AppText>
          <AppText variant="caption" dim style={{ marginTop: 1 }}>
            {toast.msg}
          </AppText>
        </View>
      </View>
    </View>
  );
}
