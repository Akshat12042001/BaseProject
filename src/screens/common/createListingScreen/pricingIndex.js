import React, {useCallback, useState} from 'react';
import {Text, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {useTranslation} from 'react-i18next';
import {Formik} from 'formik';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Dropdown} from 'react-native-element-dropdown';
import {AnimatedSwitch, Input, StyledText} from '../../../components/atoms';
import {ClockIcon} from '../../../components/svgs';
import {COLORS, FONTS, FORM_SCHEMA} from '../../../constants';
import StepActions from './stepActions';
import {MINIMUM_STAY_OPTIONS} from './options';
import styles from './styles';

const TIME_FIELD = {
  CHECK_IN: 'checkIn',
  CHECK_OUT: 'checkOut',
};

const TIME_FORMAT = 'hh:mm A';

const parseListingTime = value => {
  const parsed = moment(value, TIME_FORMAT, true);
  return parsed.isValid() ? parsed.toDate() : new Date();
};

const pricingForm = FORM_SCHEMA.CREATE_LISTING_PRICING;
const fieldBorder = COLORS.LOGIN_INPUT_BORDER;
const fieldFocus = COLORS.LOGIN_PRIMARY;

const EMPTY_VALUES = {
  pricePerDay: '',
  weeklyStays: false,
  pricePerWeek: '',
  monthlyStays: false,
  pricePerMonth: '',
  offSeasonPrices: false,
  offSeasonPricePerDay: '',
  offSeasonPricePerMonth: '',
  cleaningFee: '',
  securityDeposit: '',
  minimumStay: '',
  checkInTime: '',
  checkOutTime: '',
};

const keepAmount = value => {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const [whole, ...fraction] = cleaned.split('.');

  if (!fraction.length) {
    return whole;
  }

  return `${whole}.${fraction.join('').slice(0, 2)}`;
};

const formatAmount = value => {
  if (!value || value === '.') {
    return value;
  }

  const amount = Number(value);
  return Number.isNaN(amount) ? value : amount.toFixed(2);
};

const ExternalLinkIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14 5h5v5M19 5l-9 9M10 6H6a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4"
      stroke={COLORS.LOGIN_PRIMARY}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const FieldLabel = ({label, required = false}) => (
  <StyledText size={14} containerStyle={styles.questionLabel}>
    {label}
    {required ? <Text style={styles.requiredMark}> **</Text> : null}
  </StyledText>
);

const PricingDropdown = ({items, value, onChange}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <Dropdown
      data={items}
      labelField="title"
      valueField="id"
      value={value}
      onChange={onChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      maxHeight={220}
      dropdownPosition="auto"
      style={[styles.pricingDropdown, isFocused && styles.dropdownFieldFocused]}
      selectedTextStyle={styles.dropdownSelectedText}
      selectedTextProps={{numberOfLines: 1}}
      itemTextStyle={styles.dropdownItemText}
      containerStyle={styles.dropdownList}
      activeColor={COLORS.GREYSCALE_100}
      fontFamily={FONTS.regular}
    />
  );
};

const AvailabilityCard = ({title, hint, value, onPress, children}) => (
  <View style={styles.availabilityCard}>
    <View style={styles.availabilitySwitch}>
      <AnimatedSwitch accessibilityLabel={title} value={value} onPress={onPress} />
      <View style={styles.availabilityCopy}>
        <StyledText variant="semiBold" size={14}>
          {title}
        </StyledText>
        <StyledText
          color={COLORS.GREYSCALE_500}
          size={12}
          lineHeight={18}
          containerStyle={styles.availabilityHint}>
          {hint}
        </StyledText>
      </View>
    </View>
    {children}
  </View>
);

