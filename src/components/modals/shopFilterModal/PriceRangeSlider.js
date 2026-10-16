import React, {useCallback, useMemo, useRef, useState} from 'react';
import {PanResponder, View} from 'react-native';
import {COLORS} from '../../../constants';
import styles from './styles';

const THUMB_SIZE = 22;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const PriceRangeSlider = ({
  min = 0,
  max = 10000,
  step = 100,
  lowValue,
  highValue,
  onValuesChange,
  activeColor = COLORS.PRIMARY,
  inactiveColor = COLORS.BORDER_LIGHT,
}) => {
  const [trackWidth, setTrackWidth] = useState(0);
  const trackPageXRef = useRef(0);
  const trackRef = useRef(null);
  const valuesRef = useRef({low: lowValue, high: highValue});

  valuesRef.current = {low: lowValue, high: highValue};

  const valueToPosition = useCallback(
    value => {
      if (!trackWidth) {
        return 0;
      }
      return ((value - min) / (max - min || 1)) * trackWidth;
    },
    [max, min, trackWidth],
  );

  const positionToValue = useCallback(
    position => {
      if (!trackWidth) {
        return min;
      }
      const ratio = clamp(position / trackWidth, 0, 1);
      const raw = min + ratio * (max - min);
      const stepped = Math.round(raw / step) * step;
      return clamp(stepped, min, max);
    },
    [max, min, step, trackWidth],
  );

  const handleMove = useCallback(
    (thumb, pageX) => {
      const nextValue = positionToValue(pageX - trackPageXRef.current);
      const {low, high} = valuesRef.current;

      if (thumb === 'low') {
        onValuesChange?.(Math.min(nextValue, high), high);
        return;
      }

      onValuesChange?.(low, Math.max(nextValue, low));
    },
    [onValuesChange, positionToValue],
  );

  const createPanResponder = useCallback(
    thumb =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: event => {
          handleMove(thumb, event.nativeEvent.pageX);
        },
        onPanResponderMove: event => {
          handleMove(thumb, event.nativeEvent.pageX);
        },
      }),
    [handleMove],
  );

  const lowPanResponder = useMemo(
    () => createPanResponder('low'),
    [createPanResponder],
  );
  const highPanResponder = useMemo(
    () => createPanResponder('high'),
    [createPanResponder],
  );

  const handleTrackLayout = useCallback(event => {
    setTrackWidth(event.nativeEvent.layout.width);
    trackRef.current?.measureInWindow((x) => {
      trackPageXRef.current = x;
    });
  }, []);

  const lowLeft = valueToPosition(lowValue);
  const highLeft = valueToPosition(highValue);

  return (
    <View
      ref={trackRef}
      style={styles.sliderContainer}
      onLayout={handleTrackLayout}>
      <View style={[styles.sliderTrack, {backgroundColor: inactiveColor}]} />
      <View
        style={[
          styles.sliderActiveTrack,
          {
            backgroundColor: activeColor,
            left: lowLeft,
            width: Math.max(highLeft - lowLeft, 0),
          },
        ]}
      />
      <View
        {...lowPanResponder.panHandlers}
        hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
        style={[
          styles.sliderThumb,
          {
            backgroundColor: activeColor,
            left: lowLeft - THUMB_SIZE / 2,
          },
        ]}
      />
      <View
        {...highPanResponder.panHandlers}
        hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
        style={[
          styles.sliderThumb,
          {
            backgroundColor: activeColor,
            left: highLeft - THUMB_SIZE / 2,
          },
        ]}
      />
    </View>
  );
};

export default PriceRangeSlider;
