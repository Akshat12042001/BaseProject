import React, {useCallback, useEffect} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {COLORS} from '../../../constants';

const TRACK_WIDTH = 42;
const TRACK_HEIGHT = 14;
const THUMB_SIZE = 20;

const DEFAULT_TRACK_COLORS = {
  on: '#397D2D80',
  off: COLORS.BORDER_LIGHT,
};

/**
 * Custom animated switch based on the Reanimated example:
 * https://docs.swmansion.com/react-native-reanimated/examples/switch/
 */
const AnimatedSwitch = ({
  value = false,
  onPress,
  disabled = false,
  duration = 400,
  style,
  trackColors = DEFAULT_TRACK_COLORS,
  thumbColor = COLORS.LOGIN_PRIMARY,
  accessibilityLabel,
}) => {
  const trackWidth = useSharedValue(TRACK_WIDTH);
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = value ? 1 : 0;
  }, [progress, value]);

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [trackColors.off, trackColors.on],
    );

    return {
      backgroundColor: withTiming(color, {duration}),
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const moveValue = interpolate(
      progress.value,
      [0, 1],
      [0, Math.max(0, trackWidth.value - THUMB_SIZE)],
    );

    return {
      transform: [{translateX: withTiming(moveValue, {duration})}],
      backgroundColor: thumbColor,
    };
  });

  const handlePress = useCallback(() => {
    if (disabled) {
      return;
    }
    onPress?.(!value);
  }, [disabled, onPress, value]);

  const handleTrackLayout = useCallback(
    event => {
      trackWidth.value = event.nativeEvent.layout.width;
    },
    [trackWidth],
  );

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{checked: value, disabled}}
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={handlePress}
      style={[styles.container, disabled && styles.disabled, style]}>
      <Animated.View
        onLayout={handleTrackLayout}
        style={[styles.track, trackAnimatedStyle]}
      />
      <Animated.View style={[styles.thumb, thumbAnimatedStyle]} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: THUMB_SIZE,
    justifyContent: 'center',
    width: TRACK_WIDTH,
  },
  track: {
    borderRadius: TRACK_HEIGHT / 2,
    height: TRACK_HEIGHT,
    width: '100%',
  },
  thumb: {
    borderRadius: THUMB_SIZE / 2,
    height: THUMB_SIZE,
    left: 0,
    position: 'absolute',
    top: 0,
    width: THUMB_SIZE,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default React.memo(AnimatedSwitch);
