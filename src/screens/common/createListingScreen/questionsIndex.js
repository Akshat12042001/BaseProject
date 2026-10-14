import React, {useCallback, useState} from 'react';
import {TextInput, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import {AnimatedSwitch, StyledText} from '../../../components/atoms';
import {COLORS, FONTS, FORM_SCHEMA} from '../../../constants';
import StepActions from './stepActions';
import {
  DISTANCE_UNITS,
  SUITABLE_FOR_OPTIONS,
  WALKING_DISTANCE_UNITS,
} from './options';
import styles from './styles';

const questionsForm = FORM_SCHEMA.CREATE_LISTING_QUESTIONS;

const EMPTY_VALUES = {
  distanceFromTown: '1',
  distanceUnit: 'kilometers',
  offRoad: false,
  walkingDistance: '100',
  walkingUnit: 'meters',
  privateParking: false,
  stairClimb: false,
  suitableFor: [],
};

const keepDigits = value => value.replace(/[^0-9]/g, '');

const UnitDropdown = React.memo(({items, value, onChange}) => {
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
      maxHeight={180}
      dropdownPosition="bottom"
      style={[styles.unitField, isFocused && styles.dropdownFieldFocused]}
      selectedTextStyle={styles.unitSelectedText}
      selectedTextProps={{numberOfLines: 1}}
      placeholderStyle={styles.dropdownPlaceholder}
      itemTextStyle={styles.dropdownItemText}
      containerStyle={styles.dropdownList}
      activeColor={COLORS.GREYSCALE_100}
      fontFamily={FONTS.regular}
    />
  );
});

