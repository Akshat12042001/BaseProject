import React, {useMemo} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {StyledText} from '../../atoms';
import {
  BathroomIcon,
  BedIcon,
  GuestsIcon,
  LocationPinIcon,
  MoreIcon,
} from '../../svgs';
import {COLORS} from '../../../constants';
import {
  formatPropertyLocation,
  formatPropertyPrice,
  formatPropertyStatus,
} from '../../../utils/property';
import styles from './styles';

const STRIPES = [-80, -52, -24, 4, 32, 60, 88, 116, 144];

const PropertyFeature = ({Icon, label}) => (
  <View style={styles.feature}>
    <Icon color={COLORS.TEXT} size={12} />
    <StyledText size={11} variant="medium" containerStyle={styles.featureText}>
      {label}
    </StyledText>
  </View>
);

const PropertyCard = ({
  title,
  city,
  state,
  totalBedrooms,
  maxGuests,
  totalBathrooms,
  cancellationPolicy,
  imageUrl,
  pricePerDay,
  status,
  placeholder,
  compact = false,
  onPress,
  onMenuPress,
}) => {
  const {t} = useTranslation();

  const location = useMemo(
    () => formatPropertyLocation(city, state),
    [city, state],
  );

  const statusLabel = formatPropertyStatus(status);
  const isDraft = String(status || '').toLowerCase() === 'draft';
  const formattedPrice = formatPropertyPrice(pricePerDay);

  const details = [city, totalBedrooms ? t('HOME.PROPERTY.ROOMS', {count: totalBedrooms}) : '']
    .filter(Boolean)
    .join(' · ');

  const renderImage = () => (
    <View style={[styles.image, compact && styles.compactImage]}>
      {imageUrl ? (
        <Image source={{uri: imageUrl}} style={styles.imageAsset} />
      ) : (
        <>
          {STRIPES.map(offset => (
            <View key={offset} style={[styles.stripe, {left: offset}]} />
          ))}
          <View style={styles.placeholder}>
            <StyledText textStyle={styles.placeholderText}>{placeholder}</StyledText>
          </View>
        </>
      )}

      {!compact && !!statusLabel && (
        <View
          style={[
            styles.statusBadge,
            isDraft ? styles.draftBadge : styles.activeBadge,
          ]}>
          <StyledText
            variant="extraBold"
            size={10}
            color={isDraft ? COLORS.INVOICE_DRAFT_TEXT : COLORS.INVOICE_PAID_TEXT}>
            {statusLabel}
          </StyledText>
        </View>
      )}

      {!compact && (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={t('PROPERTIES.MORE_OPTIONS')}
          disabled={!onMenuPress}
          onPress={onMenuPress}
          style={styles.menuButton}>
          <View style={styles.menuIcon}>
            <MoreIcon color={COLORS.TEXT} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );

  const content = (
    <>
      {renderImage()}

      <View style={styles.content}>
        {compact ? (
          <>
            <StyledText variant="bold" size={13} textStyle={styles.title}>
              {title}
            </StyledText>
            {!!details && (
              <StyledText color={COLORS.TEXT_SECONDARY} size={10} numberOfLines={1}>
                {details}
              </StyledText>
            )}
          </>
        ) : (
          <>
            {!!location && (
              <View style={styles.locationRow}>
                <LocationPinIcon size={12} />
                <StyledText
                  color={COLORS.TEXT_SECONDARY}
                  size={11}
                  containerStyle={styles.locationText}
                  numberOfLines={1}>
                  {location}
                </StyledText>
              </View>
            )}

            <StyledText variant="bold" size={16} textStyle={styles.title}>
              {title}
            </StyledText>

            <View style={styles.featuresRow}>
              {!!maxGuests && (
                <PropertyFeature
                  Icon={GuestsIcon}
                  label={t('HOME.PROPERTY.GUESTS', {count: maxGuests})}
                />
              )}
              {!!totalBedrooms && (
                <PropertyFeature
                  Icon={BedIcon}
                  label={t('HOME.PROPERTY.BEDROOMS', {count: totalBedrooms})}
                />
              )}
              {!!totalBathrooms && (
                <PropertyFeature
                  Icon={BathroomIcon}
                  label={t('HOME.PROPERTY.BATHROOMS', {count: totalBathrooms})}
                />
              )}
            </View>

            {!!cancellationPolicy && (
              <StyledText
                color={COLORS.TEXT_SECONDARY}
                size={11}
                containerStyle={styles.cancellation}>
                {t('PROPERTIES.CANCELLATION', {policy: cancellationPolicy})}
              </StyledText>
            )}

            {!!pricePerDay && (
              <View style={styles.priceRow}>
                <StyledText color={COLORS.LOGIN_PRIMARY} variant="bold" size={18}>
                  {formattedPrice}
                </StyledText>
                <StyledText color={COLORS.TEXT_SECONDARY} size={12}>
                  {t('HOME.PROPERTY.PER_NIGHT')}
                </StyledText>
              </View>
            )}
          </>
        )}
      </View>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={0.85}
        onPress={onPress}
        style={[styles.container, compact && styles.compactContainer]}>
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      {content}
    </View>
  );
};

export default React.memo(PropertyCard);
