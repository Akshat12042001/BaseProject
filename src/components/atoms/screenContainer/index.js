import React from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SharedStyles} from '../../../shared/index';
import styles from './styles';

export default ({children, center = false}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        SharedStyles.fullFlex,
        !!center && SharedStyles.center,
        styles.background,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}>
      {children}
    </View>
  );
};
