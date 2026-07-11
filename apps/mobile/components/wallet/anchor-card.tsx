/**
 * An anchor row in the directory (Connected / Available groups). Colored initials
 * circle · name (+ "Your anchor" pill for the featured anchor) · rails · region·fee.
 * Connected cards carry the small purple-tinted elevation.
 */
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import type { Anchor } from '@/lib/anchors';
import { useTheme } from '@/theme/theme-context';

export function AnchorCard({
  anchor,
  connected,
  onPress,
}: {
  anchor: Anchor;
  connected?: boolean;
  onPress?: () => void;
}) {
  const { c, radius, shadowSm } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 13,
          padding: 14,
          backgroundColor: c.surface,
          borderWidth: 1,
          borderColor: c.border,
          borderRadius: radius.lg,
          marginBottom: 10,
        },
        connected ? shadowSm : null,
      ]}>
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 999,
          backgroundColor: anchor.color,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <AppText variant="title" color="#fff" style={{ fontSize: 15 }}>
          {anchor.initials}
        </AppText>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
          <AppText variant="title" color={c.text} style={{ fontSize: 15.5 }}>
            {anchor.name}
          </AppText>
          {anchor.featured && (
            <View
              style={{
                backgroundColor: c.brand100,
                paddingHorizontal: 7,
                paddingVertical: 2,
                borderRadius: 999,
              }}>
              <AppText variant="bodyStrong" color={c.brandText} style={{ fontSize: 10 }}>
                Your anchor
              </AppText>
            </View>
          )}
        </View>
        <AppText variant="caption" dim style={{ marginTop: 2 }}>
          {anchor.railLabels}
        </AppText>
        <AppText variant="mono" dim3 style={{ fontSize: 11, marginTop: 3 }}>
          {anchor.region} · fee {anchor.fee}
        </AppText>
      </View>
      <AppText color={c.text3} style={{ fontSize: 22 }}>
        ›
      </AppText>
    </Pressable>
  );
}
