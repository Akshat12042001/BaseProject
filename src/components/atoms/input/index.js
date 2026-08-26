import React, {useState, useCallback, forwardRef} from 'react';
import {View, Text, TouchableOpacity, Pressable, TextInput} from 'react-native';
import styles from './styles';
import {SharedStyles} from '../../../shared';
import {COLORS} from '../../../constants';
import {EyeClose, EyeOpen} from '../../svgs';
import StyledText from '../styledText';
import {useTranslation} from 'react-i18next';

export default forwardRef(
  (
    {
      error,
      isPassword = false,
      editable = true,
      onPress,
      label = '',
      value = '',
      onChangeText = undefined,
      leftIcon = null,
      rightIcon = null,
      placeholder = '',
      containerStyles = {},
      inputStyle = {},
      borderColor = COLORS.PRIMARY_LIGHT,
      focusedBorderColor = COLORS.PRIMARY,
      inputTextColor = COLORS.GREYSCALE_900,
      showErrorPadding = true,
      isVerified = false,
      isLoading = false,
      onRightIconPress = undefined,
      ...props
    },
    ref,
  ) => {
    const {t} = useTranslation();
    const [isSecure, setIsSecure] = useState(isPassword);
    const [isFocused, setIsFocused] = useState(false);

    const {onFocus, onBlur, multiline, numberOfLines} = props;

    const onFocusHandler = useCallback(() => {
      onFocus?.();
      setIsFocused(true);
    }, [onFocus]);

    const onBlurHandler = useCallback(
      e => {
        onBlur?.(e);
        setIsFocused(false);
      },
      [onBlur],
    );

    const handleRightIconPress = useCallback(() => {
      onRightIconPress?.();
      if (isPassword) {
        setIsSecure(currentValue => !currentValue);
      }
    }, [isPassword, onRightIconPress]);

    const currentBorderColor = error
      ? COLORS.RED_ERROR
      : isFocused
      ? focusedBorderColor
      : borderColor;
    const hasRightIcon = isPassword || !!rightIcon;

      const labelColor = error
      ? COLORS.RED_ERROR
      : isFocused
      ? focusedBorderColor
      : COLORS.GREYSCALE_500;

    return (
      <Pressable style={[styles.main, containerStyles]} onPress={onPress}>
        <StyledText
          size={12}
          color={labelColor}
          variant="regular"
          containerStyle={styles.labelContainer}>
          {label}
        </StyledText>
        {!!leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          ref={ref}
          {...props}
          autoCapitalize="none"
          onPressIn={onPress}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          placeholder={placeholder}
          onBlur={onBlurHandler}
          onFocus={onFocusHandler}
          secureTextEntry={isSecure}
          placeholderTextColor={COLORS.GREYSCALE_500}
          multiline={multiline}
          style={[
            styles.inputField,
            {
              borderColor: currentBorderColor,
              color: inputTextColor,
            },
            leftIcon && styles.inputWithLeftIcon,
            hasRightIcon && styles.inputWithRightIcon,
            inputStyle,
          ]}
          numberOfLines={numberOfLines}
        />
        {hasRightIcon && (
          <TouchableOpacity
            style={styles.passwordIcon}
            hitSlop={SharedStyles.hitSlop10}
            onPress={handleRightIconPress}>
            {rightIcon || (isSecure ? <EyeClose /> : <EyeOpen size="20" />)}
          </TouchableOpacity>
        )}
        {!!error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {error ? `*${t(error)}` : null}
            </Text>
          </View>
        )}
      </Pressable>
    );
  },
);