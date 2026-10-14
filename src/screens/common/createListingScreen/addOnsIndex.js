import React, {useCallback} from 'react';
import {Pressable, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {StyledText} from '../../../components/atoms';
import {CheckIcon} from '../../../components/svgs';
import {COLORS} from '../../../constants';
import styles from './styles';

const EMPTY_VALUES = {
  kitchenAccess: false,
  foodServices: false,
  vegetarian: false,
  nonVegetarian: false,
  mealPlan: false,
  petFriendly: false,
  instantBooking: false,
};

const AddOnCheck = ({
  label,
  hint,
  checked,
  onPress,
  containerStyle,
  inline = false,
}) => (
  <Pressable
    accessibilityRole="checkbox"
    accessibilityState={{checked}}
    onPress={onPress}
    style={[styles.addOnRow, containerStyle]}>
    <View style={[styles.addOnCheck, checked && styles.addOnCheckSelected]}>
      {checked ? <CheckIcon color={COLORS.LOGIN_PRIMARY} size={12} /> : null}
    </View>
    <View style={[styles.addOnCopy, inline && styles.addOnCopyInline]}>
      <StyledText variant="semiBold" size={15}>
        {label}
      </StyledText>
      {hint ? (
        <StyledText
          color={COLORS.GREYSCALE_500}
          size={12}
          containerStyle={styles.addOnHint}>
          {hint}
        </StyledText>
      ) : null}
    </View>
  </Pressable>
);

const AddOnsStep = ({
  onNext,
  onPrevious,
  isFirst,
  isLast,
  initialValues = EMPTY_VALUES,
  formRef,
}) => {
  const {t} = useTranslation();

  const handleSubmit = useCallback(
    values => {
      onNext?.(values);
    },
    [onNext],
  );

  return (
    <Formik
      innerRef={formRef}
      enableReinitialize
      initialValues={initialValues}
      onSubmit={handleSubmit}>
      {({values, setFieldValue, handleSubmit: submitForm}) => {
        const toggle = field => () => {
          setFieldValue(field, !values[field], false);
        };

        return (
          <KeyboardAwareScrollView
            enableOnAndroid
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
            <View style={styles.addOnSection}>
              <AddOnCheck
                label={t('CREATE_LISTING.ADD_ONS.KITCHEN_ACCESS')}
                checked={values.kitchenAccess}
                onPress={toggle('kitchenAccess')}
              />
            </View>

            <View style={styles.addOnSection}>
              <AddOnCheck
                label={t('CREATE_LISTING.ADD_ONS.FOOD_SERVICES')}
                checked={values.foodServices}
                onPress={toggle('foodServices')}
              />
              {values.foodServices ? (
                <View style={styles.addOnNested}>
                  <View style={styles.addOnNestedRow}>
                    <AddOnCheck
                      inline
                      label={t('CREATE_LISTING.ADD_ONS.VEGETARIAN')}
                      checked={values.vegetarian}
                      onPress={toggle('vegetarian')}
                      containerStyle={styles.addOnNestedItem}
                    />
                    <AddOnCheck
                      inline
                      label={t('CREATE_LISTING.ADD_ONS.NON_VEGETARIAN')}
                      checked={values.nonVegetarian}
                      onPress={toggle('nonVegetarian')}
                    />
                  </View>
                  <AddOnCheck
                    label={t('CREATE_LISTING.ADD_ONS.MEAL_PLAN')}
                    checked={values.mealPlan}
                    onPress={toggle('mealPlan')}
                  />
                </View>
              ) : null}
            </View>

            <View style={styles.addOnSection}>
              <AddOnCheck
                label={t('CREATE_LISTING.ADD_ONS.PET_FRIENDLY')}
                hint={t('CREATE_LISTING.ADD_ONS.PET_FRIENDLY_HINT')}
                checked={values.petFriendly}
                onPress={toggle('petFriendly')}
              />
            </View>

            <AddOnCheck
              label={t('CREATE_LISTING.ADD_ONS.INSTANT_BOOKING')}
              checked={values.instantBooking}
              onPress={toggle('instantBooking')}
              containerStyle={styles.addOnPlain}
            />

            <View style={styles.addOnDivider} />
            <View style={styles.addOnFooter}>
              <TouchableOpacity
                accessibilityRole="button"
                disabled={isFirst}
                onPress={onPrevious}
                style={[
                  styles.addOnPrevious,
                  isFirst && styles.previousButtonDisabled,
                ]}>
                <StyledText
                  color={COLORS.LOGIN_PRIMARY}
                  variant="semiBold"
                  size={15}>
                  {t('CREATE_LISTING.PREVIOUS')}
                </StyledText>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                disabled={isLast}
                onPress={submitForm}
                style={[
                  styles.addOnNext,
                  isLast && styles.nextButtonDisabled,
                ]}>
                <StyledText color={COLORS.WHITE} variant="semiBold" size={15}>
                  {t('CREATE_LISTING.NEXT')}
                </StyledText>
              </TouchableOpacity>
            </View>
            </View>
          </KeyboardAwareScrollView>
        );
      }}
    </Formik>
  );
};

export default React.memo(AddOnsStep);
