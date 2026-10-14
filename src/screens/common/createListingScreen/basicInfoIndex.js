import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Pressable, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {AnimatedSwitch, Input, StyledText} from '../../../components/atoms';
import {SelectLocationModal} from '../../../components/modals';
import {LocationPinIcon, TrashIcon} from '../../../components/svgs';
import {COLORS, FORM_SCHEMA} from '../../../constants';
import {
  makeGetCancellationPoliciesRequest,
  makeGetStateCitiesRequest,
  makeGetStatesRequest,
} from '../../../api/common';
import ListingSelect from './listingSelect';
import StepActions from './stepActions';
import {
  PROPERTY_TYPES,
  createEmptyRentalOption,
  isEntireHomeType,
} from './options';
import styles from './styles';

const basicInfoForm = FORM_SCHEMA.CREATE_LISTING;

const EMPTY_VALUES = {
  propertyTitle: '',
  description: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  propertyType: '',
  latitude: '',
  longitude: '',
  guests: '1',
  bedrooms: '1',
  beds: '1',
  bathrooms: '1',
  entireDescription: '',
  rentalOptions: [],
  houseRules: '',
  cancellationPolicy: '',
};

const NO_POLICY_ID = 'none';

const formatCancellationOption = policy => ({
  id: policy.id,
  title: policy.description
    ? `${policy.name} – ${policy.description}`
    : policy.name,
});

const ApplyDefaultCancellation = ({policies, value, setFieldValue}) => {
  useEffect(() => {
    if (value || !policies.length) {
      return;
    }

    const defaultPolicy =
      policies.find(policy => policy.isDefault) || policies[0];

    if (defaultPolicy?.id) {
      setFieldValue('cancellationPolicy', defaultPolicy.id, false);
    }
  }, [policies, setFieldValue, value]);

  return null;
};

const fieldBorder = COLORS.LOGIN_INPUT_BORDER;
const fieldFocus = COLORS.LOGIN_PRIMARY;

const keepDigits = value => value.replace(/[^0-9]/g, '');

const keepAmount = value => {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const [whole, ...fraction] = cleaned.split('.');

  if (!fraction.length) {
    return whole;
  }

  return `${whole}.${fraction.join('').slice(0, 2)}`;
};

const optionError = (errors, touched, index, field) => {
  const fieldError = errors?.rentalOptions?.[index]?.[field];
  const fieldTouched = touched?.rentalOptions?.[index]?.[field];

  return fieldTouched && fieldError ? fieldError : undefined;
};

const withCurrentOption = (options, title) => {
  if (!title || options.some(option => option.title === title)) {
    return options;
  }

  return [...options, {id: title, title}];
};

const locationList = response => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.states)) {
    return response.states;
  }

  if (Array.isArray(response?.cities)) {
    return response.cities;
  }

  if (Array.isArray(response?.data?.states)) {
    return response.data.states;
  }

  if (Array.isArray(response?.data?.cities)) {
    return response.data.cities;
  }

  return [];
};

const toLocationOptions = response =>
  locationList(response)
    .map(item => {
      if (typeof item === 'string') {
        return {id: item, title: item};
      }

      const title =
        item?.name ||
        item?.title ||
        item?.stateName ||
        item?.cityName ||
        item?.state ||
        item?.city ||
        '';
      const id = item?.id || item?._id || item?.stateId || item?.cityId || title;

      if (!id || !title) {
        return null;
      }

      return {id: String(id), title: String(title)};
    })
    .filter(Boolean);

