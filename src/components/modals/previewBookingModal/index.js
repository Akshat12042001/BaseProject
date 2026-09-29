import React, {useCallback, useMemo} from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {StyledText} from '../../atoms';
import {CloseIcon} from '../../svgs';
import {COLORS} from '../../../constants';
import {formatCurrencyWithDecimals} from '../../../utils/invoice';
import styles from './styles';

const DEFAULT_LOGO_URL = 'https://www.boonies.in/Final-boonies-logo.png';
const EMPTY_VALUE = '—';

const displayValue = value => {
  if (value === 0) {
    return '0';
  }

  const text = String(value ?? '').trim();
  return text || EMPTY_VALUE;
};

const DetailField = ({label, value, isLast = false}) => (
  <View style={[styles.detailField, isLast && styles.detailFieldLast]}>
    <StyledText
      color={COLORS.TEXT_MUTED}
      size={11}
      variant="medium"
      containerStyle={styles.detailLabel}>
      {label}
    </StyledText>
    <StyledText variant="bold" size={14}>
      {displayValue(value)}
    </StyledText>
  </View>
);

const SpecRow = ({label, value, showBorder = true}) => (
  <View style={[styles.specRow, showBorder && styles.specRowBorder]}>
    <StyledText
      color={COLORS.TEXT_MUTED}
      size={11}
      variant="medium"
      containerStyle={styles.specLabel}>
      {label}
    </StyledText>
    <StyledText variant="bold" size={14}>
      {displayValue(value)}
    </StyledText>
  </View>
);

const StayRow = ({label, children, showBorder = true}) => (
  <View style={[styles.stayRow, showBorder && styles.stayRowBorder]}>
    <StyledText
      color={COLORS.TEXT_MUTED}
      size={11}
      variant="medium"
      containerStyle={styles.stayLabel}>
      {label}
    </StyledText>
    {children}
  </View>
);

const SectionHeader = ({title}) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionAccent} />
    <StyledText variant="bold" size={15}>
      {title}
    </StyledText>
  </View>
);

const PricingRow = ({label, value, emphasize = false, showBorder = true}) => (
  <View style={[styles.pricingRow, showBorder && styles.pricingRowBorder]}>
    <StyledText
      color={emphasize ? COLORS.TEXT : COLORS.TEXT_MUTED}
      size={13}
      variant={emphasize ? 'bold' : 'regular'}
      containerStyle={styles.pricingLabel}>
      {label}
    </StyledText>
    <StyledText variant="bold" size={14}>
      {value}
    </StyledText>
  </View>
);

