import React from 'react';
import {StatusBar, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StyledText} from '../../atoms';
import {BackIcon} from '../../svgs';
import {COLORS} from '../../../constants';
import styles from './styles';

const ScreenHeader = ({
  title,
  subtitle,
  onBack,
  backAccessibilityLabel,
  badgeText,
  rightComponent,
  backgroundColor = COLORS.PRIMARY_DARK,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar backgroundColor={backgroundColor} barStyle="light-content" />
      <View
        style={[
          styles.container,
          {
            backgroundColor,
            paddingTop: insets.top + 10,
          },
        ]}>
        {!!onBack && (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={backAccessibilityLabel}
            onPress={onBack}
            style={styles.backButton}>
            <BackIcon />
          </TouchableOpacity>
        )}
        <View style={styles.textContainer}>
          <StyledText color={COLORS.SURFACE} variant="bold" size={17}>
            {title}
          </StyledText>
          {!!subtitle && (
            <StyledText color={COLORS.HEADER_TEXT_MUTED} size={10}>
              {subtitle}
            </StyledText>
          )}
        </View>
        {rightComponent ||
          (!!badgeText && (
            <View style={styles.badge}>
              <StyledText
                color={COLORS.PRIMARY_DARK}
                variant="semiBold"
                size={9}>
                {badgeText}
              </StyledText>
            </View>
          ))}
      </View>
    </>
  );
};

export default React.memo(ScreenHeader);
