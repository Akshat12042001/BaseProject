import React from 'react';
import {View, Text} from 'react-native';
import styles from './styles';

const CustomToast = ({text1, text2, variant = 'success'}) => {
  const isError = variant === 'error';

  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.customToast,
        isError ? styles.errorToast : styles.successToast,
      ]}>
      <View
        style={[
          styles.statusIndicator,
          isError ? styles.errorIndicator : styles.successIndicator,
        ]}
      />
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.customTitle,
            isError ? styles.errorTitle : styles.successTitle,
          ]}>
          {text1}
        </Text>
        {!!text2 && <Text style={styles.customMessage}>{text2}</Text>}
      </View>
    </View>
  );
};

export default React.memo(CustomToast);
