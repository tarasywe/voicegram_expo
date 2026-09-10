import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

/**
 * Breathing halo behind the capture button. Purely decorative — it signals
 * "live" without pretending to be a real waveform.
 */
export function RecordingPulse({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!active) {
      progress.value = withTiming(0, { duration: 200 });
      return;
    }
    progress.value = withRepeat(
      withTiming(1, { duration: 1400, easing: Easing.out(Easing.ease) }),
      -1,
      false,
    );
  }, [active, progress]);

  const haloStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + progress.value * 0.7 }],
    opacity: 0.3 * (1 - progress.value),
  }));

  return (
    <View className="h-44 w-44 items-center justify-center">
      <Animated.View
        style={haloStyle}
        className="absolute h-28 w-28 rounded-full bg-record"
      />
      {children}
    </View>
  );
}