const PreviewBookingModal = ({
  isVisible = false,
  isLoading = false,
  data = null,
  fallbackTitle = '',
  onClose,
}) => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const preview = useMemo(() => {
    const guest = data?.guest || {};
    const host = data?.host || {};
    const occupancy = data?.occupancy || {};
    const inclusions = data?.inclusions || {};
    const pricing = data?.pricing || {};
    const checkIn = data?.checkIn || {};
    const checkOut = data?.checkOut || {};

    const offeredPrice = Number(pricing.offeredPrice) || 0;
    const advancePayment = Number(pricing.advancePayment) || 0;
    const balanceDue =
      pricing.balanceDue != null
        ? Number(pricing.balanceDue) || 0
        : Math.max(0, offeredPrice - advancePayment);

    return {
      title:
        data?.title ||
        data?.propertyName ||
        fallbackTitle ||
        t('BOOKING_LIST.MENU_PREVIEW'),
      logoUrl: data?.logoUrl || DEFAULT_LOGO_URL,
      propertyImageUrl: data?.propertyImageUrl || '',
      propertyName: data?.propertyName || data?.title || '',
      propertyAddress: data?.propertyAddress || '',
      propertyType: data?.propertyType || '',
      bedrooms: data?.bedrooms,
      bathrooms: data?.bathrooms,
      guest: {
        name: guest.name || '',
        email: guest.email || '',
        phone: guest.phone || '',
      },
      host: {
        name: host.name || '',
        email: host.email || '',
        phone: host.phone || '',
      },
      checkIn: {
        date: checkIn.date || '',
        time: checkIn.time || '',
      },
      checkOut: {
        date: checkOut.date || '',
        time: checkOut.time || '',
      },
      occupancy: {
        adults: Number(occupancy.adults) || 0,
        children: Number(occupancy.children) || 0,
        pets: Number(occupancy.pets) || 0,
      },
      inclusions: {
        breakfast: inclusions.breakfast,
        dinner: inclusions.dinner,
      },
      pricing: {
        offeredPrice,
        advancePayment,
        balanceDue,
      },
      noteLines: Array.isArray(data?.noteLines) ? data.noteLines : [],
      noteClosing: data?.noteClosing || '',
    };
  }, [data, fallbackTitle, t]);

  const breakfastLabel = preview.inclusions.breakfast
    ? t('BOOKING_LIST.PREVIEW_BREAKFAST')
    : t('BOOKING_LIST.PREVIEW_NO_BREAKFAST');
  const dinnerLabel = preview.inclusions.dinner
    ? t('BOOKING_LIST.PREVIEW_DINNER')
    : t('BOOKING_LIST.PREVIEW_NO_DINNER');

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={handleClose}
      onBackdropPress={handleClose}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating
      coverScreen
      useNativeDriver>
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top || 12,
            paddingBottom: insets.bottom || 12,
          },
        ]}>
        <View style={styles.header}>
          <StyledText
            variant="bold"
            size={16}
            numberOfLines={1}
            containerStyle={styles.headerTitle}>
            {preview.title}
          </StyledText>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t('BOOKING_LIST.PREVIEW_CLOSE')}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
            onPress={handleClose}
            style={styles.closeButton}>
            <CloseIcon color={COLORS.GREYSCALE_900} size={14} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={COLORS.LOGIN_PRIMARY} size="large" />
          </View>
        ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.logoWrapper}>
            <Image
              source={{uri: preview.logoUrl}}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.propertyCard}>
            {!!preview.propertyImageUrl && (
              <Image
                source={{uri: preview.propertyImageUrl}}
                style={styles.propertyImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.propertyBody}>
              <StyledText
                color={COLORS.TEXT_MUTED}
                size={11}
                variant="medium"
                containerStyle={styles.sectionLabel}>
                {t('BOOKING_LIST.PREVIEW_PROPERTY_DETAILS')}
              </StyledText>
              <StyledText
                variant="bold"
                size={16}
                containerStyle={styles.propertyTitle}>
                {displayValue(preview.propertyName)}
              </StyledText>
              {!!preview.propertyAddress && (
                <StyledText
                  color={COLORS.TEXT_SECONDARY}
                  size={13}
                  containerStyle={styles.propertyAddress}>
                  {preview.propertyAddress}
                </StyledText>
              )}

              <View style={styles.specsCard}>
                <SpecRow
                  label={t('BOOKING_LIST.PREVIEW_PROPERTY_TYPE')}
                  value={preview.propertyType}
                />
                <SpecRow
                  label={t('BOOKING_LIST.PREVIEW_BEDROOMS')}
                  value={preview.bedrooms}
                />
                <SpecRow
                  label={t('BOOKING_LIST.PREVIEW_BATHROOMS')}
                  value={preview.bathrooms}
                  showBorder={false}
                />
              </View>
            </View>
          </View>

          <View style={styles.detailsCard}>
            <StyledText
              color={COLORS.TEXT_MUTED}
              size={11}
              variant="medium"
              containerStyle={styles.detailsCardTitle}>
              {t('BOOKING_LIST.PREVIEW_GUEST_DETAILS')}
            </StyledText>
            <DetailField
              label={t('BOOKING_LIST.PREVIEW_NAME')}
              value={preview.guest.name}
            />
            <DetailField
              label={t('BOOKING_LIST.PREVIEW_EMAIL')}
              value={preview.guest.email}
            />
            <DetailField
              label={t('BOOKING_LIST.PREVIEW_PHONE')}
              value={preview.guest.phone}
              isLast
            />
          </View>

          <View style={styles.detailsCard}>
            <StyledText
              color={COLORS.TEXT_MUTED}
              size={11}
              variant="medium"
              containerStyle={styles.detailsCardTitle}>
              {t('BOOKING_LIST.PREVIEW_HOST_DETAILS')}
            </StyledText>
            <DetailField
              label={t('BOOKING_LIST.PREVIEW_NAME')}
              value={preview.host.name}
            />
            <DetailField
              label={t('BOOKING_LIST.PREVIEW_EMAIL')}
              value={preview.host.email}
            />
            <DetailField
              label={t('BOOKING_LIST.PREVIEW_PHONE')}
              value={preview.host.phone}
              isLast
            />
          </View>

          <View style={styles.sectionBlock}>
            <SectionHeader title={t('BOOKING_LIST.PREVIEW_STAY_DETAILS')} />
            <View style={styles.stayCard}>
              <StayRow label={t('BOOKING_LIST.PREVIEW_CHECK_IN')}>
                <StyledText variant="bold" size={14}>
                  {displayValue(preview.checkIn.date)}
                </StyledText>
                {!!preview.checkIn.time && (
                  <StyledText
                    color={COLORS.TEXT_MUTED}
                    size={12}
                    containerStyle={styles.stayTime}>
                    {preview.checkIn.time}
                  </StyledText>
                )}
              </StayRow>
              <StayRow label={t('BOOKING_LIST.PREVIEW_CHECK_OUT')}>
                <StyledText variant="bold" size={14}>
                  {displayValue(preview.checkOut.date)}
                </StyledText>
                {!!preview.checkOut.time && (
                  <StyledText
                    color={COLORS.TEXT_MUTED}
                    size={12}
                    containerStyle={styles.stayTime}>
                    {preview.checkOut.time}
                  </StyledText>
                )}
              </StayRow>
              <StayRow label={t('BOOKING_LIST.PREVIEW_OCCUPANCY')}>
                <StyledText
                  color={COLORS.TEXT_SECONDARY}
                  size={13}
                  containerStyle={styles.stayListItem}>
                  {t('BOOKING_LIST.PREVIEW_ADULTS', {
                    count: preview.occupancy.adults,
                  })}
                </StyledText>
                <StyledText
                  color={COLORS.TEXT_SECONDARY}
                  size={13}
                  containerStyle={styles.stayListItem}>
                  {t('BOOKING_LIST.PREVIEW_CHILDREN', {
                    count: preview.occupancy.children,
                  })}
                </StyledText>
                <StyledText
                  color={COLORS.TEXT_SECONDARY}
                  size={13}
                  containerStyle={styles.stayListItem}>
                  {t('BOOKING_LIST.PREVIEW_PETS', {
                    count: preview.occupancy.pets,
                  })}
                </StyledText>
              </StayRow>
              <StayRow
                label={t('BOOKING_LIST.PREVIEW_INCLUSIONS')}
                showBorder={false}>
                <StyledText
                  color={COLORS.TEXT_SECONDARY}
                  size={13}
                  containerStyle={styles.stayListItem}>
                  {breakfastLabel}
                </StyledText>
                <StyledText
                  color={COLORS.TEXT_SECONDARY}
                  size={13}
                  containerStyle={styles.stayListItem}>
                  {dinnerLabel}
                </StyledText>
              </StayRow>
            </View>
          </View>

          <View style={styles.sectionBlock}>
            <SectionHeader title={t('BOOKING_LIST.PREVIEW_PRICING_SUMMARY')} />
            <View style={styles.pricingCard}>
              <PricingRow
                label={t('BOOKING_LIST.PREVIEW_TOTAL_OFFERED')}
                value={formatCurrencyWithDecimals(preview.pricing.offeredPrice)}
              />
              <PricingRow
                label={t('BOOKING_LIST.PREVIEW_ADVANCE_PAYMENT')}
                value={formatCurrencyWithDecimals(
                  preview.pricing.advancePayment,
                )}
              />
              <PricingRow
                label={t('BOOKING_LIST.PREVIEW_BALANCE_DUE')}
                value={formatCurrencyWithDecimals(preview.pricing.balanceDue)}
                emphasize
                showBorder={false}
              />
            </View>
          </View>

          {(preview.noteLines.length > 0 || !!preview.noteClosing) && (
            <View style={styles.noteCard}>
              <StyledText
                color="#78350F"
                variant="bold"
                size={14}
                containerStyle={styles.noteTitle}>
                {t('BOOKING_LIST.PREVIEW_NOTE')}
              </StyledText>
              {preview.noteLines.map((line, index) => (
                <StyledText
                  key={`note-line-${index}`}
                  color="#78350F"
                  size={13}
                  containerStyle={styles.noteLine}>
                  {line}
                </StyledText>
              ))}
              {!!preview.noteClosing && (
                <StyledText
                  color="#78350F"
                  size={13}
                  containerStyle={styles.noteClosing}>
                  {preview.noteClosing}
                </StyledText>
              )}
            </View>
          )}

          <StyledText
            color={COLORS.TEXT_MUTED}
            size={12}
            textAlign="center"
            containerStyle={styles.poweredBy}
            textStyle={{fontStyle: 'italic'}}>
            {t('BOOKING_LIST.PREVIEW_POWERED_BY')}
          </StyledText>
        </ScrollView>
        )}
      </View>
    </Modal>
  );
};

export default PreviewBookingModal;
