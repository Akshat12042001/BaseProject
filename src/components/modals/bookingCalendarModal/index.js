import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {Calendar} from 'react-native-calendars';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {StyledText} from '../../atoms';
import {CloseIcon} from '../../svgs';
import {COLORS} from '../../../constants';
import {buildBookingCalendarMarkedDates} from '../../../utils/booking';
import {
  getTodayCalendarString,
  parseCalendarDateString,
  toCalendarDateString,
} from '../../../utils/calendar';
import styles from './styles';

const BookingCalendarModal = ({
  isVisible = false,
  title = '',
  selectedDate = null,
  minimumDate = null,
  allowAnyDate = false,
  unavailableDates = [],
  isLoading = false,
  useClearAction = false,
  onConfirm,
  onClear,
  onClose,
}) => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const [pendingDate, setPendingDate] = useState(null);

  const unavailableDateSet = useMemo(
    () => new Set(unavailableDates),
    [unavailableDates],
  );

  const minDateString = useMemo(() => {
    if (allowAnyDate) {
      return undefined;
    }
    if (minimumDate) {
      return toCalendarDateString(minimumDate);
    }
    return getTodayCalendarString();
  }, [allowAnyDate, minimumDate]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    if (selectedDate) {
      setPendingDate(toCalendarDateString(selectedDate));
      return;
    }

    setPendingDate(minDateString);
  }, [isVisible, minDateString, selectedDate]);

  const calendarTheme = useMemo(
    () => ({
      backgroundColor: COLORS.SURFACE,
      calendarBackground: COLORS.SURFACE,
      monthTextColor: COLORS.GREYSCALE_900,
      textMonthFontWeight: '600',
      textDayFontSize: 15,
      textMonthFontSize: 16,
      textDayHeaderFontSize: 12,
      dayTextColor: COLORS.GREYSCALE_900,
      textDisabledColor: COLORS.GREYSCALE_500,
      textSectionTitleColor: COLORS.GREYSCALE_500,
      todayTextColor: COLORS.LOGIN_PRIMARY,
      selectedDayBackgroundColor: COLORS.LOGIN_PRIMARY,
      selectedDayTextColor: COLORS.WHITE,
      arrowColor: COLORS.LOGIN_PRIMARY,
    }),
    [],
  );

  const visibleMonth = pendingDate || minDateString || getTodayCalendarString();

  const markedDates = useMemo(
    () =>
      buildBookingCalendarMarkedDates({
        selectedDateString: pendingDate,
        unavailableDates,
      }),
    [pendingDate, unavailableDates],
  );

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleDayPress = useCallback(
    day => {
      if (unavailableDateSet.has(day.dateString)) {
        return;
      }

      setPendingDate(day.dateString);
    },
    [unavailableDateSet],
  );

  const handleConfirm = useCallback(() => {
    if (!pendingDate || unavailableDateSet.has(pendingDate)) {
      return;
    }

    onConfirm?.(parseCalendarDateString(pendingDate));
  }, [onConfirm, pendingDate, unavailableDateSet]);

  const handleSecondaryAction = useCallback(() => {
    if (useClearAction) {
      onClear?.();
      return;
    }

    handleClose();
  }, [handleClose, onClear, useClearAction]);

  const secondaryActionLabel = useClearAction
    ? t('BOOKING_LIST.CLEAR')
    : t('CREATE_BOOKING.CANCEL_PICKER');

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={handleClose}
      onBackdropPress={handleClose}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating
      useNativeDriver>
      <View style={[styles.container, {paddingBottom: Math.max(insets.bottom, 16)}]}>
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <StyledText variant="bold" size={18} containerStyle={styles.title}>
            {title}
          </StyledText>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t('CREATE_BOOKING.CANCEL_PICKER')}
            onPress={handleClose}
            style={styles.closeButton}>
            <CloseIcon color={COLORS.TEXT} size={16} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator color={COLORS.LOGIN_PRIMARY} size="large" />
          </View>
        ) : (
          <Calendar
            key={isVisible ? visibleMonth : 'hidden'}
            current={visibleMonth}
            {...(minDateString ? {minDate: minDateString} : {})}
            markedDates={markedDates}
            onDayPress={handleDayPress}
            enableSwipeMonths
            theme={calendarTheme}
            style={styles.calendar}
          />
        )}

        <View style={styles.actionsRow}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={secondaryActionLabel}
            onPress={handleSecondaryAction}
            style={styles.cancelButton}>
            <StyledText color={COLORS.LOGIN_PRIMARY} variant="semiBold" size={14}>
              {secondaryActionLabel}
            </StyledText>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            disabled={isLoading || !pendingDate || unavailableDateSet.has(pendingDate)}
            onPress={handleConfirm}
            style={styles.confirmButton}>
            <StyledText color={COLORS.WHITE} variant="semiBold" size={14}>
              {t('CREATE_BOOKING.CONFIRM')}
            </StyledText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BookingCalendarModal;