const PricingStep = ({
  onNext,
  onPrevious,
  isFirst,
  isLast,
  initialValues = EMPTY_VALUES,
  formRef,
}) => {
  const {t} = useTranslation();
  const [activeTimeField, setActiveTimeField] = useState(null);

  const handleSubmit = useCallback(
    values => {
      onNext?.(values);
    },
    [onNext],
  );

  return (
    <Formik
      innerRef={formRef}
      validateOnChange
      enableReinitialize
      initialValues={initialValues}
      validationSchema={pricingForm.schema}
      onSubmit={handleSubmit}>
      {({
        setFieldTouched,
        setFieldValue,
        handleSubmit: submitForm,
        values,
        errors,
        touched,
      }) => {
        const fieldError = field =>
          touched[field] && errors[field] ? errors[field] : '';

        const handleAmountChange = field => text => {
          setFieldValue(field, keepAmount(text), true);
        };

        const handleAmountBlur = field => () => {
          setFieldTouched(field, true, false);
          setFieldValue(field, formatAmount(values[field]), true);
        };

        const handleWeeklyStays = nextValue => {
          setFieldValue('weeklyStays', nextValue, false);
        };

        const handleMonthlyStays = nextValue => {
          setFieldValue('monthlyStays', nextValue, false);
        };

        const handleOffSeason = nextValue => {
          setFieldValue('offSeasonPrices', nextValue, false);
        };

        const handleMinimumStay = item => {
          setFieldValue('minimumStay', item.id, true);
          setFieldTouched('minimumStay', true, false);
        };

        const handleOpenCheckIn = () => {
          setActiveTimeField(TIME_FIELD.CHECK_IN);
        };

        const handleOpenCheckOut = () => {
          setActiveTimeField(TIME_FIELD.CHECK_OUT);
        };

        const handleTimeCancel = () => {
          const field =
            activeTimeField === TIME_FIELD.CHECK_OUT
              ? 'checkOutTime'
              : 'checkInTime';
          setFieldTouched(field, true, true);
          setActiveTimeField(null);
        };

        const handleTimeConfirm = date => {
          const field =
            activeTimeField === TIME_FIELD.CHECK_OUT
              ? 'checkOutTime'
              : 'checkInTime';
          setFieldValue(field, moment(date).format(TIME_FORMAT), true);
          setFieldTouched(field, true, false);
          setActiveTimeField(null);
        };

        return (
          <>
          <KeyboardAwareScrollView
            enableOnAndroid
            enableAutomaticScroll
            enableResetScrollToCoords={false}
            extraScrollHeight={20}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
              <View style={styles.priceField}>
                <Input
                  label={t('CREATE_LISTING.PRICING.PRICE_PER_DAY')}
                  required
                  value={values.pricePerDay}
                  onChangeText={handleAmountChange('pricePerDay')}
                  onBlur={handleAmountBlur('pricePerDay')}
                  keyboardType="decimal-pad"
                  error={fieldError('pricePerDay')}
                  containerStyles={styles.priceHintField}
                  borderColor={fieldBorder}
                  focusedBorderColor={fieldFocus}
                />
                <StyledText
                  color={COLORS.GREYSCALE_500}
                  size={12}
                  containerStyle={styles.fieldHint}>
                  {t('CREATE_LISTING.PRICING.PRICE_PER_DAY_HINT')}
                </StyledText>
              </View>

              <StyledText
                size={15}
                variant="medium"
                containerStyle={styles.availabilityHeading}>
                {t('CREATE_LISTING.PRICING.STAY_AVAILABILITY')}
              </StyledText>

              <AvailabilityCard
                title={t('CREATE_LISTING.PRICING.WEEKLY_STAYS')}
                hint={t('CREATE_LISTING.PRICING.WEEKLY_HINT')}
                value={values.weeklyStays}
                onPress={handleWeeklyStays}
              />
              {values.weeklyStays ? (
                <Input
                  label={t('CREATE_LISTING.PRICING.PRICE_PER_WEEK')}
                  required
                  value={values.pricePerWeek}
                  onChangeText={handleAmountChange('pricePerWeek')}
                  onBlur={handleAmountBlur('pricePerWeek')}
                  keyboardType="decimal-pad"
                  error={fieldError('pricePerWeek')}
                  borderColor={fieldBorder}
                  focusedBorderColor={fieldFocus}
                />
              ) : null}

              <AvailabilityCard
                title={t('CREATE_LISTING.PRICING.MONTHLY_STAYS')}
                hint={t('CREATE_LISTING.PRICING.MONTHLY_HINT')}
                value={values.monthlyStays}
                onPress={handleMonthlyStays}
              />
              {values.monthlyStays ? (
                <Input
                  label={t('CREATE_LISTING.PRICING.PRICE_PER_MONTH')}
                  required
                  value={values.pricePerMonth}
                  onChangeText={handleAmountChange('pricePerMonth')}
                  onBlur={handleAmountBlur('pricePerMonth')}
                  keyboardType="decimal-pad"
                  error={fieldError('pricePerMonth')}
                  borderColor={fieldBorder}
                  focusedBorderColor={fieldFocus}
                />
              ) : null}

              <AvailabilityCard
                title={t('CREATE_LISTING.PRICING.OFF_SEASON')}
                value={values.offSeasonPrices}
                onPress={handleOffSeason}
                hint={
                  <>
                    {t('CREATE_LISTING.PRICING.OFF_SEASON_BEFORE')}
                    <Text style={styles.linkText}>
                      {t('CREATE_LISTING.PRICING.OFF_SEASON_LINK')}
                    </Text>
                    {t('CREATE_LISTING.PRICING.OFF_SEASON_AFTER')}
                  </>
                }>
                {values.offSeasonPrices ? (
                  <>
                    <View style={styles.offSeasonLink}>
                      <StyledText
                        color={COLORS.LOGIN_PRIMARY}
                        size={13}
                        variant="medium"
                        containerStyle={styles.offSeasonLinkText}>
                        {t('CREATE_LISTING.PRICING.OFF_SEASON_CALENDAR')}
                      </StyledText>
                      <ExternalLinkIcon />
                    </View>
                    <View style={styles.offSeasonFields}>
                      <Input
                        label={t('CREATE_LISTING.PRICING.OFF_SEASON_PRICE_PER_DAY')}
                        required
                        value={values.offSeasonPricePerDay}
                        onChangeText={handleAmountChange('offSeasonPricePerDay')}
                        onBlur={handleAmountBlur('offSeasonPricePerDay')}
                        keyboardType="decimal-pad"
                        error={fieldError('offSeasonPricePerDay')}
                        containerStyles={styles.priceHintField}
                        borderColor={fieldBorder}
                        focusedBorderColor={fieldFocus}
                      />
                      <StyledText
                        color={COLORS.GREYSCALE_500}
                        size={12}
                        containerStyle={styles.offSeasonHint}>
                        {t('CREATE_LISTING.PRICING.OFF_SEASON_PRICE_PER_DAY_HINT')}
                      </StyledText>
                      <Input
                        label={t('CREATE_LISTING.PRICING.OFF_SEASON_PRICE_PER_MONTH')}
                        required
                        value={values.offSeasonPricePerMonth}
                        onChangeText={handleAmountChange('offSeasonPricePerMonth')}
                        onBlur={handleAmountBlur('offSeasonPricePerMonth')}
                        keyboardType="decimal-pad"
                        error={fieldError('offSeasonPricePerMonth')}
                        containerStyles={styles.offSeasonLastField}
                        borderColor={fieldBorder}
                        focusedBorderColor={fieldFocus}
                      />
                    </View>
                  </>
                ) : null}
              </AvailabilityCard>

              <View style={styles.fieldRow}>
                <Input
                  label={t('CREATE_LISTING.PRICING.CLEANING_FEE')}
                  value={values.cleaningFee}
                  onChangeText={handleAmountChange('cleaningFee')}
                  onBlur={handleAmountBlur('cleaningFee')}
                  keyboardType="decimal-pad"
                  error={fieldError('cleaningFee')}
                  containerStyles={styles.halfField}
                  borderColor={fieldBorder}
                  focusedBorderColor={fieldFocus}
                />
                <Input
                  label={t('CREATE_LISTING.PRICING.SECURITY_DEPOSIT')}
                  value={values.securityDeposit}
                  onChangeText={handleAmountChange('securityDeposit')}
                  onBlur={handleAmountBlur('securityDeposit')}
                  keyboardType="decimal-pad"
                  error={fieldError('securityDeposit')}
                  containerStyles={styles.halfField}
                  borderColor={fieldBorder}
                  focusedBorderColor={fieldFocus}
                />
              </View>

              <View style={styles.priceField}>
                <FieldLabel
                  label={t('CREATE_LISTING.PRICING.MINIMUM_STAY')}
                  required
                />
                <PricingDropdown
                  items={MINIMUM_STAY_OPTIONS}
                  value={values.minimumStay}
                  onChange={handleMinimumStay}
                />
                {!!fieldError('minimumStay') && (
                  <StyledText
                    size={12}
                    color={COLORS.RED_ERROR}
                    containerStyle={styles.dropdownError}>
                    *{t(fieldError('minimumStay'))}
                  </StyledText>
                )}
              </View>

              <View style={styles.fieldRow}>
                <Input
                  label={t('CREATE_LISTING.PRICING.CHECK_IN_TIME')}
                  required
                  value={values.checkInTime}
                  editable={false}
                  rightIcon={
                    <ClockIcon
                      color={COLORS.GREYSCALE_500}
                      width={18}
                      height={18}
                    />
                  }
                  onPress={handleOpenCheckIn}
                  onRightIconPress={handleOpenCheckIn}
                  error={fieldError('checkInTime')}
                  containerStyles={styles.halfField}
                  borderColor={fieldBorder}
                  focusedBorderColor={fieldFocus}
                />
                <Input
                  label={t('CREATE_LISTING.PRICING.CHECK_OUT_TIME')}
                  required
                  value={values.checkOutTime}
                  editable={false}
                  rightIcon={
                    <ClockIcon
                      color={COLORS.GREYSCALE_500}
                      width={18}
                      height={18}
                    />
                  }
                  onPress={handleOpenCheckOut}
                  onRightIconPress={handleOpenCheckOut}
                  error={fieldError('checkOutTime')}
                  containerStyles={styles.halfField}
                  borderColor={fieldBorder}
                  focusedBorderColor={fieldFocus}
                />
              </View>

              <StepActions
                onPrevious={onPrevious}
                onNext={submitForm}
                isFirst={isFirst}
                isLast={isLast}
              />
            </View>
          </KeyboardAwareScrollView>
          <DatePicker
            modal
            mode="time"
            open={!!activeTimeField}
            date={parseListingTime(
              activeTimeField === TIME_FIELD.CHECK_OUT
                ? values.checkOutTime
                : values.checkInTime,
            )}
            title={t('CREATE_LISTING.PRICING.SELECT_TIME')}
            confirmText={t('CREATE_LISTING.PRICING.CONFIRM')}
            cancelText={t('CREATE_LISTING.PRICING.CANCEL')}
            onConfirm={handleTimeConfirm}
            onCancel={handleTimeCancel}
          />
          </>
        );
      }}
    </Formik>
  );
};

export default React.memo(PricingStep);
