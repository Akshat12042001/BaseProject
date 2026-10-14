import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, ScrollView, TouchableOpacity, View} from 'react-native';
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {ScreenContainer, StyledText} from '../../../components/atoms';
import {CheckIcon} from '../../../components/svgs';
import {COLORS} from '../../../constants';
import {
  makeCreateHomestayRequest,
  makeDeleteHomestayImageRequest,
  makeGetPropertyDetailRequest,
  makeUpdateHomestayRequest,
  makeUploadHomestayImagesRequest,
} from '../../../api/common';
import {errorToast, successToast} from '../../../utils/alerts';
import {getPropertyDetailData} from '../../../utils/propertyDetail';
import {
  buildListingCreatePayload,
  buildListingUpdatePayload,
  formatListingFormData,
} from '../../../utils/listingForm';
import BasicInfoStep from './basicInfoIndex';
import QuestionsStep from './questionsIndex';
import PricingStep from './pricingIndex';
import AmenitiesStep from './amenitiesIndex';
import AddOnsStep from './addOnsIndex';
import PhotosStep from './photosIndex';
import styles, {STEP_WIDTH} from './styles';
import {ScreenHeader} from '../../../components/molecules';

const LISTING_STEPS = [
  {
    key: 'basicInfo',
    labelKey: 'CREATE_LISTING.STEPS.BASIC_INFO',
    Component: BasicInfoStep,
  },
  {
    key: 'questions',
    labelKey: 'CREATE_LISTING.STEPS.QUESTIONS',
    Component: QuestionsStep,
  },
  {
    key: 'pricing',
    labelKey: 'CREATE_LISTING.STEPS.PRICING',
    Component: PricingStep,
  },
  {
    key: 'amenities',
    labelKey: 'CREATE_LISTING.STEPS.AMENITIES',
    Component: AmenitiesStep,
  },
  {
    key: 'addOns',
    labelKey: 'CREATE_LISTING.STEPS.ADD_ONS',
    Component: AddOnsStep,
  },
  {
    key: 'photos',
    labelKey: 'CREATE_LISTING.STEPS.PHOTOS',
    Component: PhotosStep,
  },
];

const EMPTY_DRAFT = {
  basicInfo: null,
  questions: null,
  pricing: null,
  amenities: null,
  addOns: null,
  photos: null,
};

const StepIndicator = React.memo(
  ({index, label, isActive, isComplete, isReachable, isFirst, isLast, onPress}) => {
    const handlePress = useCallback(() => {
      if (!isReachable) {
        return;
      }

      onPress(index);
    }, [index, isReachable, onPress]);

    return (
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{disabled: !isReachable}}
        disabled={!isReachable}
        onPress={handlePress}
        style={styles.stepPressable}>
        <View style={styles.stepCircleWrap}>
          {isFirst ? null : (
            <View style={[styles.stepConnector, styles.stepConnectorLeft]} />
          )}
          {isLast ? null : (
            <View style={[styles.stepConnector, styles.stepConnectorRight]} />
          )}
          <View
            style={[
              styles.stepCircle,
              (isActive || isComplete) && styles.stepCircleActive,
            ]}>
            {isComplete ? (
              <CheckIcon color={COLORS.WHITE} size={14} />
            ) : (
              <StyledText
                variant="semiBold"
                size={13}
                color={isActive ? COLORS.WHITE : COLORS.GREYSCALE_900}>
                {index + 1}
              </StyledText>
            )}
          </View>
        </View>
        <StyledText
          size={11}
          variant={isActive || isComplete ? 'semiBold' : 'regular'}
          color={
            isActive || isComplete ? COLORS.GREYSCALE_900 : COLORS.GREYSCALE_500
          }
          containerStyle={styles.stepLabel}
          textAlign="center"
          numberOfLines={1}>
          {label}
        </StyledText>
      </TouchableOpacity>
    );
  },
);

const FORM_REFS = [
  {key: 'basicInfo', index: 0},
  {key: 'questions', index: 1},
  {key: 'pricing', index: 2},
  {key: 'amenities', index: 3},
  {key: 'addOns', index: 4},
];

const touchAllFields = values =>
  Object.keys(values || {}).reduce((touched, key) => {
    touched[key] = true;
    return touched;
  }, {});

const hasFieldErrors = errors => Boolean(errors && Object.keys(errors).length);

const CreateListingScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const listingId = route.params?.listingId;
  const stepperRef = useRef(null);
  const basicInfoRef = useRef(null);
  const questionsRef = useRef(null);
  const pricingRef = useRef(null);
  const amenitiesRef = useRef(null);
  const addOnsRef = useRef(null);
  const isSavingRef = useRef(false);
  const listingRequestRef = useRef(0);
  const [activeStep, setActiveStep] = useState(0);
  const [reachedStep, setReachedStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [listing, setListing] = useState(null);
  const [isListingLoading, setIsListingLoading] = useState(false);
  const [isListingError, setIsListingError] = useState(false);
  const [draftForm, setDraftForm] = useState(EMPTY_DRAFT);
  const formRefs = useMemo(
    () => ({
      basicInfo: basicInfoRef,
      questions: questionsRef,
      pricing: pricingRef,
      amenities: amenitiesRef,
      addOns: addOnsRef,
    }),
    [],
  );
  const loadListing = useCallback(() => {
    if (!listingId) {
      return;
    }

    const requestId = listingRequestRef.current + 1;
    listingRequestRef.current = requestId;
    setListing(null);
    setIsListingLoading(true);
    setIsListingError(false);

    makeGetPropertyDetailRequest(listingId)
      .then(response => {
        if (listingRequestRef.current !== requestId) {
          return;
        }

        setListing(getPropertyDetailData(response));
      })
      .catch(() => {
        if (listingRequestRef.current !== requestId) {
          return;
        }

        setIsListingError(true);
      })
      .finally(() => {
        if (listingRequestRef.current === requestId) {
          setIsListingLoading(false);
        }
      });
  }, [listingId]);

  useFocusEffect(
    useCallback(() => {
      loadListing();
    }, [loadListing]),
  );

  const listingForm = useMemo(
    () => (listing?.id ? formatListingFormData(listing) : null),
    [listing],
  );
  const isEditMode = Boolean(listingId);

  const handleStepPress = useCallback(
    index => {
      if (index > reachedStep) {
        return;
      }

      const currentKey = LISTING_STEPS[activeStep]?.key;
      const currentForm = formRefs[currentKey]?.current;

      if (currentForm?.values) {
        setDraftForm(current => ({
          ...current,
          [currentKey]: currentForm.values,
        }));
      }

      setActiveStep(index);
    },
    [activeStep, formRefs, reachedStep],
  );

  useEffect(() => {
    stepperRef.current?.scrollTo({
      x: Math.max(0, (activeStep - 1) * STEP_WIDTH),
      animated: true,
    });
  }, [activeStep]);

  const handleNext = useCallback(
    (stepKey, values) => {
      if (stepKey && values) {
        setDraftForm(current => ({
          ...current,
          [stepKey]: values,
        }));
      }

      setActiveStep(currentStep => {
        const nextStep = Math.min(currentStep + 1, LISTING_STEPS.length - 1);
        setReachedStep(currentReached => Math.max(currentReached, nextStep));
        return nextStep;
      });
    },
    [],
  );

  const handlePrevious = useCallback(() => {
    const currentKey = LISTING_STEPS[activeStep]?.key;
    const currentForm = formRefs[currentKey]?.current;

    if (currentKey === 'photos') {
      // Photos are saved via draft when choosing next; keep any local state on previous.
    } else if (currentForm?.values) {
      setDraftForm(current => ({
        ...current,
        [currentKey]: currentForm.values,
      }));
    }

    setActiveStep(currentStep => Math.max(currentStep - 1, 0));
  }, [activeStep, formRefs]);

  const handleSaveListing = useCallback(
    async photos => {
      if (isSavingRef.current) {
        return;
      }

      for (const step of FORM_REFS.slice(0, 3)) {
        const form = formRefs[step.key].current;

        if (!form) {
          setActiveStep(step.index);
          return;
        }

        const errors = await form.validateForm();

        if (hasFieldErrors(errors)) {
          form.setTouched(touchAllFields(form.values), false);
          setActiveStep(step.index);
          return;
        }
      }

      const formValues = {
        basicInfo: basicInfoRef.current?.values || draftForm.basicInfo,
        questions: questionsRef.current?.values || draftForm.questions,
        pricing: pricingRef.current?.values || draftForm.pricing,
        amenities: amenitiesRef.current?.values || draftForm.amenities,
        addOns: addOnsRef.current?.values || draftForm.addOns,
      };
      const selectedPhotos = Array.isArray(photos) ? photos : [];
      const newPhotos = selectedPhotos.filter(
        photo => photo?.uri && !/^https?:/i.test(photo.uri),
      );

      setDraftForm(current => ({
        ...current,
        ...formValues,
        photos: selectedPhotos,
      }));

      isSavingRef.current = true;
      setIsSaving(true);

      try {
        if (isEditMode) {
          const payload = buildListingUpdatePayload(formValues, listing);
          const remainingImageIds = new Set(
            selectedPhotos
              .filter(
                photo => photo?.existing || /^https?:/i.test(photo?.uri || ''),
              )
              .map(photo => photo.id),
          );
          const removedImageIds = (listing?.images || [])
            .filter(image => image?.id && !remainingImageIds.has(image.id))
            .map(image => image.id);

          if (newPhotos.length) {
            await makeUploadHomestayImagesRequest(listingId, newPhotos);
          }

          for (const imageId of removedImageIds) {
            await makeDeleteHomestayImageRequest(listingId, imageId);
          }

          const response = await makeUpdateHomestayRequest(listingId, payload);
          successToast(response?.message || t('CREATE_LISTING.UPDATE_SUCCESS'));
        } else {
          const payload = buildListingCreatePayload(formValues);
          const response = await makeCreateHomestayRequest(payload);
          const createdListing = getPropertyDetailData(response);
          const createdListingId = createdListing?.id;

          if (createdListingId && newPhotos.length) {
            await makeUploadHomestayImagesRequest(createdListingId, newPhotos);
          }

          successToast(response?.message || t('CREATE_LISTING.CREATE_SUCCESS'));
        }

        navigation.goBack();
      } catch (error) {
        if (!error?.response?.data?.message) {
          errorToast(
            t(
              isEditMode
                ? 'CREATE_LISTING.UPDATE_FAILED'
                : 'CREATE_LISTING.CREATE_FAILED',
            ),
          );
        }
      } finally {
        isSavingRef.current = false;
        setIsSaving(false);
      }
    },
    [draftForm, formRefs, isEditMode, listing, listingId, navigation, t],
  );

  return (
    <ScreenContainer noPaddingBottom noPaddingTop>
      <View style={styles.header}>
        <ScreenHeader
          title={t(
            isEditMode ? 'CREATE_LISTING.EDIT_TITLE' : 'CREATE_LISTING.TITLE',
          )}
          subtitle={t(
            isEditMode
              ? 'CREATE_LISTING.EDIT_SUBTITLE'
              : 'CREATE_LISTING.SUBTITLE',
          )}
          backAccessibilityLabel={t('CREATE_BOOKING.BACK')}
          onBack={() => navigation.goBack()}
        />
        <View style={styles.stepperCard}>
          <ScrollView
            ref={stepperRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.stepperTrack}>
            {LISTING_STEPS.map((step, index) => (
              <StepIndicator
                key={step.key}
                index={index}
                label={t(step.labelKey)}
                isActive={index === activeStep}
                isComplete={index !== activeStep && index <= reachedStep}
                isReachable={index <= reachedStep}
                isFirst={index === 0}
                isLast={index === LISTING_STEPS.length - 1}
                onPress={handleStepPress}
              />
            ))}
          </ScrollView>
        </View>
      </View>
      {isEditMode && !listingForm && isListingLoading ? (
        <View style={styles.listingStatus}>
          <ActivityIndicator color={COLORS.LOGIN_PRIMARY} size="large" />
        </View>
      ) : null}
      {isEditMode && isListingError && !isListingLoading && !listingForm ? (
        <View style={styles.listingStatus}>
          <StyledText color={COLORS.TEXT_SECONDARY} size={14} textAlign="center">
            {t('CREATE_LISTING.LOAD_ERROR')}
          </StyledText>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={loadListing}
            style={styles.listingRetry}>
            <StyledText color={COLORS.LOGIN_PRIMARY} variant="semiBold" size={15}>
              {t('CREATE_LISTING.RETRY')}
            </StyledText>
          </TouchableOpacity>
        </View>
      ) : null}
      {(!isEditMode || listingForm) &&
        LISTING_STEPS.map((step, index) => {
          const StepComponent = step.Component;
          const stepInitialValues =
            draftForm[step.key] || listingForm?.[step.key];

          return (
            <View
              key={step.key}
              style={
                index === activeStep ? styles.stepPage : styles.stepPageHidden
              }>
              <StepComponent
                onNext={
                  step.key === 'photos'
                    ? handleSaveListing
                    : values => handleNext(step.key, values)
                }
                onPrevious={handlePrevious}
                isFirst={index === 0}
                isLast={index === LISTING_STEPS.length - 1}
                initialValues={stepInitialValues}
                initialPhotos={
                  step.key === 'photos'
                    ? draftForm.photos || listingForm?.photos
                    : undefined
                }
                formRef={formRefs[step.key]}
                isSaving={isSaving}
                isEditMode={isEditMode}
              />
            </View>
          );
        })}
    </ScreenContainer>
  );
};

export default CreateListingScreen;
