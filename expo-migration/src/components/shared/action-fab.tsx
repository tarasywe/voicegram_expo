import { Icon } from '@ui/icon';
import { Pressable } from '@ui/pressable';
import * as Haptics from 'expo-haptics';
import type { ComponentProps } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type ActionFabProps = {
  icon: ComponentProps<typeof Icon>['as'];
  onPress: () => void;
  accessibilityLabel: string;
  /** `record` paints the red capture button; `primary` the cyan add button. */
  tone?: 'primary' | 'record';
  disabled?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * The one floating action per screen. Springs on press-in and fires a light
 * haptic, so recording feels physical rather than accidental.
 */
export function ActionFab({
  icon,
  onPress,
  accessibilityLabel,
  tone = 'primary',
  disabled = false,
}: ActionFabProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      style={animatedStyle}
      onPressIn={() => {
        scale.value = withSpring(0.9, { damping: 14, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 320 });
      }}
      onPress={() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className={`absolute right-5 bottom-6 h-16 w-16 items-center justify-center rounded-full shadow-lg data-[disabled=true]:opacity-40 ${
        tone === 'record' ? 'bg-record' : 'bg-primary'
      }`}
    >
      <Icon
        as={icon}
        size="xl"
        className={
          tone === 'record' ? 'text-record-foreground' : 'text-primary-foreground'
        }
      />
    </AnimatedPressable>
  );
}
