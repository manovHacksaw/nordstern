/**
 * Full-width gradient call-to-action banner (135° Perano brand-500 → brand-900).
 * Used on Home ("Add money instantly") and Anchors ("Send money abroad").
 */
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { AppText } from '@/components/ui/text';
import { useTheme } from '@/theme/theme-context';

export function FeaturedBanner({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
  onPress?: () => void;
}) {
  const { c, radius, shadowMd } = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.92 : 1 })}>
      <LinearGradient
        colors={[c.brand500, c.brand900] as const}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          {
            borderRadius: radius.lg,
            paddingVertical: 15,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 13,
          },
          shadowMd,
        ]}>
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.16)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name={icon} size={22} color="#fff" strokeWidth={1.9} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="title" color="#fff">
            {title}
          </AppText>
          <AppText variant="caption" color="rgba(255,255,255,0.85)" style={{ marginTop: 2 }}>
            {subtitle}
          </AppText>
        </View>
        <AppText color="rgba(255,255,255,0.9)" style={{ fontSize: 20 }}>
          →
        </AppText>
      </LinearGradient>
    </Pressable>
  );
}