const MeasureField = ({
  label,
  value,
  error,
  onChangeText,
  onBlur,
  unitItems,
  unitValue,
  onUnitChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(
    event => {
      setIsFocused(false);
      onBlur?.(event);
    },
    [onBlur],
  );

  return (
    <View style={styles.questionBlock}>
      <StyledText size={14} containerStyle={styles.questionLabel}>
        {label}
      </StyledText>
      <View style={styles.measureRow}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType="number-pad"
          style={[
            styles.measureInput,
            isFocused && styles.measureInputFocused,
            !!error && styles.measureInputError,
          ]}
        />
        <UnitDropdown items={unitItems} value={unitValue} onChange={onUnitChange} />
      </View>
      {!!error && (
        <StyledText
          size={12}
          color={COLORS.RED_ERROR}
          containerStyle={styles.dropdownError}>
          *{error}
        </StyledText>
      )}
    </View>
  );
};

const SwitchField = ({label, caption, value, onPress}) => (
  <View style={styles.questionBlock}>
    <StyledText size={14} containerStyle={styles.questionLabel}>
      {label}
    </StyledText>
    <View style={styles.switchRow}>
      <AnimatedSwitch
        accessibilityLabel={label}
        value={value}
        onPress={onPress}
      />
      <StyledText
        color={COLORS.GREYSCALE_500}
        size={14}
        containerStyle={styles.switchCaption}>
        {caption}
      </StyledText>
    </View>
  </View>
);

const QuestionsStep = ({
  onNext,
  onPrevious,
  isFirst,
  isLast,
  initialValues = EMPTY_VALUES,
  formRef,
}) => {
  const {t} = useTranslation();
  const [isSuitableFocused, setIsSuitableFocused] = useState(false);

  const handleSubmit = useCallback(
    values => {
      onNext?.(values);
    },
    [onNext],
  );

  const handleSuitableFocus = useCallback(() => {
    setIsSuitableFocused(true);
  }, []);

  const handleSuitableBlur = useCallback(() => {
    setIsSuitableFocused(false);
  }, []);

  return (
    <Formik
      innerRef={formRef}
      validateOnChange
      enableReinitialize
      initialValues={initialValues}
      validationSchema={questionsForm.schema}
      onSubmit={handleSubmit}>
      {({
        handleBlur,
        setFieldTouched,
        setFieldValue,
        handleSubmit: submitForm,
        values,
        errors,
        touched,
      }) => {
        const handleDistanceChange = text => {
          setFieldValue('distanceFromTown', keepDigits(text), true);
        };

        const handleWalkingChange = text => {
          setFieldValue('walkingDistance', keepDigits(text), true);
        };

        const handleDistanceUnit = item => {
          setFieldValue('distanceUnit', item.id, true);
          setFieldTouched('distanceUnit', true, false);
        };

        const handleWalkingUnit = item => {
          setFieldValue('walkingUnit', item.id, true);
          setFieldTouched('walkingUnit', true, false);
        };

        const handleOffRoad = nextValue => {
          setFieldValue('offRoad', nextValue, false);
        };

        const handleParking = nextValue => {
          setFieldValue('privateParking', nextValue, false);
        };

        const handleStairClimb = nextValue => {
          setFieldValue('stairClimb', nextValue, false);
        };

        const handleSuitableChange = selected => {
          setFieldValue('suitableFor', selected, true);
          setFieldTouched('suitableFor', true, false);
        };

        const onSuitableBlur = () => {
          handleSuitableBlur();
          setFieldTouched('suitableFor', true, true);
        };

        const suitableError =
          touched.suitableFor && errors.suitableFor
            ? t(errors.suitableFor)
            : '';

        return (
          <KeyboardAwareScrollView
            enableOnAndroid
            enableAutomaticScroll
            enableResetScrollToCoords={false}
            extraScrollHeight={20}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
              <StyledText
                variant="bold"
                size={18}
                containerStyle={styles.sectionTitle}>
                {t('CREATE_LISTING.QUESTIONS.PROPERTY_DETAILS')}
              </StyledText>

              <MeasureField
                label={t('CREATE_LISTING.QUESTIONS.DISTANCE_FROM_TOWN')}
                value={values.distanceFromTown}
                error={
                  touched.distanceFromTown && errors.distanceFromTown
                    ? t(errors.distanceFromTown)
                    : ''
                }
                onChangeText={handleDistanceChange}
                onBlur={handleBlur('distanceFromTown')}
                unitItems={DISTANCE_UNITS}
                unitValue={values.distanceUnit}
                onUnitChange={handleDistanceUnit}
              />

              <SwitchField
                label={t('CREATE_LISTING.QUESTIONS.OFF_ROAD')}
                caption={t('CREATE_LISTING.QUESTIONS.YES_NO')}
                value={values.offRoad}
                onPress={handleOffRoad}
              />

              <MeasureField
                label={t('CREATE_LISTING.QUESTIONS.WALKING_DISTANCE')}
                value={values.walkingDistance}
                error={
                  touched.walkingDistance && errors.walkingDistance
                    ? t(errors.walkingDistance)
                    : ''
                }
                onChangeText={handleWalkingChange}
                onBlur={handleBlur('walkingDistance')}
                unitItems={WALKING_DISTANCE_UNITS}
                unitValue={values.walkingUnit}
                onUnitChange={handleWalkingUnit}
              />

              <SwitchField
                label={t('CREATE_LISTING.QUESTIONS.PARKING')}
                caption={t('CREATE_LISTING.QUESTIONS.PUBLIC_PRIVATE')}
                value={values.privateParking}
                onPress={handleParking}
              />

              <SwitchField
                label={t('CREATE_LISTING.QUESTIONS.STAIR_CLIMB')}
                caption={t('CREATE_LISTING.QUESTIONS.YES_NO')}
                value={values.stairClimb}
                onPress={handleStairClimb}
              />

              <View style={styles.questionBlock}>
                <StyledText size={14} containerStyle={styles.questionLabel}>
                  {t('CREATE_LISTING.QUESTIONS.SUITABLE_FOR')}
                </StyledText>
                <MultiSelect
                  data={SUITABLE_FOR_OPTIONS}
                  labelField="title"
                  valueField="id"
                  value={values.suitableFor}
                  onChange={handleSuitableChange}
                  onFocus={handleSuitableFocus}
                  onBlur={onSuitableBlur}
                  searchPlaceholder=""
                  placeholder=""
                  inside
                  dropdownPosition="bottom"
                  maxHeight={180}
                  visibleSelectedItem={false}
                  style={[
                    styles.suitableField,
                    isSuitableFocused && styles.dropdownFieldFocused,
                    !!suitableError && styles.suitableFieldError,
                  ]}
                  placeholderStyle={styles.dropdownPlaceholder}
                  selectedTextStyle={styles.dropdownSelectedText}
                  itemTextStyle={styles.dropdownItemText}
                  inputSearchStyle={styles.suitableSearch}
                  containerStyle={styles.suitableList}
                  activeColor={COLORS.GREYSCALE_100}
                  fontFamily={FONTS.regular}
                />
                {!!suitableError && (
                  <StyledText
                    size={12}
                    color={COLORS.RED_ERROR}
                    containerStyle={styles.dropdownError}>
                    *{suitableError}
                  </StyledText>
                )}
              </View>

              <StepActions
                onPrevious={onPrevious}
                onNext={submitForm}
                isFirst={isFirst}
                isLast={isLast}
              />
            </View>
          </KeyboardAwareScrollView>
        );
      }}
    </Formik>
  );
};

export default React.memo(QuestionsStep);
