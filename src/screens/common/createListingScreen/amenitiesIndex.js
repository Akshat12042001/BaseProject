import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Formik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {StyledText} from '../../../components/atoms';
import {AmenityCard} from '../../../components/molecules';
import {makeGetAmenitiesRequest} from '../../../api/common';
import {COLORS} from '../../../constants';
import StepActions from './stepActions';
import styles from './styles';

const EMPTY_VALUES = {
  amenities: [],
};

const groupAmenities = amenities => {
  const groups = [];
  const indexByCategory = new Map();

  amenities
    .filter(amenity => amenity?.isActive !== false)
    .forEach(amenity => {
      const category = String(amenity.category || 'other').trim() || 'other';

      if (!indexByCategory.has(category)) {
        indexByCategory.set(category, groups.length);
        groups.push({
          id: category,
          title: category,
          items: [],
        });
      }

      groups[indexByCategory.get(category)].items.push({
        id: amenity.id,
        title: amenity.name || '',
        iconName: amenity.icon || '',
      });
    });

  return groups;
};

const AmenityItem = React.memo(({item, selected, onToggle}) => {
  const handlePress = useCallback(() => {
    onToggle(item.id);
  }, [item.id, onToggle]);

  return (
    <AmenityCard
      title={item.title}
      iconName={item.iconName}
      selected={selected}
      onPress={handlePress}
    />
  );
});

const AmenitiesStep = ({
  onNext,
  onPrevious,
  isFirst,
  isLast,
  initialValues = EMPTY_VALUES,
  formRef,
}) => {
  const {t} = useTranslation();
  const [amenities, setAmenities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const amenityGroups = useMemo(() => groupAmenities(amenities), [amenities]);

  const handleSubmit = useCallback(
    values => {
      onNext?.(values);
    },
    [onNext],
  );

  useEffect(() => {
    let isMounted = true;

    makeGetAmenitiesRequest()
      .then(response => {
        const list = Array.isArray(response) ? response : response?.data || [];

        if (isMounted) {
          setAmenities(list);
        }
      })
      .catch(() => {
        if (isMounted) {
          setHasError(true);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Formik
      innerRef={formRef}
      enableReinitialize
      initialValues={initialValues}
      onSubmit={handleSubmit}>
      {({values, setFieldValue, handleSubmit: submitForm}) => {
        const selectedAmenities = values.amenities;

        const handleToggle = amenityId => {
          const isSelected = selectedAmenities.includes(amenityId);
          setFieldValue(
            'amenities',
            isSelected
              ? selectedAmenities.filter(id => id !== amenityId)
              : [...selectedAmenities, amenityId],
            false,
          );
        };

        return (
          <KeyboardAwareScrollView
            enableOnAndroid
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
              <View style={styles.amenitiesHeader}>
                <StyledText variant="bold" size={18} containerStyle={styles.amenitiesTitle}>
                  {t('CREATE_LISTING.AMENITIES.TITLE')}
                </StyledText>
                <View style={styles.amenitiesBadge}>
                  <StyledText color={COLORS.WHITE} size={12} variant="semiBold">
                    {t('CREATE_LISTING.AMENITIES.SELECTED', {
                      count: selectedAmenities.length,
                    })}
                  </StyledText>
                </View>
              </View>

              {isLoading ? (
                <View style={styles.amenitiesStatus}>
                  <ActivityIndicator color={COLORS.LOGIN_PRIMARY} />
                </View>
              ) : null}

              {!isLoading && hasError ? (
                <StyledText
                  color={COLORS.GREYSCALE_500}
                  size={13}
                  containerStyle={styles.amenitiesStatus}>
                  {t('CREATE_LISTING.AMENITIES.LOAD_ERROR')}
                </StyledText>
              ) : null}

              {!isLoading && !hasError && !amenityGroups.length ? (
                <StyledText
                  color={COLORS.GREYSCALE_500}
                  size={13}
                  containerStyle={styles.amenitiesStatus}>
                  {t('CREATE_LISTING.AMENITIES.EMPTY')}
                </StyledText>
              ) : null}

              {amenityGroups.map(group => (
                <View key={group.id} style={styles.amenityGroup}>
                  <StyledText
                    color={COLORS.GREYSCALE_500}
                    size={12}
                    variant="semiBold"
                    textStyle={styles.amenityGroupLabel}>
                    {group.title}
                  </StyledText>
                  {group.items.map(item => (
                    <AmenityItem
                      key={item.id}
                      item={item}
                      selected={selectedAmenities.includes(item.id)}
                      onToggle={handleToggle}
                    />
                  ))}
                </View>
              ))}

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

export default React.memo(AmenitiesStep);
