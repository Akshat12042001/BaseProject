import React, {useCallback} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import {StyledText} from '../../atoms';
import {MinusIcon, PlusIcon, WhatsAppIcon} from '../../svgs';
import {COLORS} from '../../../constants';
import styles from './styles';

const formatPrice = value => {
  const amount = Number(value) || 0;
  const hasDecimals = amount % 1 !== 0;

  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
};

const formatStayDate = date => (date ? moment(date).format('DD MMM YYYY') : '');

const GuestStepper = ({title, hint, value, min, max, onChange}) => {
  const canDecrement = value > min;
  const canIncrement = value < max;

  const handleDecrement = useCallback(() => {
    if (canDecrement) {
      onChange(value - 1);
    }
  }, [canDecrement, onChange, value]);

  const handleIncrement = useCallback(() => {
    if (canIncrement) {
      onChange(value + 1);
    }
  }, [canIncrement, onChange, value]);

  return (
    <View style={styles.guestRow}>
      <View style={styles.guestText}>
        <StyledText variant="bold" size={14}>
          {title}
        </StyledText>
        <StyledText
          color={COLORS.TEXT_SECONDARY}
          size={11}
          containerStyle={styles.guestHint}>
          {hint}
        </StyledText>
      </View>
      <View style={styles.stepper}>
        <TouchableOpacity
          accessibilityRole="button"
          disabled={!canDecrement}
          onPress={handleDecrement}
          style={[
            styles.stepperButton,
            canDecrement && styles.stepperButtonActive,
          ]}>
          <MinusIcon
            color={canDecrement ? COLORS.LOGIN_PRIMARY : COLORS.TEXT_MUTED}
          />
        </TouchableOpacity>
        <StyledText variant="bold" size={15} containerStyle={styles.stepperValue}>
          {value}
        </StyledText>
        <TouchableOpacity
          accessibilityRole="button"
          disabled={!canIncrement}
          onPress={handleIncrement}
          style={[
            styles.stepperButton,
            canIncrement && styles.stepperButtonActive,
          ]}>
          <PlusIcon
            color={canIncrement ? COLORS.LOGIN_PRIMARY : COLORS.TEXT_MUTED}
            size={14}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const PropertyInquiryCard = ({
  pricePerDay,
  checkIn,
  checkOut,
  adults,
  children,
  maxAdults,
  maxChildren,
  onCheckInPress,
  onCheckOutPress,
  onAdultsChange,
  onChildrenChange,
  onChatPress,
}) => {
  const {t} = useTranslation();

  return (
    <View style={styles.card}>
      <View style={styles.priceRow}>
        <StyledText variant="bold" size={20}>
          {formatPrice(pricePerDay)}
        </StyledText>
        <StyledText color={COLORS.TEXT_SECONDARY} size={13}>
          {t('PROPERTY_DETAIL.PER_NIGHT')}
        </StyledText>
      </View>

      <StyledText
        color={COLORS.TEXT_MUTED}
        size={10}
        variant="semiBold"
        containerStyle={styles.fieldLabel}>
        {t('PROPERTY_DETAIL.CHECK_IN')}
      </StyledText>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={onCheckInPress}
        style={styles.field}>
        <StyledText color={checkIn ? COLORS.TEXT : COLORS.TEXT_MUTED} size={14}>
          {formatStayDate(checkIn) || t('PROPERTY_DETAIL.CHECK_IN_PLACEHOLDER')}
        </StyledText>
      </TouchableOpacity>

      <StyledText
        color={COLORS.TEXT_MUTED}
        size={10}
        variant="semiBold"
        containerStyle={styles.fieldLabel}>
        {t('PROPERTY_DETAIL.CHECK_OUT')}
      </StyledText>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={onCheckOutPress}
        style={styles.field}>
        <StyledText color={checkOut ? COLORS.TEXT : COLORS.TEXT_MUTED} size={14}>
          {formatStayDate(checkOut) || t('PROPERTY_DETAIL.CHECK_OUT_PLACEHOLDER')}
        </StyledText>
      </TouchableOpacity>

      <StyledText
        color={COLORS.TEXT_MUTED}
        size={10}
        variant="semiBold"
        containerStyle={styles.guestsLabel}>
        {t('PROPERTY_DETAIL.GUESTS')}
      </StyledText>
      <GuestStepper
        title={t('PROPERTY_DETAIL.ADULTS')}
        hint={t('PROPERTY_DETAIL.ADULTS_HINT')}
        value={adults}
        min={1}
        max={maxAdults}
        onChange={onAdultsChange}
      />
      <GuestStepper
        title={t('PROPERTY_DETAIL.CHILDREN')}
        hint={t('PROPERTY_DETAIL.CHILDREN_HINT')}
        value={children}
        min={0}
        max={maxChildren}
        onChange={onChildrenChange}
      />

      <TouchableOpacity
        accessibilityRole="button"
        onPress={onChatPress}
        style={styles.chatButton}>
        <WhatsAppIcon color={COLORS.WHITE} size={18} />
        <StyledText color={COLORS.WHITE} variant="semiBold" size={14}>
          {t('PROPERTY_DETAIL.CHAT_WITH_OWNER')}
        </StyledText>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(PropertyInquiryCard);
