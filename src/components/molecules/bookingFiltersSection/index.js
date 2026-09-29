import React, {useCallback} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Input, StyledText} from '../../atoms';
import {CalendarIcon} from '../../svgs';
import {COLORS} from '../../../constants';
import {BOOKING_LIST_FILTER_SCOPE} from '../../../utils/booking';
import styles from './styles';

const BookingFiltersSection = ({
  searchQuery,
  onSearchChange,
  checkInFromValue,
  checkInToValue,
  onOpenCheckInFrom,
  onOpenCheckInTo,
  filterScope,
  onFilterScopeChange,
}) => {
  const {t} = useTranslation();

  const handleActiveScope = useCallback(() => {
    onFilterScopeChange?.(BOOKING_LIST_FILTER_SCOPE.ACTIVE_UPCOMING);
  }, [onFilterScopeChange]);

  const handleAllScope = useCallback(() => {
    onFilterScopeChange?.(BOOKING_LIST_FILTER_SCOPE.ALL);
  }, [onFilterScopeChange]);

  const isActiveScope =
    filterScope === BOOKING_LIST_FILTER_SCOPE.ACTIVE_UPCOMING;

  const fieldBorder = COLORS.INVOICE_FORM_FIELD_BORDER;
  const fieldFocus = COLORS.LOGIN_PRIMARY;

  return (
    <View style={styles.container}>
      <View style={styles.filterCard}>
        <Input
          value={searchQuery}
          label={t('Search')}
          onChangeText={onSearchChange}
          placeholder={t('BOOKING_LIST.SEARCH_PLACEHOLDER')}
          containerStyles={styles.searchField}
          borderColor={fieldBorder}
          focusedBorderColor={fieldFocus}
        />

        <View style={styles.dateRow}>
          <Input
            label={t('BOOKING_LIST.CHECK_IN_FROM')}
            value={checkInFromValue}
            placeholder={t('BOOKING_LIST.DATE_PLACEHOLDER')}
            rightIcon={<CalendarIcon />}
            editable={false}
            onPress={onOpenCheckInFrom}
            onRightIconPress={onOpenCheckInFrom}
            containerStyles={styles.dateField}
            borderColor={fieldBorder}
            focusedBorderColor={fieldFocus}
          />
          <Input
            label={t('BOOKING_LIST.CHECK_IN_TO')}
            value={checkInToValue}
            placeholder={t('BOOKING_LIST.DATE_PLACEHOLDER')}
            rightIcon={<CalendarIcon />}
            editable={false}
            onPress={onOpenCheckInTo}
            onRightIconPress={onOpenCheckInTo}
            containerStyles={styles.dateField}
            borderColor={fieldBorder}
            focusedBorderColor={fieldFocus}
          />
        </View>
      </View>

      <View style={styles.toggleSection}>
        <View style={styles.toggleRow}>
          <View style={styles.toggleGroup}>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={handleActiveScope}
              style={[
                styles.toggleButton,
                isActiveScope && styles.toggleButtonActive,
              ]}>
              <StyledText
                variant="semiBold"
                size={12}
                color={isActiveScope ? COLORS.WHITE : COLORS.GREYSCALE_700}>
                {t('BOOKING_LIST.FILTER_ACTIVE_UPCOMING')}
              </StyledText>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={handleAllScope}
              style={[
                styles.toggleButton,
                !isActiveScope && styles.toggleButtonActive,
              ]}>
              <StyledText
                variant="semiBold"
                size={12}
                color={!isActiveScope ? COLORS.WHITE : COLORS.GREYSCALE_700}>
                {t('BOOKING_LIST.FILTER_ALL')}
              </StyledText>
            </TouchableOpacity>
          </View>
          {isActiveScope ? (
            <StyledText
              color={COLORS.TEXT_MUTED}
              size={11}
              containerStyle={styles.toggleHint}>
              {t('BOOKING_LIST.FILTER_ACTIVE_HINT')}
            </StyledText>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default React.memo(BookingFiltersSection);
