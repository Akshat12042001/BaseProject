import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import moment from 'moment';
import {MaterialIcon, ScreenContainer, StyledText} from '../../../components/atoms';
import {AmenitiesModal, BookingCalendarModal} from '../../../components/modals';
import {
  MeetYourHost,
  PropertyInquiryCard,
  PropertyReviewsSection,
} from '../../../components/molecules';
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
import {makeGetHomestayBlockedDatesRequest} from '../../../api/common';
import {getBlockedDateStrings} from '../../../utils/booking';
import {useGetPropertyDetailQuery} from '../../../redux/tabs';
import {formatPropertyLocation} from '../../../utils/property';
import {
  formatPropertyType,
  getDescriptionSections,
  getListingQuestionRows,
  getPropertyAmenities,
  getPropertyDetailData,
  getPropertyImages,
  getPropertyListingUrl,
  normalizePropertyDetail,
} from '../../../utils/propertyDetail';
import {errorToast} from '../../../utils/alerts';
import styles from './styles';

const VISIBLE_AMENITIES = 6;
const IMAGE_WIDTH = SCREEN.WIDTH;
const CHILDREN_CAP = 2;
const DATE_FIELD = {
  CHECK_IN: 'checkIn',
  CHECK_OUT: 'checkOut',
};
const MESSAGE_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];

const formatMessageDate = date => {
  const value = moment(date);
  return `${value.date()} ${MESSAGE_MONTHS[value.month()]} ${value.year()}`;
};

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
  const [activeDateField, setActiveDateField] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [adults, setAdults] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [blockedDates, setBlockedDates] = useState([]);
  const [isBlockedDatesLoading, setIsBlockedDatesLoading] = useState(false);
  const scrollRef = useRef(null);
  const contentOffset = useRef(0);
  const inquiryOffset = useRef(0);

  const propertyId = route.params?.propertyId;
  const isListingView = Boolean(route.params?.isListingView);
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
  const maxGuests = Math.max(1, Number(property.maxGuests) || 9);
  const maxAdults = Math.max(1, maxGuests - childrenCount);
  const maxChildren = Math.min(CHILDREN_CAP, Math.max(0, maxGuests - adults));

  useEffect(() => {
    if (!isListingView || !homestayId) {
      return undefined;
    }

    let isMounted = true;

    const fetchBlockedDates = async () => {
      try {
        setIsBlockedDatesLoading(true);
        const response = await makeGetHomestayBlockedDatesRequest(homestayId);
        if (isMounted) {
          setBlockedDates(getBlockedDateStrings(response));
        }
      } catch {
        if (isMounted) {
          setBlockedDates([]);
        }
      } finally {
        if (isMounted) {
          setIsBlockedDatesLoading(false);
        }
      }
    };

    fetchBlockedDates();

    return () => {
      isMounted = false;
    };
  }, [homestayId, isListingView]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleScrollToInquiry = useCallback(() => {
    scrollRef.current?.scrollTo({
      y: Math.max(contentOffset.current + inquiryOffset.current - 12, 0),
      animated: true,
    });
  }, []);

  const handleContentLayout = useCallback(event => {
    contentOffset.current = event.nativeEvent.layout.y;
  }, []);

  const handleInquiryLayout = useCallback(event => {
    inquiryOffset.current = event.nativeEvent.layout.y;
  }, []);

  const handleOpenCheckInPicker = useCallback(() => {
    setActiveDateField(DATE_FIELD.CHECK_IN);
  }, []);

  const handleOpenCheckOutPicker = useCallback(() => {
    if (!checkIn) {
      setActiveDateField(DATE_FIELD.CHECK_IN);
      return;
    }

    setActiveDateField(DATE_FIELD.CHECK_OUT);
  }, [checkIn]);

  const handleDateConfirm = useCallback(
    date => {
      if (activeDateField === DATE_FIELD.CHECK_IN) {
        setCheckIn(date);
        if (checkOut && moment(checkOut).isSameOrBefore(date, 'day')) {
          setCheckOut(null);
        }
      } else if (activeDateField === DATE_FIELD.CHECK_OUT) {
        setCheckOut(date);
      }
      setActiveDateField(null);
    },
    [activeDateField, checkOut],
  );

  const handleDateCancel = useCallback(() => {
    setActiveDateField(null);
  }, []);

  const handleWhatsAppOwner = useCallback(() => {
    if (!checkIn || !checkOut || adults < 1) {
      errorToast(t('PROPERTY_DETAIL.CHAT_DATES_REQUIRED'));
      return;
    }

    const phone = String(
      property.host?.phone ||
        property.host?.mobile ||
        property.host?.whatsapp ||
        property.phone ||
        '',
    ).replace(/\D/g, '');
    const message = `Hi, I found your homestay on Boonies. I'm looking for a stay—can you share price, availability, and photos? Property link: ${getPropertyListingUrl(property)} Checkin date: ${formatMessageDate(checkIn)} Checkout date: ${formatMessageDate(checkOut)}`;
    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    Linking.openURL(url).catch(() => {});
  }, [adults, checkIn, checkOut, property, t]);

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
          ref={scrollRef}
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

          <View style={styles.content} onLayout={handleContentLayout}>
            <StyledText variant="bold" size={22} textStyle={styles.title}>
              {property.title}
            </StyledText>

            <View style={styles.ratingRow}>
              <View style={styles.ratingCopy}>
                <StarIcon color="#F5B301" size={14} />
                <StyledText variant="semiBold" size={13}>
                  {rating}
                </StyledText>
                <StyledText color={COLORS.TEXT_SECONDARY} size={13}>
                  {t('PROPERTY_DETAIL.GOOGLE_REVIEWS', {count: reviewCount})}
                </StyledText>
              </View>
              {isListingView ? (
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={handleScrollToInquiry}
                  style={styles.chatOwnerButton}>
                  <StyledText color={COLORS.WHITE} variant="semiBold" size={12}>
                    {t('PROPERTY_DETAIL.CHAT_WITH_OWNER')}
                  </StyledText>
                </TouchableOpacity>
              ) : null}
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

            {isListingView ? (
              <View collapsable={false} onLayout={handleInquiryLayout}>
                <SectionDivider />
                <PropertyInquiryCard
                  pricePerDay={property.pricePerDay}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  adults={adults}
                  children={childrenCount}
                  maxAdults={maxAdults}
                  maxChildren={maxChildren}
                  onCheckInPress={handleOpenCheckInPicker}
                  onCheckOutPress={handleOpenCheckOutPicker}
                  onAdultsChange={setAdults}
                  onChildrenChange={setChildrenCount}
                  onChatPress={handleWhatsAppOwner}
                />
              </View>
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
        {isListingView ? (
          <BookingCalendarModal
            isVisible={!!activeDateField}
            title={
              activeDateField === DATE_FIELD.CHECK_OUT
                ? t('PROPERTY_DETAIL.CHECK_OUT')
                : t('PROPERTY_DETAIL.CHECK_IN')
            }
            selectedDate={
              activeDateField === DATE_FIELD.CHECK_OUT ? checkOut : checkIn
            }
            minimumDate={
              activeDateField === DATE_FIELD.CHECK_OUT && checkIn
                ? moment(checkIn).add(1, 'day').toDate()
                : new Date()
            }
            unavailableDates={blockedDates}
            isLoading={isBlockedDatesLoading}
            onConfirm={handleDateConfirm}
            onClose={handleDateCancel}
          />
        ) : null}
      </View>
    </ScreenContainer>
  );
};

export default PropertyDetailScreen;
