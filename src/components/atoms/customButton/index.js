import React from 'react';
import {ActivityIndicator, TouchableOpacity} from 'react-native';
import styles from './styles';
import StyledText from '../styledText';
import {COLORS} from '../../../constants';

const CustomButton = ({
  title,
  onPress,
  containerStyle,
  isDisabled = false,
  isLoading = false,
  color = COLORS.PRIMARY,
  disabledColor = COLORS.BUTTON_DISABLE,
  textColor = COLORS.WHITE,
  disabledTextColor = COLORS.WHITE,
}) => {
  const backgroundColor = isDisabled ? disabledColor : color;
  const titleColor = isDisabled ? disabledTextColor : textColor;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled || isLoading}
      style={[styles.root, containerStyle, {backgroundColor}]}
      onPress={onPress}>
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={COLORS.WHITE}
          style={styles.loadingIndicator}
        />
      ) : (
        <StyledText variant="bold" color={titleColor}>
          {title}
        </StyledText>
      )}
    </TouchableOpacity>
  );
};
export default CustomButton;