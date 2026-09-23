import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import {Input, ScreenContainer, StyledText} from '../../../components/atoms';
import {BookingCalendarModal} from '../../../components/modals';
import {InvoiceItemDropdown, ScreenHeader} from '../../../components/molecules';
import {CalendarIcon, CheckIcon, MinusIcon, PlusIcon} from '../../../components/svgs';
import {COLORS, FORM_SCHEMA} from '../../../constants';
import {
  makeCreateDirectBookingRequest,
  makeGetHomestayCalendarRequest,
  makeGetHostListingsDropdownRequest,
} from '../../../api/common';
import {errorToast, successToast} from '../../../utils/alerts';
import {
  buildDirectBookingNote,
  buildDirectBookingPayload,
  findListingByTitle,
  formatHostListingsDropdown,
  getDefaultCheckOutDate,
  getHomestayCalendarQueryRange,
  getUnavailableDateStrings,
  resolveDefaultCheckOutDate,
} from '../../../utils/booking';
import styles from './styles';

const DATE_FIELD = {
  CHECK_IN: 'checkIn',
  CHECK_OUT: 'checkOut',
};

const PETS_MAX = 3;
const CHILDREN_CAP = 2;
const DEFAULT_MAX_GUESTS = 9;

const EMPTY_VALUES = {
  homestayId: '',
  homestayTitle: '',
  checkIn: null,
  checkOut: null,
  fullName: '',
  email: '',
  phone: '',
  bookingAmount: '',
  advancePayment: '',
};

const sanitizeDecimal = value => {
  const sanitizedValue = value.replace(/[^0-9.]/g, '');
  const [wholeNumber, ...decimalParts] = sanitizedValue.split('.');
  return decimalParts.length
    ? `${wholeNumber}.${decimalParts.join('')}`
    : wholeNumber;
};

const formatDate = date => (date ? moment(date).format('DD/MM/YYYY') : '');

const SectionLabel = ({children, required = false}) => {
  const {t} = useTranslation();

  return (
    <StyledText
      variant="semiBold"
      size={14}
    //   color={COLORS.GREYSCALE_500}
      containerStyle={styles.sectionLabel}>
      {children}
      {required ? (
        <StyledText size={11} containerStyle={styles.requiredMark}>
          {' '}
          {t('CREATE_BOOKING.REQUIRED_MARK')}
        </StyledText>
      ) : null}
    </StyledText>
  );
};