const StateCities = ({stateTitle, states, onCities}) => {
  useEffect(() => {
    const stateId = states.find(
      state =>
        state.title.toLowerCase() === String(stateTitle || '').trim().toLowerCase(),
    )?.id;

    if (!stateId) {
      onCities([]);
      return undefined;
    }

    let isMounted = true;
    onCities([]);

    makeGetStateCitiesRequest(stateId)
      .then(response => {
        if (isMounted) {
          onCities(toLocationOptions(response));
        }
      })
      .catch(() => {
        if (isMounted) {
          onCities([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [onCities, stateTitle, states]);

  return null;
};

const BasicInfoStep = ({
  onNext,
  onPrevious,
  isFirst,
  isLast,
  initialValues = EMPTY_VALUES,
  formRef,
}) => {
  const {t} = useTranslation();
  const [cancellationPolicies, setCancellationPolicies] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);

  const handleCities = useCallback(nextCities => {
    setCities(nextCities);
  }, []);

  const handleOpenLocationModal = useCallback(() => {
    setIsLocationModalVisible(true);
  }, []);

  const handleCloseLocationModal = useCallback(() => {
    setIsLocationModalVisible(false);
  }, []);

  const cancellationOptions = useMemo(
    () => [
      {id: NO_POLICY_ID, title: t('CREATE_LISTING.NO_POLICY')},
      ...cancellationPolicies
        .filter(policy => policy.isActive !== false)
        .map(formatCancellationOption),
    ],
    [cancellationPolicies, t],
  );

  const handleSubmit = useCallback(
    values => {
      onNext?.(values);
    },
    [onNext],
  );

  useEffect(() => {
    let isMounted = true;

    makeGetCancellationPoliciesRequest()
      .then(response => {
        const policies = Array.isArray(response)
          ? response
          : response?.data || [];

        if (isMounted) {
          setCancellationPolicies(policies);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    makeGetStatesRequest()
      .then(response => {
        if (isMounted) {
          setStates(toLocationOptions(response));
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const formInitialValues = useMemo(
    () => ({
      ...EMPTY_VALUES,
      ...(initialValues || {}),
      rentalOptions: Array.isArray(initialValues?.rentalOptions)
        ? initialValues.rentalOptions
        : [],
    }),
    [initialValues],
  );

  return (
    <Formik
      innerRef={formRef}
      validateOnChange
      enableReinitialize
      initialValues={formInitialValues}
      validationSchema={basicInfoForm.schema}
      onSubmit={handleSubmit}>
      {({
        handleBlur,
        handleChange,
        handleSubmit: submitForm,
        setFieldValue,
        setFieldTouched,
        setFieldError,
        values,
        errors,
        touched,
      }) => {
        const stateOptions = withCurrentOption(states, values.state);
        const cityOptions = withCurrentOption(cities, values.city);
        const propertyTypeOptions = withCurrentOption(
          PROPERTY_TYPES,
          values.propertyType,
        );

        const handleDigitsChange = field => text => {
          setFieldValue(field, keepDigits(text), true);
        };

        const touchAfterSelect = field => {
          setTimeout(() => {
            setFieldTouched(field, true, true);
          }, 0);
        };

        const handleStateBlur = () => {
          touchAfterSelect('state');
        };

        const handleStateSelect = item => {
          setFieldValue('state', item.title || '', true);
          setFieldValue('city', '', false);
          setFieldTouched('city', false, false);
          setFieldError('city', undefined);
        };

        const handleCityBlocked = () => {
          setFieldTouched('city', true, false);
          setFieldError('city', 'CREATE_LISTING.ERRORS.SELECT_STATE_FIRST');
        };

        const handleCityBlur = () => {
          touchAfterSelect('city');
        };

        const handleCitySelect = item => {
          setFieldValue('city', item.title || '', true);
        };

        const handlePropertyTypeBlur = () => {
          touchAfterSelect('propertyType');
        };

        const handlePropertyTypeSelect = item => {
          const nextType = item.title || '';
          setFieldValue('propertyType', nextType, true);

          if (!isEntireHomeType(nextType)) {
            setFieldValue('rentalOptions', [], false);
            setFieldValue('entireDescription', '', false);
          }
        };

        const handleAddRentalOption = () => {
          setFieldValue(
            'rentalOptions',
            [...(values.rentalOptions || []), createEmptyRentalOption()],
            false,
          );
        };

        const handleRemoveRentalOption = index => () => {
          const nextOptions = (values.rentalOptions || []).filter(
            (_, optionIndex) => optionIndex !== index,
          );
          setFieldValue('rentalOptions', nextOptions, true);
        };

        const handleOptionChange = (index, field) => text => {
          setFieldValue(`rentalOptions[${index}].${field}`, text, true);
        };

        const handleOptionDigits = (index, field) => text => {
          setFieldValue(
            `rentalOptions[${index}].${field}`,
            keepDigits(text),
            true,
          );
        };

        const handleOptionAmount = (index, field) => text => {
          setFieldValue(
            `rentalOptions[${index}].${field}`,
            keepAmount(text),
            true,
          );
        };

        const handleOptionSwitch = (index, field) => () => {
          const current = Boolean(values.rentalOptions?.[index]?.[field]);
          setFieldValue(`rentalOptions[${index}].${field}`, !current, false);
        };

        const handleCancellationBlur = () => {
          touchAfterSelect('cancellationPolicy');
        };

        const handleCancellationSelect = item => {
          setFieldValue('cancellationPolicy', item.id || '', true);
        };

        const handleConfirmLocation = location => {
          if (location?.addressLine1) {
            setFieldValue('addressLine1', location.addressLine1, true);
          }
          if (location?.addressLine2 !== undefined) {
            setFieldValue('addressLine2', location.addressLine2 || '', false);
          }
          if (location?.state) {
            setFieldValue('state', location.state, true);
          }
          if (location?.city) {
            setFieldValue('city', location.city, true);
          }
          if (location?.postalCode) {
            setFieldValue('postalCode', location.postalCode, true);
          }
          setFieldValue('latitude', String(location.latitude), false);
          setFieldValue('longitude', String(location.longitude), false);
          setIsLocationModalVisible(false);
        };

        const isEntireHome = isEntireHomeType(values.propertyType);
        const rentalOptions = values.rentalOptions || [];

        return (
          <>
          <StateCities
            stateTitle={values.state}
            states={states}
            onCities={handleCities}
          />
          <ApplyDefaultCancellation
            policies={cancellationPolicies}
            value={values.cancellationPolicy}
            setFieldValue={setFieldValue}
          />
          <KeyboardAwareScrollView
            enableOnAndroid
            enableAutomaticScroll
            enableResetScrollToCoords={false}
            extraScrollHeight={20}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
              <Input
                label={t('CREATE_LISTING.FIELDS.PROPERTY_TITLE')}
                required
                value={values.propertyTitle}
                onChangeText={handleChange('propertyTitle')}
                onBlur={handleBlur('propertyTitle')}
                error={touched.propertyTitle && errors.propertyTitle}
                borderColor={fieldBorder}
                focusedBorderColor={fieldFocus}
              />
              <Input
                label={t('CREATE_LISTING.FIELDS.DESCRIPTION')}
                required
                value={values.description}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                multiline
                maxLength={2000}
                error={touched.description && errors.description}
                containerStyles={styles.descriptionField}
                inputStyle={styles.descriptionInput}
                borderColor={fieldBorder}
                focusedBorderColor={fieldFocus}
              />
              <StyledText
                size={12}
                color={COLORS.GREYSCALE_500}
                containerStyle={styles.descriptionCount}>
                {t('CREATE_LISTING.DESCRIPTION_COUNT', {
                  count: values.description.length,
                })}
              </StyledText>
              <Input
                label={t('CREATE_LISTING.FIELDS.ADDRESS_LINE_1')}
                required
                value={values.addressLine1}
                onChangeText={handleChange('addressLine1')}
                onBlur={handleBlur('addressLine1')}
                error={touched.addressLine1 && errors.addressLine1}
                borderColor={fieldBorder}
                focusedBorderColor={fieldFocus}
              />
              <Input
                label={t('CREATE_LISTING.FIELDS.ADDRESS_LINE_2')}
                value={values.addressLine2}
                onChangeText={handleChange('addressLine2')}
                onBlur={handleBlur('addressLine2')}
                borderColor={fieldBorder}
                focusedBorderColor={fieldFocus}
              />
              <ListingSelect
                label={t('CREATE_LISTING.FIELDS.STATE')}
                required
                placeholder={t('CREATE_LISTING.FIELDS.SELECT_STATE')}
                items={stateOptions}
                value={values.state}
                error={touched.state && errors.state}
                onSelectItem={handleStateSelect}
                onBlur={handleStateBlur}
                containerStyle={styles.stateDropdown}
              />
              <View style={styles.locationField}>
                <ListingSelect
                  label={t('CREATE_LISTING.FIELDS.CITY')}
                  required
                  placeholder={t('CREATE_LISTING.FIELDS.SELECT_CITY')}
                  items={cityOptions}
                  disabled={!values.state}
                  value={values.city}
                  error={touched.city && errors.city}
                  onSelectItem={handleCitySelect}
                  onBlur={handleCityBlur}
                  containerStyle={styles.cityDropdown}
                />
                {values.state ? null : (
                  <Pressable
                    accessibilityRole="button"
                    onPress={handleCityBlocked}
                    style={styles.locationBlocker}
                  />
                )}
              </View>
              <Input
                label={t('CREATE_LISTING.FIELDS.POSTAL_CODE')}
                required
                value={values.postalCode}
                onChangeText={handleDigitsChange('postalCode')}
                onBlur={handleBlur('postalCode')}
                keyboardType="number-pad"
                maxLength={6}
                error={touched.postalCode && errors.postalCode}
                borderColor={fieldBorder}
                focusedBorderColor={fieldFocus}
              />
              <ListingSelect
                label={t('CREATE_LISTING.FIELDS.PROPERTY_TYPE')}
                required
                items={propertyTypeOptions}
                value={values.propertyType}
                error={touched.propertyType && errors.propertyType}
                onSelectItem={handlePropertyTypeSelect}
                onBlur={handlePropertyTypeBlur}
                containerStyle={styles.propertyTypeDropdown}
              />
              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.8}
                onPress={handleOpenLocationModal}
                style={styles.mapButton}>
                <LocationPinIcon color={COLORS.LOGIN_PRIMARY} size={16} />
                <StyledText
                  variant="semiBold"
                  size={14}
                  color={COLORS.LOGIN_PRIMARY}>
                  {t('CREATE_LISTING.SELECT_ON_MAP')}
                </StyledText>
              </TouchableOpacity>
              {values.latitude && values.longitude ? (
                <StyledText
                  size={12}
                  color={COLORS.GREYSCALE_500}
                  containerStyle={styles.mapCoordinates}>
                  {t('CREATE_LISTING.LOCATION.COORDINATES', {
                    latitude: values.latitude,
                    longitude: values.longitude,
                  })}
                </StyledText>
              ) : null}
              {isEntireHome ? (
                <View style={styles.rentalSection}>
                  <StyledText
                    variant="semiBold"
                    size={16}
                    containerStyle={styles.rentalSectionTitle}>
                    {t('CREATE_LISTING.FIELDS.BOOKABLE_TITLE')}
                  </StyledText>
                  <StyledText
                    size={13}
                    color={COLORS.GREYSCALE_500}
                    containerStyle={styles.rentalSectionSubtitle}>
                    {t('CREATE_LISTING.FIELDS.BOOKABLE_SUBTITLE')}
                  </StyledText>

                  <View style={styles.entireCard}>
                    <StyledText
                      variant="semiBold"
                      size={14}
                      containerStyle={styles.entireCardLabel}>
                      {t('CREATE_LISTING.FIELDS.ENTIRE_HOMESTAY')}
                    </StyledText>
                    <View style={styles.rentalInfoBanner}>
                      <View style={styles.rentalInfoIcon}>
                        <Text style={styles.rentalInfoIconText}>i</Text>
                      </View>
                      <StyledText
                        size={12}
                        color={COLORS.GREYSCALE_700}
                        containerStyle={styles.rentalInfoText}>
                        {t('CREATE_LISTING.FIELDS.ENTIRE_INFO')}
                      </StyledText>
                    </View>
                    <View style={styles.fieldRow}>
                      <Input
                        label={t('CREATE_LISTING.FIELDS.TOTAL_BEDROOMS')}
                        required
                        value={values.bedrooms}
                        onChangeText={handleDigitsChange('bedrooms')}
                        onBlur={handleBlur('bedrooms')}
                        keyboardType="number-pad"
                        error={touched.bedrooms && errors.bedrooms}
                        containerStyles={styles.halfField}
                        borderColor={fieldBorder}
                        focusedBorderColor={fieldFocus}
                      />
                      <Input
                        label={t('CREATE_LISTING.FIELDS.TOTAL_BEDS')}
                        required
                        value={values.beds}
                        onChangeText={handleDigitsChange('beds')}
                        onBlur={handleBlur('beds')}
                        keyboardType="number-pad"
                        error={touched.beds && errors.beds}
                        containerStyles={styles.halfField}
                        borderColor={fieldBorder}
                        focusedBorderColor={fieldFocus}
                      />
                    </View>
                    <StyledText
                      size={11}
                      color={COLORS.GREYSCALE_500}
                      containerStyle={styles.rentalFieldHint}>
                      {t('CREATE_LISTING.FIELDS.TOTAL_BEDROOMS_HINT')}
                    </StyledText>
                    <View style={styles.fieldRow}>
                      <Input
                        label={t('CREATE_LISTING.FIELDS.MAXIMUM_GUESTS')}
                        required
                        value={values.guests}
                        onChangeText={handleDigitsChange('guests')}
                        onBlur={handleBlur('guests')}
                        keyboardType="number-pad"
                        error={touched.guests && errors.guests}
                        containerStyles={styles.halfField}
                        borderColor={fieldBorder}
                        focusedBorderColor={fieldFocus}
                      />
                      <Input
                        label={t('CREATE_LISTING.FIELDS.TOTAL_BATHROOMS')}
                        required
                        value={values.bathrooms}
                        onChangeText={handleDigitsChange('bathrooms')}
                        onBlur={handleBlur('bathrooms')}
                        keyboardType="number-pad"
                        error={touched.bathrooms && errors.bathrooms}
                        containerStyles={styles.halfField}
                        borderColor={fieldBorder}
                        focusedBorderColor={fieldFocus}
                      />
                    </View>
                    <Input
                      label={t('CREATE_LISTING.FIELDS.DESCRIPTION_OPTIONAL')}
                      value={values.entireDescription}
                      onChangeText={handleChange('entireDescription')}
                      onBlur={handleBlur('entireDescription')}
                      multiline
                      maxLength={500}
                      error={
                        touched.entireDescription && errors.entireDescription
                      }
                      containerStyles={styles.descriptionField}
                      inputStyle={styles.descriptionInput}
                      borderColor={fieldBorder}
                      focusedBorderColor={fieldFocus}
                    />
                    <StyledText
                      size={12}
                      color={COLORS.GREYSCALE_500}
                      containerStyle={styles.rentalCharCount}>
                      {t('CREATE_LISTING.FIELDS.CHAR_COUNT', {
                        count: (values.entireDescription || '').length,
                      })}
                    </StyledText>
                  </View>

                  {rentalOptions.map((option, index) => (
                    <View key={option.id || `option-${index}`} style={styles.optionCard}>
                      <View style={styles.optionHeader}>
                        <StyledText
                          variant="semiBold"
                          size={14}
                          numberOfLines={1}
                          containerStyle={styles.optionHeaderTitle}>
                          {t('CREATE_LISTING.FIELDS.ADDITIONAL_OPTION', {
                            count: index + 1,
                            name: option.name?.trim()
                              ? `: ${option.name.trim()}`
                              : '',
                          })}
                        </StyledText>
                        <TouchableOpacity
                          accessibilityRole="button"
                          hitSlop={8}
                          onPress={handleRemoveRentalOption(index)}>
                          <TrashIcon color={COLORS.INVOICE_DELETE} size={18} />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.optionDivider} />
                      <Input
                        label={t('CREATE_LISTING.FIELDS.OPTION_NAME')}
                        required
                        value={option.name}
                        onChangeText={handleOptionChange(index, 'name')}
                        onBlur={handleBlur(`rentalOptions[${index}].name`)}
                        error={optionError(errors, touched, index, 'name')}
                        borderColor={fieldBorder}
                        focusedBorderColor={fieldFocus}
                      />
                      <StyledText
                        size={12}
                        color={COLORS.GREYSCALE_500}
                        containerStyle={styles.rentalFieldHint}>
                        {t('CREATE_LISTING.FIELDS.OPTION_NAME_HINT')}
                      </StyledText>
                      <Input
                        label={t('CREATE_LISTING.FIELDS.BEDROOMS')}
                        required
                        value={option.bedrooms}
                        onChangeText={handleOptionDigits(index, 'bedrooms')}
                        onBlur={handleBlur(`rentalOptions[${index}].bedrooms`)}
                        keyboardType="number-pad"
                        error={optionError(errors, touched, index, 'bedrooms')}
                        borderColor={fieldBorder}
                        focusedBorderColor={fieldFocus}
                      />
                      <StyledText
                        size={12}
                        color={COLORS.GREYSCALE_500}
                        containerStyle={styles.rentalFieldHint}>
                        {t('CREATE_LISTING.FIELDS.BEDROOMS_HINT')}
                      </StyledText>
                      <Input
                        label={t('CREATE_LISTING.FIELDS.BEDS_PER_UNIT')}
                        required
                        value={option.beds}
                        onChangeText={handleOptionDigits(index, 'beds')}
                        onBlur={handleBlur(`rentalOptions[${index}].beds`)}
                        keyboardType="number-pad"
                        error={optionError(errors, touched, index, 'beds')}
                        borderColor={fieldBorder}
                        focusedBorderColor={fieldFocus}
                      />
                      <Input
                        label={t('CREATE_LISTING.FIELDS.PRICE_PER_NIGHT')}
                        required
                        value={option.pricePerNight}
                        onChangeText={handleOptionAmount(
                          index,
                          'pricePerNight',
                        )}
                        onBlur={handleBlur(
                          `rentalOptions[${index}].pricePerNight`,
                        )}
                        keyboardType="decimal-pad"
                        error={optionError(
                          errors,
                          touched,
                          index,
                          'pricePerNight',
                        )}
                        borderColor={fieldBorder}
                        focusedBorderColor={fieldFocus}
                      />
                      <Input
                        label={t('CREATE_LISTING.FIELDS.OFF_SEASON_PRICE')}
                        value={option.offSeasonPrice}
                        onChangeText={handleOptionAmount(
                          index,
                          'offSeasonPrice',
                        )}
                        onBlur={handleBlur(
                          `rentalOptions[${index}].offSeasonPrice`,
                        )}
                        keyboardType="decimal-pad"
                        error={optionError(
                          errors,
                          touched,
                          index,
                          'offSeasonPrice',
                        )}
                        borderColor={fieldBorder}
                        focusedBorderColor={fieldFocus}
                      />
                      <StyledText
                        size={12}
                        color={COLORS.GREYSCALE_500}
                        containerStyle={styles.rentalFieldHint}>
                        {t('CREATE_LISTING.FIELDS.OFF_SEASON_PRICE_HINT')}
                      </StyledText>
                      <Input
                        label={t('CREATE_LISTING.FIELDS.NUMBER_OF_UNITS')}
                        required
                        value={option.units}
                        onChangeText={handleOptionDigits(index, 'units')}
                        onBlur={handleBlur(`rentalOptions[${index}].units`)}
                        keyboardType="number-pad"
                        error={optionError(errors, touched, index, 'units')}
                        borderColor={fieldBorder}
                        focusedBorderColor={fieldFocus}
                      />
                      <StyledText
                        size={12}
                        color={COLORS.GREYSCALE_500}
                        containerStyle={styles.rentalFieldHint}>
                        {t('CREATE_LISTING.FIELDS.NUMBER_OF_UNITS_HINT')}
                      </StyledText>
                      <Input
                        label={t('CREATE_LISTING.FIELDS.MAX_GUESTS_PER_UNIT')}
                        required
                        value={option.maxGuests}
                        onChangeText={handleOptionDigits(index, 'maxGuests')}
                        onBlur={handleBlur(
                          `rentalOptions[${index}].maxGuests`,
                        )}
                        keyboardType="number-pad"
                        error={optionError(
                          errors,
                          touched,
                          index,
                          'maxGuests',
                        )}
                        borderColor={fieldBorder}
                        focusedBorderColor={fieldFocus}
                      />
                      <Input
                        label={t('CREATE_LISTING.FIELDS.BATHROOMS_PER_UNIT')}
                        required
                        value={option.bathrooms}
                        onChangeText={handleOptionDigits(index, 'bathrooms')}
                        onBlur={handleBlur(
                          `rentalOptions[${index}].bathrooms`,
                        )}
                        keyboardType="number-pad"
                        error={optionError(
                          errors,
                          touched,
                          index,
                          'bathrooms',
                        )}
                        borderColor={fieldBorder}
                        focusedBorderColor={fieldFocus}
                      />
                      <Input
                        label={t('CREATE_LISTING.FIELDS.DESCRIPTION_OPTIONAL')}
                        value={option.description}
                        onChangeText={handleOptionChange(index, 'description')}
                        onBlur={handleBlur(
                          `rentalOptions[${index}].description`,
                        )}
                        multiline
                        maxLength={500}
                        error={optionError(
                          errors,
                          touched,
                          index,
                          'description',
                        )}
                        containerStyles={styles.descriptionField}
                        inputStyle={styles.descriptionInput}
                        borderColor={fieldBorder}
                        focusedBorderColor={fieldFocus}
                      />
                      <StyledText
                        size={12}
                        color={COLORS.GREYSCALE_500}
                        containerStyle={styles.rentalCharCount}>
                        {t('CREATE_LISTING.FIELDS.CHAR_COUNT', {
                          count: (option.description || '').length,
                        })}
                      </StyledText>
                      <View style={styles.optionSwitches}>
                        <View style={styles.optionSwitchRow}>
                          <AnimatedSwitch
                            accessibilityLabel={t(
                              'CREATE_LISTING.FIELDS.ATTACHED_BATHROOM',
                            )}
                            value={Boolean(option.attachedBathroom)}
                            onPress={handleOptionSwitch(
                              index,
                              'attachedBathroom',
                            )}
                          />
                          <StyledText
                            size={13}
                            containerStyle={styles.optionSwitchLabel}>
                            {t('CREATE_LISTING.FIELDS.ATTACHED_BATHROOM')}
                          </StyledText>
                        </View>
                        <View style={styles.optionSwitchRow}>
                          <AnimatedSwitch
                            accessibilityLabel={t(
                              'CREATE_LISTING.FIELDS.BALCONY',
                            )}
                            value={Boolean(option.hasBalcony)}
                            onPress={handleOptionSwitch(index, 'hasBalcony')}
                          />
                          <StyledText
                            size={13}
                            containerStyle={styles.optionSwitchLabel}>
                            {t('CREATE_LISTING.FIELDS.BALCONY')}
                          </StyledText>
                        </View>
                      </View>
                    </View>
                  ))}

                  <TouchableOpacity
                    accessibilityRole="button"
                    activeOpacity={0.85}
                    onPress={handleAddRentalOption}
                    style={styles.addOptionButton}>
                    <StyledText
                      variant="semiBold"
                      size={14}
                      color={COLORS.WHITE}>
                      {t('CREATE_LISTING.FIELDS.ADD_RENTAL_OPTION')}
                    </StyledText>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <View style={styles.fieldRow}>
                    <Input
                      label={t('CREATE_LISTING.FIELDS.GUESTS')}
                      required
                      value={values.guests}
                      onChangeText={handleDigitsChange('guests')}
                      onBlur={handleBlur('guests')}
                      keyboardType="number-pad"
                      error={touched.guests && errors.guests}
                      containerStyles={styles.halfField}
                      borderColor={fieldBorder}
                      focusedBorderColor={fieldFocus}
                    />
                    <Input
                      label={t('CREATE_LISTING.FIELDS.BEDROOMS')}
                      required
                      value={values.bedrooms}
                      onChangeText={handleDigitsChange('bedrooms')}
                      onBlur={handleBlur('bedrooms')}
                      keyboardType="number-pad"
                      error={touched.bedrooms && errors.bedrooms}
                      containerStyles={styles.halfField}
                      borderColor={fieldBorder}
                      focusedBorderColor={fieldFocus}
                    />
                  </View>
                  <View style={styles.fieldRow}>
                    <Input
                      label={t('CREATE_LISTING.FIELDS.BEDS')}
                      required
                      value={values.beds}
                      onChangeText={handleDigitsChange('beds')}
                      onBlur={handleBlur('beds')}
                      keyboardType="number-pad"
                      error={touched.beds && errors.beds}
                      containerStyles={styles.halfField}
                      borderColor={fieldBorder}
                      focusedBorderColor={fieldFocus}
                    />
                    <Input
                      label={t('CREATE_LISTING.FIELDS.BATHROOMS')}
                      required
                      value={values.bathrooms}
                      onChangeText={handleDigitsChange('bathrooms')}
                      onBlur={handleBlur('bathrooms')}
                      keyboardType="number-pad"
                      error={touched.bathrooms && errors.bathrooms}
                      containerStyles={styles.halfField}
                      borderColor={fieldBorder}
                      focusedBorderColor={fieldFocus}
                    />
                  </View>
                </>
              )}
              <Input
                label={t('CREATE_LISTING.FIELDS.HOUSE_RULES')}
                value={values.houseRules}
                onChangeText={handleChange('houseRules')}
                onBlur={handleBlur('houseRules')}
                multiline
                inputStyle={styles.houseRulesInput}
                borderColor={fieldBorder}
                focusedBorderColor={fieldFocus}
              />
              <ListingSelect
                label={t('CREATE_LISTING.FIELDS.CANCELLATION_POLICY')}
                items={cancellationOptions}
                valueField="id"
                value={values.cancellationPolicy}
                onSelectItem={handleCancellationSelect}
                onBlur={handleCancellationBlur}
                containerStyle={styles.cancellationDropdown}
              />
              <StyledText
                size={12}
                color={COLORS.GREYSCALE_500}
                containerStyle={styles.cancellationHint}>
                {t('CREATE_LISTING.CANCELLATION_HINT')}
              </StyledText>
              <StepActions
                onPrevious={onPrevious}
                onNext={submitForm}
                isFirst={isFirst}
                isLast={isLast}
              />
            </View>
          </KeyboardAwareScrollView>
          <SelectLocationModal
            isVisible={isLocationModalVisible}
            latitude={values.latitude}
            longitude={values.longitude}
            onClose={handleCloseLocationModal}
            onConfirm={handleConfirmLocation}
          />
          </>
        );
      }}
    </Formik>
  );
};

export default React.memo(BasicInfoStep);
