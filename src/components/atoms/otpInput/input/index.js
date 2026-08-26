import React, {forwardRef} from 'react';
import {TextInput, View} from 'react-native';
import styles from './styles';
import {COLORS} from '../../../../constants';

export default forwardRef(
  ({value, isFocused, error, ...props}, ref) => {
    const borderColor = error
      ? COLORS.RED_ERROR
      : isFocused
      ? COLORS.LOGIN_PRIMARY
      : COLORS.OTP_INPUT_BORDER;

    return (
      <View
        style={[
          styles.container,
          {
            borderColor,
          },
        ]}>
        <TextInput
          {...props}
          ref={ref}
          value={value}
          keyboardType="numeric"
          maxLength={6}
          style={styles.textInput}
          autoFocus
        />
      </View>
    );
  },
);