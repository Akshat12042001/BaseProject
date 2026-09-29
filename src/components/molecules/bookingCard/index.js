import React, {useCallback, useMemo, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Popover, {PopoverPlacement} from 'react-native-popover-view';
import {StyledText} from '../../atoms';
import {BuildingIcon, MoreIcon, TagIcon} from '../../svgs';
import {COLORS} from '../../../constants';
import {
  formatCurrency,
  formatDateRange,
  getStayNights,
} from '../../../utils/invoice';
import {BOOKING_MENU_ITEMS} from './config';
import styles from './styles';

const MENU_ICON_SIZE = 18;

const BookingCard = ({
  id,
  homestayTitle,
  guestName,
  guestPhone,
  checkIn,
  checkOut,
  offeredPrice,
  adults = 0,
  onPress,
  onMenuAction,
}) => {
  const {t} = useTranslation();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const guestLine = useMemo(() => {
    const name = String(guestName || '').trim();
    const phone = String(guestPhone || '').trim();

    if (name && phone) {
      return `${name} · ${phone}`;
    }

    return name || phone;
  }, [guestName, guestPhone]);

  const dateRange = useMemo(
    () => formatDateRange(checkIn, checkOut),
    [checkIn, checkOut],
  );

  const staySummary = useMemo(() => {
    const nights = getStayNights(checkIn, checkOut);
    const nightLabel = t(
      nights === 1 ? 'BOOKING_LIST.NIGHT_ONE' : 'BOOKING_LIST.NIGHT_OTHER',
      {count: nights},
    );
    const adultLabel = t(
      adults === 1 ? 'BOOKING_LIST.ADULT_ONE' : 'BOOKING_LIST.ADULT_OTHER',
      {count: adults},
    );

    return `${nightLabel} · ${formatCurrency(offeredPrice)} · ${adultLabel}`;
  }, [adults, checkIn, checkOut, offeredPrice, t]);

  const handlePress = useCallback(() => {
    onPress?.(id);
  }, [id, onPress]);

  const handleOpenMenu = useCallback(() => {
    setIsMenuVisible(true);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setIsMenuVisible(false);
  }, []);

  const handleMenuItemPress = useCallback(
    action => {
      setIsMenuVisible(false);
      onMenuAction?.(action, id);
    },
    [id, onMenuAction],
  );

  const CardWrapper = onPress ? TouchableOpacity : View;
  const cardWrapperProps = onPress
    ? {activeOpacity: 0.85, onPress: handlePress}
    : {};

  return (
    <CardWrapper {...cardWrapperProps} style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.homestayIcon}>
          <BuildingIcon color={COLORS.TEXT_MUTED} size={18} />
        </View>
        <View style={styles.topContent}>
          <StyledText variant="bold" size={15} containerStyle={styles.homestayTitle}>
            {homestayTitle}
          </StyledText>
          <StyledText
            color={COLORS.TEXT_MUTED}
            size={12}
            numberOfLines={1}
            containerStyle={styles.guestLine}>
            {guestLine}
          </StyledText>
        </View>
        <Popover
          isVisible={isMenuVisible}
          arrowSize={{width: 0, height: 0}}
          backgroundStyle={styles.popoverBackdrop}
          displayAreaInsets={{top: 16, bottom: 16, left: 16, right: 16}}
          onRequestClose={handleCloseMenu}
          placement={PopoverPlacement.BOTTOM}
          popoverStyle={styles.popover}
          from={
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={t('BOOKING_LIST.MORE_OPTIONS')}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
              onPress={handleOpenMenu}
              style={styles.menuButton}>
              <MoreIcon color={COLORS.GREYSCALE_900} />
            </TouchableOpacity>
          }>
          <View style={styles.menuList}>
            {BOOKING_MENU_ITEMS.map(item => {
              const iconColor = item.destructive
                ? COLORS.INVOICE_DELETE
                : COLORS.GREYSCALE_900;
              const textColor = item.destructive
                ? COLORS.INVOICE_DELETE
                : COLORS.TEXT;

              return (
                <TouchableOpacity
                  key={item.action}
                  accessibilityRole="button"
                  onPress={() => handleMenuItemPress(item.action)}
                  style={styles.menuItem}>
                  <View style={styles.menuItemIcon}>
                    <item.Icon color={iconColor} size={MENU_ICON_SIZE} />
                  </View>
                  <StyledText
                    color={textColor}
                    size={14}
                    variant="medium"
                    containerStyle={styles.menuItemLabel}>
                    {t(item.labelKey)}
                  </StyledText>
                </TouchableOpacity>
              );
            })}
          </View>
        </Popover>
      </View>

      <View style={styles.bookingSection}>
        <View style={styles.tagIcon}>
          <TagIcon color={COLORS.LOGIN_PRIMARY} size={18} />
        </View>
        <View style={styles.bookingContent}>
          <StyledText
            variant="medium"
            size={13}
            numberOfLines={1}
            containerStyle={styles.dateRange}>
            {dateRange}
          </StyledText>
          <StyledText
            color={COLORS.TEXT_MUTED}
            size={12}
            numberOfLines={1}
            containerStyle={styles.staySummary}>
            {staySummary}
          </StyledText>
        </View>
      </View>
    </CardWrapper>
  );
};

export {BOOKING_MENU_ACTION} from './config';
export default React.memo(BookingCard);
