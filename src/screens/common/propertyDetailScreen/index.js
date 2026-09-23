import React, {useCallback, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MaterialIcon, ScreenContainer, StyledText} from '../../../components/atoms';
import {AmenitiesModal} from '../../../components/modals';
import {MeetYourHost, PropertyReviewsSection} from '../../../components/molecules';
import {
  BackIcon,
  BedIcon,
  GuestsIcon,
  LocationPinIcon,
  PropertyIcon,
  ShareIcon,
  StarIcon,
} from '../../../components/svgs';
import {COLORS, SCREEN} from '../../../constants';
import {useGetPropertyDetailQuery} from '../../../redux/tabs';
import {formatPropertyLocation} from '../../../utils/property';
import {
  formatPropertyType,
  getDescriptionSections,
  getListingQuestionRows,
  getPropertyAmenities,
  getPropertyDetailData,
  getPropertyImages,
  normalizePropertyDetail,
} from '../../../utils/propertyDetail';
import styles from './styles';

const VISIBLE_AMENITIES = 6;
const IMAGE_WIDTH = SCREEN.WIDTH;

const SectionDivider = () => <View style={styles.divider} />;

const HighlightStat = ({Icon, label, value, fullWidth = false}) => (
  <View style={[styles.highlightItem, fullWidth && styles.highlightItemFull]}>
    <View style={styles.highlightIconWrap}>
      <Icon color={COLORS.TEXT_MUTED} size={18} />
    </View>
    <StyledText
      variant="semiBold"
      size={12}
      containerStyle={styles.highlightLabel}>
      {label}
    </StyledText>
    <StyledText color={COLORS.TEXT_SECONDARY} size={12}>
      {value}
    </StyledText>
  </View>
);

const InfoChip = ({text, icon, fullWidth = false}) => (
  <View style={[styles.chip, fullWidth && styles.chipFull]}>
    <View style={styles.chipIcon}>
      <MaterialIcon name={icon} size={16} color={COLORS.LOGIN_PRIMARY} />
    </View>
    <StyledText size={11} >
      {text}
    </StyledText>
  </View>
);

const PropertyDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const {t} = useTranslation();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAmenitiesModalVisible, setIsAmenitiesModalVisible] = useState(false);

  const propertyId = route.params?.propertyId;
  const {
    data: propertyResponse,
    isError,
    isLoading,
  } = useGetPropertyDetailQuery(propertyId, {
    skip: !propertyId,
  });

  const property = useMemo(
    () => normalizePropertyDetail(getPropertyDetailData(propertyResponse)),
    [propertyResponse],
  );

  const homestayId = property?.id || propertyId;
  const hostId = property?.hostId || property?.host?.id;

  const images = useMemo(
    () => getPropertyImages(property, 5),
    [property],
  );
  const amenities = useMemo(() => getPropertyAmenities(property), [property]);
  const visibleAmenities = amenities.slice(0, VISIBLE_AMENITIES);
  const descriptionSections = useMemo(
    () => getDescriptionSections(property.description),
    [property.description],
  );
  const listingRows = useMemo(
    () => getListingQuestionRows(property.listingQuestions),
    [property.listingQuestions],
  );

  const location = formatPropertyLocation(property.city, property.state);
  const rating = property.googleReviews?.GoogleRating || 0;
  const reviewCount = property.googleReviews?.TotalReviews || 0;
  const bedTypeValue = t('PROPERTY_DETAIL.BED_TYPE_VALUE', {
    bedrooms: property.totalBedrooms,
    bathrooms: property.totalBathrooms,
  });

  const hasListingChips = listingRows.length > 0;
  const hasDescription =
    !!descriptionSections.overview || !!descriptionSections.sectionTitle;
  const hasCancellation = Boolean(
    property.cancellationPolicy?.name || property.cancellationPolicy?.description,
  );
  const hasAmenities = amenities.length > 0;
  const hasHost = Boolean(property.host);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleOpenAmenitiesModal = useCallback(() => {
    setIsAmenitiesModalVisible(true);
  }, []);

  const handleCloseAmenitiesModal = useCallback(() => {
    setIsAmenitiesModalVisible(false);
  }, []);

  const handleGalleryScroll = useCallback(event => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / IMAGE_WIDTH,
    );
    setActiveImageIndex(index);
  }, []);

  const renderGalleryImage = useCallback(
    ({item}) => (
      <Image source={{uri: item}} style={styles.galleryImage} resizeMode="cover" />
    ),
    [],
  );

  const galleryKeyExtractor = useCallback(
    (item, index) => `${item}-${index}`,
    [],
  );

  if (!propertyId) {
    return (
      <ScreenContainer noPaddingTop noPaddingBottom>
        <View style={styles.screen}>
          <View style={[styles.stateBackButton, {top: insets.top + 8}]}>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={handleBack}
              style={styles.iconButton}>
              <BackIcon color={COLORS.TEXT} />
            </TouchableOpacity>
          </View>
          <View style={styles.centerState}>
            <StyledText color={COLORS.TEXT_SECONDARY} size={14}>
              {t('PROPERTY_DETAIL.MISSING_PROPERTY')}
            </StyledText>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  if (isLoading) {
    return (
      <ScreenContainer noPaddingTop noPaddingBottom>
        <View style={styles.screen}>
          <View style={[styles.stateBackButton, {top: insets.top + 8}]}>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={handleBack}
              style={styles.iconButton}>
              <BackIcon color={COLORS.TEXT} />
            </TouchableOpacity>
          </View>
          <View style={styles.centerState}>
            <ActivityIndicator color={COLORS.LOGIN_PRIMARY} size="large" />
          </View>
        </View>
      </ScreenContainer>
    );
  }

  if (isError || !property?.id) {
    return (
      <ScreenContainer noPaddingTop noPaddingBottom>
        <View style={styles.screen}>
          <View style={[styles.stateBackButton, {top: insets.top + 8}]}>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={handleBack}
              style={styles.iconButton}>
              <BackIcon color={COLORS.TEXT} />
            </TouchableOpacity>
          </View>
          <View style={styles.centerState}>
            <StyledText color={COLORS.TEXT_SECONDARY} size={14}>
              {t('PROPERTY_DETAIL.LOAD_ERROR')}
            </StyledText>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer noPaddingTop noPaddingBottom>
      <View style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <View style={styles.gallerySection}>
            <FlatList
              horizontal
              pagingEnabled
              bounces={false}
              data={images}
              renderItem={renderGalleryImage}
              keyExtractor={galleryKeyExtractor}
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleGalleryScroll}
            />

            <View style={[styles.galleryOverlay, {paddingTop: insets.top + 8}]}>
              <View style={styles.galleryActions}>
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={handleBack}
                  style={styles.iconButton}>
                  <BackIcon color={COLORS.TEXT} />
                </TouchableOpacity>
                <TouchableOpacity accessibilityRole="button" style={styles.iconButton}>
                  <ShareIcon color={COLORS.TEXT} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.dotsRow}>
              {images.map((_, index) => (
                <View
                  key={`dot-${index}`}
                  style={[styles.dot, index === activeImageIndex && styles.activeDot]}
                />
              ))}
            </View>
          </View>

          <View style={styles.content}>
            <StyledText variant="bold" size={22} textStyle={styles.title}>
              {property.title}
            </StyledText>

            <View style={styles.ratingRow}>
              <StarIcon color="#F5B301" size={14} />
              <StyledText variant="semiBold" size={13}>
                {rating}
              </StyledText>
              <StyledText color={COLORS.TEXT_SECONDARY} size={13}>
                {t('PROPERTY_DETAIL.GOOGLE_REVIEWS', {count: reviewCount})}
              </StyledText>
            </View>

            <View style={styles.locationRow}>
              <LocationPinIcon color={COLORS.TEXT_MUTED} size={14} />
              <StyledText
                color={COLORS.TEXT_SECONDARY}
                size={13}
                textStyle={styles.locationText}>
                {location}
              </StyledText>
              {property.isPet ? (
                <View style={styles.badge}>
                  <StyledText color={COLORS.LOGIN_PRIMARY} variant="semiBold" size={11}>
                    {t('PROPERTY_DETAIL.PET_FRIENDLY')}
                  </StyledText>
                </View>
              ) : null}
            </View>

            <SectionDivider />

            <View style={styles.highlightsGrid}>
              <HighlightStat
                Icon={GuestsIcon}
                label={t('PROPERTY_DETAIL.MAX_GUESTS')}
                value={t('PROPERTY_DETAIL.GUESTS_VALUE', {count: property.maxGuests})}
              />
              <HighlightStat
                Icon={BedIcon}
                label={t('PROPERTY_DETAIL.BED_TYPE')}
                value={bedTypeValue}
              />
              <HighlightStat
                Icon={PropertyIcon}
                label={t('PROPERTY_DETAIL.PROPERTY_TYPE')}
                value={formatPropertyType(property.propertyType)}
                fullWidth
              />
            </View>

            {hasListingChips ? (
              <>
                <SectionDivider />
                <View style={styles.chipRows}>
                  {listingRows.map((row, rowIndex) => (
                    <View key={`chip-row-${rowIndex}`} style={styles.chipRow}>
                      {row.map(chip => (
                        <InfoChip
                          key={chip.id}
                          icon={chip.icon}
                          text={chip.text}
                          fullWidth={row.length === 1}
                        />
                      ))}
                    </View>
                  ))}
                </View>
              </>
            ) : null}

            {hasDescription ? (
              <>
                <SectionDivider />
                {!!descriptionSections.overview && (
                  <StyledText
                    color={COLORS.TEXT_SECONDARY}
                    size={14}
                    textStyle={styles.bodyText}>
                    {descriptionSections.overview}
                  </StyledText>
                )}

                {!!descriptionSections.sectionTitle && (
                  <View style={styles.paragraphSpacing}>
                    <StyledText
                      color={COLORS.TEXT_SECONDARY}
                      size={14}
                      variant="semiBold"
                      containerStyle={styles.sectionTitle}>
                      {descriptionSections.sectionTitle}
                    </StyledText>
                    <StyledText
                      color={COLORS.TEXT_SECONDARY}
                      size={14}
                      textStyle={styles.bodyText}>
                      {descriptionSections.sectionBody}
                    </StyledText>
                  </View>
                )}
              </>
            ) : null}

            {hasCancellation ? (
              <>
                <SectionDivider />
                <StyledText variant="bold" size={18} containerStyle={styles.sectionTitle}>
                  {t('PROPERTY_DETAIL.CANCELLATION')}
                </StyledText>
                <StyledText variant="semiBold" size={14}>
                  {property.cancellationPolicy?.name}
                </StyledText>
                <StyledText
                  color={COLORS.TEXT_SECONDARY}
                  size={13}
                  containerStyle={styles.paragraphSpacing}>
                  {property.cancellationPolicy?.description}
                </StyledText>
              </>
            ) : null}

            {hasAmenities ? (
              <>
                <SectionDivider />
                <StyledText variant="bold" size={18} containerStyle={styles.sectionTitle}>
                  {t('PROPERTY_DETAIL.AMENITIES')}
                </StyledText>

                {visibleAmenities.map(amenity => (
                  <View key={amenity.name} style={styles.amenityRow}>
                    <View style={styles.amenityIcon}>
                      <MaterialIcon
                        name={amenity.icon}
                        size={18}
                        color={COLORS.TEXT_MUTED}
                      />
                    </View>
                    <StyledText size={14}>{amenity.name}</StyledText>
                  </View>
                ))}

                {amenities.length > VISIBLE_AMENITIES ? (
                  <TouchableOpacity
                    accessibilityRole="button"
                    onPress={handleOpenAmenitiesModal}
                    style={styles.showAllAmenities}>
                    <StyledText
                      variant="semiBold"
                      size={14}
                      textStyle={styles.showAllText}>
                      {t('PROPERTY_DETAIL.SHOW_ALL_AMENITIES', {
                        count: amenities.length,
                      })}
                    </StyledText>
                  </TouchableOpacity>
                ) : null}
              </>
            ) : null}

            {hasHost ? (
              <>
                <SectionDivider />
                <MeetYourHost host={property.host} />
              </>
            ) : null}

            <SectionDivider />

            <PropertyReviewsSection homestayId={homestayId} hostId={hostId} />
          </View>
        </ScrollView>

        <AmenitiesModal
          isVisible={isAmenitiesModalVisible}
          amenities={amenities}
          onClose={handleCloseAmenitiesModal}
        />
      </View>
    </ScreenContainer>
  );
};

export default PropertyDetailScreen;
