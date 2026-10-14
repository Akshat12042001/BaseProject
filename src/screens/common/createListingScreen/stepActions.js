import React, {useCallback} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {StyledText} from '../../../components/atoms';
import {COLORS} from '../../../constants';
import styles from './styles';

const StepActions = ({onPrevious, onNext, isFirst = false, isLast = false}) => {
  const {t} = useTranslation();

  const handlePrevious = useCallback(() => {
    onPrevious?.();
  }, [onPrevious]);

  const handleNext = useCallback(() => {
    onNext?.();
  }, [onNext]);

  return (
    <View>
      <View style={styles.footerDivider} />
      <View style={styles.footer}>
        <TouchableOpacity
          accessibilityRole="button"
          disabled={isFirst}
          onPress={handlePrevious}
          style={[
            styles.previousButton,
            isFirst && styles.previousButtonDisabled,
          ]}>
          <StyledText variant="semiBold" size={14} color={COLORS.GREYSCALE_900}>
            {t('CREATE_LISTING.PREVIOUS')}
          </StyledText>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          disabled={isLast}
          onPress={handleNext}
          style={[styles.nextButton, isLast && styles.nextButtonDisabled]}>
          <StyledText variant="semiBold" size={14} color={COLORS.WHITE}>
            {t('CREATE_LISTING.NEXT')}
          </StyledText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(StepActions);