const GuestStepperRow = ({
  title,
  subtitle,
  value,
  min,
  max,
  isLast = false,
  onDecrement,
  onIncrement,
}) => {
  const canDecrement = value > min;
  const canIncrement = value < max;

  return (
    <View style={[styles.guestRow, isLast && styles.guestRowLast]}>
      <View style={styles.guestRowText}>
        <StyledText variant="semiBold" size={13}>
          {title}
        </StyledText>
        <StyledText
          size={11}
          color={COLORS.GREYSCALE_500}
          containerStyle={styles.guestSubtitle}>
          {subtitle}
        </StyledText>
      </View>
      <View style={styles.stepper}>
        <TouchableOpacity
          accessibilityRole="button"
          disabled={!canDecrement}
          onPress={onDecrement}
          style={[
            styles.stepperButton,
            !canDecrement && styles.stepperButtonDisabled,
          ]}>
          <MinusIcon
            color={
              canDecrement ? COLORS.LOGIN_PRIMARY : COLORS.GREYSCALE_500
            }
          />
        </TouchableOpacity>
        <StyledText variant="bold" size={15} containerStyle={styles.stepperValue}>
          {value}
        </StyledText>
        <TouchableOpacity
          accessibilityRole="button"
          disabled={!canIncrement}
          onPress={onIncrement}
          style={[
            styles.stepperButton,
            !canIncrement && styles.stepperButtonDisabled,
          ]}>
          <PlusIcon
            color={canIncrement ? COLORS.LOGIN_PRIMARY : COLORS.GREYSCALE_500}
            size={14}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const MealCheckboxRow = ({title, subtitle, checked, isLast = false, onToggle}) => (
  <View style={[styles.guestRow, isLast && styles.guestRowLast]}>
    <View style={styles.guestRowText}>
      <StyledText variant="semiBold" size={13}>
        {title}
      </StyledText>
      <StyledText
        size={11}
        color={COLORS.GREYSCALE_500}
        containerStyle={styles.guestSubtitle}>
        {subtitle}
      </StyledText>
    </View>
    <TouchableOpacity
      accessibilityRole="checkbox"
      accessibilityState={{checked}}
      onPress={onToggle}
      style={[styles.checkbox, checked && styles.checkboxChecked]}>
      {checked ? <CheckIcon color={COLORS.WHITE} size={14} /> : null}
    </TouchableOpacity>
  </View>
);

const CreateBookingScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const inputRefs = useRef(FORM_SCHEMA.CREATE_BOOKING.fields.map(() => null));

  const [listingOptions, setListingOptions] = useState([]);
  const [isListingsLoading, setIsListingsLoading] = useState(true);
  const [maxGuests, setMaxGuests] = useState(DEFAULT_MAX_GUESTS);
  const [activeDateField, setActiveDateField] = useState(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0);
  const [breakfastIncluded, setBreakfastIncluded] = useState(false);
  const [dinnerIncluded, setDinnerIncluded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);

  const fetchHomestayCalendar = useCallback(async homestayId => {
    if (!homestayId) {
      setUnavailableDates([]);
      return;
    }

    try {
      setIsCalendarLoading(true);
      const range = getHomestayCalendarQueryRange();
      const response = await makeGetHomestayCalendarRequest(homestayId, range);
      setUnavailableDates(getUnavailableDateStrings(response));
    } catch {
      setUnavailableDates([]);
    } finally {
      setIsCalendarLoading(false);
    }
  }, []);

  const maxAdults = useMemo(
    () => Math.max(1, maxGuests - children),
    [children, maxGuests],
  );

  const maxChildren = useMemo(
    () => Math.min(CHILDREN_CAP, Math.max(0, maxGuests - adults)),
    [adults, maxGuests],
  );

  useEffect(() => {
    let isMounted = true;

    const fetchListings = async () => {
      try {
        setIsListingsLoading(true);
        const response = await makeGetHostListingsDropdownRequest({
          page: 1,
          limit: 9,
        });
        if (isMounted) {
          setListingOptions(formatHostListingsDropdown(response));
        }
      } catch {
        if (isMounted) {
          setListingOptions([]);
        }
      } finally {
        if (isMounted) {
          setIsListingsLoading(false);
        }
      }
    };

    fetchListings();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setAdults(current => Math.min(current, maxAdults));
    setChildren(current => Math.min(current, maxChildren));
  }, [maxAdults, maxChildren]);

  const currencyPrefix = useMemo(
    () => (
      <StyledText variant="semiBold" size={15} containerStyle={styles.currencyPrefix}>
        ₹
      </StyledText>
    ),
    [],
  );

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleCancel = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSubmit = useCallback(
    async values => {
      setIsSubmitting(true);
      try {
        const checkOut =
          values.checkOut ||
          (values.checkIn
            ? resolveDefaultCheckOutDate(values.checkIn, unavailableDates)
            : null);

        const payload = buildDirectBookingPayload({
          homestayId: values.homestayId,
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          checkIn: values.checkIn,
          checkOut,
          adults,
          childrenCount: children,
          pets,
          bookingAmount: values.bookingAmount,
          advancePayment: values.advancePayment,
          breakfastIncluded,
          dinnerIncluded,
          note: buildDirectBookingNote(t),
        });

        const response = await makeCreateDirectBookingRequest(payload);
        successToast(
          response?.message || t('CREATE_BOOKING.CREATED_SUCCESSFULLY'),
        );
        navigation.goBack();
      } catch {
        // APIClient displays the server error toast.
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      adults,
      breakfastIncluded,
      children,
      dinnerIncluded,
      navigation,
      pets,
      t,
      unavailableDates,
    ],
  );

  const fieldBorder = COLORS.INVOICE_FORM_FIELD_BORDER;
  const fieldFocus = COLORS.LOGIN_PRIMARY;
  const bookingForm = FORM_SCHEMA.CREATE_BOOKING;

  return (
    <ScreenContainer noPaddingTop noPaddingBottom>
      <ScreenHeader
        title={t('CREATE_BOOKING.TITLE')}
        backAccessibilityLabel={t('CREATE_BOOKING.BACK')}
        onBack={handleBack}
      />

      <Formik
        validateOnChange
        enableReinitialize
        onSubmit={handleSubmit}
        initialValues={EMPTY_VALUES}
        validationSchema={bookingForm.schema}>
        {({
          handleBlur,
          handleChange,
          handleSubmit: submitForm,
          setFieldValue,
          setFieldTouched,
          values,
          errors,
          touched,
        }) => {
          const applyHomestaySelection = (listing, title) => {
            setFieldValue('checkIn', null);
            setFieldValue('checkOut', null);

            if (listing?.id) {
              const homestayId = String(listing.id);
              setFieldValue('homestayId', homestayId, true);
              setFieldValue('homestayTitle', listing.title || title || '', true);
              setMaxGuests(listing.maxGuests || DEFAULT_MAX_GUESTS);
              fetchHomestayCalendar(homestayId);
              return;
            }

            setFieldValue('homestayId', '', true);
            setFieldValue('homestayTitle', title || '', true);
            setMaxGuests(DEFAULT_MAX_GUESTS);
            fetchHomestayCalendar('');
          };

          const handleHomestayChange = value => {
            const match = findListingByTitle(listingOptions, value);
            applyHomestaySelection(match, value);
          };

          const handleHomestaySelect = item => {
            const title = item?.title || '';
            const match =
              findListingByTitle(listingOptions, title) ||
              (item?.id
                ? {
                    id: item.id,
                    title,
                    maxGuests: item.maxGuests,
                  }
                : null);

            applyHomestaySelection(match, title);
            setFieldTouched('homestayId', true, false);
            setFieldTouched('homestayTitle', true, false);
          };

          const handleOpenCheckInPicker = () => {
            setActiveDateField(DATE_FIELD.CHECK_IN);
            setFieldTouched('checkIn', true);
          };

          const handleOpenCheckOutPicker = () => {
            if (!values.checkIn) {
              errorToast(t('CREATE_BOOKING.SELECT_CHECK_IN_FIRST'));
              setFieldTouched('checkIn', true);
              return;
            }

            setActiveDateField(DATE_FIELD.CHECK_OUT);
            setFieldTouched('checkOut', true);
          };

          const handleDateConfirm = date => {
            if (activeDateField === DATE_FIELD.CHECK_IN) {
              const defaultCheckOut = resolveDefaultCheckOutDate(
                date,
                unavailableDates,
              );
              setFieldValue('checkIn', date, true);
              setFieldValue('checkOut', defaultCheckOut, true);
              setFieldTouched('checkIn', true, false);
              setFieldTouched('checkOut', true, false);
            } else if (activeDateField === DATE_FIELD.CHECK_OUT) {
              setFieldValue('checkOut', date, true);
              setFieldTouched('checkOut', true, false);
            }
            setActiveDateField(null);
          };

          const checkOutDisplayDate =
            values.checkOut ||
            (values.checkIn
              ? resolveDefaultCheckOutDate(values.checkIn, unavailableDates)
              : null);

          const checkOutMinimumDate = values.checkIn
            ? getDefaultCheckOutDate(values.checkIn)
            : new Date();

          const handleDateCancel = () => {
            setActiveDateField(null);
          };

          const handleAmountChange = (fieldKey, value) => {
            setFieldValue(fieldKey, sanitizeDecimal(value));
          };

          return (
            <View style={styles.flex}>
              <KeyboardAwareScrollView
                enableOnAndroid
                enableAutomaticScroll
                enableResetScrollToCoords={false}
                extraScrollHeight={20}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                  <SectionLabel>{t('CREATE_BOOKING.SELECT_HOMESTAY')}</SectionLabel>
                  <InvoiceItemDropdown
                    label={t('CREATE_BOOKING.HOMESTAY')}
                    placeholder={t('CREATE_BOOKING.HOMESTAY_PLACEHOLDER')}
                    items={listingOptions}
                    value={values.homestayTitle}
                    isLoading={isListingsLoading}
                    showAmount={false}
                    onChangeText={handleHomestayChange}
                    onSelectItem={handleHomestaySelect}
                    containerStyle={{marginBottom: 5}}
                  />
                  {!!touched.homestayId &&
                    !!errors.homestayId &&
                    !values.homestayId && (
                    <StyledText size={12} color={COLORS.RED_ERROR}>
                      *{t(errors.homestayId)}
                    </StyledText>
                  )}
                </View>

                <View style={styles.section}>
                  <SectionLabel>{t('CREATE_BOOKING.STAY_DATES')}</SectionLabel>
                  <View style={styles.fieldsRow}>
                    <Input
                      label={t('CREATE_BOOKING.CHECK_IN')}
                      value={formatDate(values.checkIn)}
                      placeholder={t('CREATE_BOOKING.CHECK_IN_PLACEHOLDER')}
                      rightIcon={<CalendarIcon />}
                      editable={false}
                      onPress={handleOpenCheckInPicker}
                      onRightIconPress={handleOpenCheckInPicker}
                      error={
                        touched.checkIn && errors.checkIn && !values.checkIn
                          ? errors.checkIn
                          : undefined
                      }
                      containerStyles={styles.dateField}
                      borderColor={fieldBorder}
                      focusedBorderColor={fieldFocus}
                    />
                    <Input
                      label={t('CREATE_BOOKING.CHECK_OUT')}
                      value={formatDate(checkOutDisplayDate)}
                      placeholder={t('CREATE_BOOKING.CHECK_OUT_PLACEHOLDER')}
                      rightIcon={<CalendarIcon />}
                      editable={false}
                      onPress={handleOpenCheckOutPicker}
                      onRightIconPress={handleOpenCheckOutPicker}
                      error={
                        touched.checkOut && errors.checkOut && !checkOutDisplayDate
                          ? errors.checkOut
                          : undefined
                      }
                      containerStyles={[styles.dateField, styles.lastField]}
                      borderColor={fieldBorder}
                      focusedBorderColor={fieldFocus}
                    />
                  </View>
                </View>

                <View style={{marginTop:-10, marginBottom: 10}}>
                  <SectionLabel>{t('CREATE_BOOKING.USER_DETAILS')}</SectionLabel>
                  {bookingForm.fields.slice(0, 3).map((field, index) => {
                    const fieldKey = field.type;

                    return (
                      <Input
                        {...field}
                        ref={ref => {
                          inputRefs.current[index] = ref;
                        }}
                        key={fieldKey}
                        label={t(field.label)}
                        value={values[fieldKey]}
                        onBlur={handleBlur(fieldKey)}
                        placeholder={t(field.placeholder)}
                        onChangeText={handleChange(fieldKey)}
                        error={touched?.[fieldKey] && errors?.[fieldKey]}
                        borderColor={fieldBorder}
                        focusedBorderColor={fieldFocus}
                        containerStyles={
                          index === 2 ? styles.lastField : undefined
                        }
                      />
                    );
                  })}
                </View>

                <View style={styles.section}>
                  <SectionLabel>{t('CREATE_BOOKING.GUESTS')}</SectionLabel>
                  <View style={styles.guestsCard}>
                    <GuestStepperRow
                      title={t('CREATE_BOOKING.ADULTS')}
                      subtitle={t('CREATE_BOOKING.ADULTS_HINT', {max: maxGuests})}
                      value={adults}
                      min={1}
                      max={maxAdults}
                      onDecrement={() =>
                        setAdults(current => Math.max(1, current - 1))
                      }
                      onIncrement={() =>
                        setAdults(current => Math.min(maxAdults, current + 1))
                      }
                    />
                    <GuestStepperRow
                      title={t('CREATE_BOOKING.CHILDREN')}
                      subtitle={t('CREATE_BOOKING.CHILDREN_HINT')}
                      value={children}
                      min={0}
                      max={maxChildren}
                      onDecrement={() =>
                        setChildren(current => Math.max(0, current - 1))
                      }
                      onIncrement={() =>
                        setChildren(current => Math.min(maxChildren, current + 1))
                      }
                    />
                    <GuestStepperRow
                      title={t('CREATE_BOOKING.PETS')}
                      subtitle={t('CREATE_BOOKING.PETS_HINT')}
                      value={pets}
                      min={0}
                      max={PETS_MAX}
                      onDecrement={() =>
                        setPets(current => Math.max(0, current - 1))
                      }
                      onIncrement={() =>
                        setPets(current => Math.min(PETS_MAX, current + 1))
                      }
                    />
                    <MealCheckboxRow
                      title={t('CREATE_BOOKING.BREAKFAST_INCLUDED')}
                      subtitle={t('CREATE_BOOKING.BREAKFAST_INCLUDED_HINT')}
                      checked={breakfastIncluded}
                      onToggle={() => setBreakfastIncluded(current => !current)}
                    />
                    <MealCheckboxRow
                      title={t('CREATE_BOOKING.DINNER_INCLUDED')}
                      subtitle={t('CREATE_BOOKING.DINNER_INCLUDED_HINT')}
                      checked={dinnerIncluded}
                      isLast
                      onToggle={() => setDinnerIncluded(current => !current)}
                    />
                  </View>
                </View>

                {bookingForm.fields.slice(3).map((field, index) => {
                  const fieldKey = field.type;

                  return (
                    <View key={fieldKey} style={styles.section}>
                      <SectionLabel required={fieldKey === 'bookingAmount'}>
                        {t(
                          fieldKey === 'bookingAmount'
                            ? 'CREATE_BOOKING.BOOKING_AMOUNT'
                            : 'CREATE_BOOKING.ADVANCE_PAYMENT',
                        )}
                      </SectionLabel>
                      <Input
                        {...field}
                        ref={ref => {
                          inputRefs.current[index + 3] = ref;
                        }}
                        value={values[fieldKey]}
                        label={t(field.label)}
                        onBlur={handleBlur(fieldKey)}
                        placeholder={t(field.placeholder)}
                        onChangeText={value => handleAmountChange(fieldKey, value)}
                        error={touched?.[fieldKey] && errors?.[fieldKey]}
                        leftIcon={currencyPrefix}
                        containerStyles={styles.lastField}
                        borderColor={fieldBorder}
                        focusedBorderColor={fieldFocus}
                      />
                    </View>
                  );
                })}

                <View style={styles.section}>
                  <SectionLabel>{t('CREATE_BOOKING.NOTE')}</SectionLabel>
                  <View style={styles.noteCard}>
                    <StyledText size={13} containerStyle={styles.noteParagraph}>
                      {t('CREATE_BOOKING.NOTE_LINE_1')}
                    </StyledText>
                    <StyledText size={13} containerStyle={styles.noteParagraph}>
                      {t('CREATE_BOOKING.NOTE_LINE_2')}
                    </StyledText>
                    <StyledText size={13}>{t('CREATE_BOOKING.NOTE_LINE_3')}</StyledText>
                  </View>
                </View>
              </KeyboardAwareScrollView>

              <View
                style={[styles.footer, {paddingBottom: Math.max(insets.bottom, 12)}]}>
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    accessibilityRole="button"
                    disabled={isSubmitting}
                    onPress={handleCancel}
                    style={[styles.cancelButton, isSubmitting && styles.disabledButton]}>
                    <StyledText color={COLORS.LOGIN_PRIMARY} variant="semiBold" size={14}>
                      {t('CREATE_BOOKING.CANCEL')}
                    </StyledText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    accessibilityRole="button"
                    disabled={isSubmitting}
                    onPress={submitForm}
                    style={[styles.createButton, isSubmitting && styles.disabledButton]}>
                    {isSubmitting ? (
                      <ActivityIndicator color={COLORS.WHITE} />
                    ) : (
                      <StyledText color={COLORS.WHITE} variant="semiBold" size={14}>
                        {t('CREATE_BOOKING.CREATE')}
                      </StyledText>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <BookingCalendarModal
                isVisible={!!activeDateField}
                title={
                  activeDateField === DATE_FIELD.CHECK_IN
                    ? t('CREATE_BOOKING.CHECK_IN')
                    : t('CREATE_BOOKING.CHECK_OUT')
                }
                selectedDate={
                  activeDateField === DATE_FIELD.CHECK_OUT
                    ? values.checkOut || checkOutDisplayDate
                    : values.checkIn
                }
                minimumDate={
                  activeDateField === DATE_FIELD.CHECK_OUT
                    ? checkOutMinimumDate
                    : new Date()
                }
                unavailableDates={unavailableDates}
                isLoading={isCalendarLoading}
                onConfirm={handleDateConfirm}
                onClose={handleDateCancel}
              />
            </View>
          );
        }}
      </Formik>
    </ScreenContainer>
  );
};

export default CreateBookingScreen;
