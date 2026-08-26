import React from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SharedStyles} from '../../../shared/index';
import styles from './styles';

export default ({children, center = false, noPaddingTop = false, noPaddingBottom = false}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        SharedStyles.fullFlex,
        !!center && SharedStyles.center,
        styles.background,
        {
          paddingTop: noPaddingTop ? 0 : insets.top,
          paddingBottom: noPaddingBottom ? 0 : insets.bottom,
        },
      ]}>
      {children}
    </View>
  );
};
