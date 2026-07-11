/**
 * The centered hero on a flow's terminal step: a spinner while pending, a success
 * check-circle when done. Used by the deposit status step and KYC verifying step.
 * (Pop-in / continuous-spin animation is a Task 15 polish item.)
 */
import { ActivityIndicator, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { AppText } from '@/components/ui/text';
import { useTheme } from '@/theme/theme-context';

export function Spinner() {
  const { c } = useTheme();
  return (
    <View
      style={{
        width: 84,
        height: 84,
        borderRadius: 999,
        borderWidth: 4,
        borderColor: c.surface2,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <ActivityIndicator size="large" color={c.brand500} />
    </View>
  );
}

export function SuccessCircle() {
  const { c } = useTheme();
  return (
    <View
      style={{
        width: 84,
        height: 84,
        borderRadius: 999,
        backgroundColor: c.successFill,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Icon name="check" size={42} color={c.success} strokeWidth={2.4} />
    </View>
  );
}

/** Full hero: spinner|check + title + optional caption, centered. */
export function StatusHero({
  done,
  title,
  caption,
  captionColor,
}: {
  done: boolean;
  title: string;
  caption?: string;
  captionColor?: string;
}) {
  const { c } = useTheme();
  return (
    <View style={{ alignItems: 'center', paddingTop: 16, paddingBottom: 8 }}>
      {done ? <SuccessCircle /> : <Spinner />}
      <AppText variant="h3" color={c.text} style={{ fontSize: 20, marginTop: 14 }}>
        {title}
      </AppText>
      {caption ? (
        <AppText variant="mono" color={captionColor ?? c.text2} style={{ fontSize: caption ? 16 : 13, marginTop: 4 }}>
          {caption}
        </AppText>
      ) : null}
    </View>
  );
}
