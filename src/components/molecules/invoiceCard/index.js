import React, {useCallback, useMemo, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Popover, {PopoverPlacement} from 'react-native-popover-view';
import {StyledText} from '../../atoms';
import {MoreIcon} from '../../svgs';
import {COLORS} from '../../../constants';
import {INVOICE_MENU_ACTION, INVOICE_MENU_ITEMS} from './config';
import styles from './styles';

const MENU_ICON_SIZE = 18;

const formatDisplayName = value =>
  String(value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');

const InvoiceCard = ({
  id,
  initials,
  name,
  status,
  statusType,
  isPaid = false,
  dates,
  stayDetails,
  amount,
  settlement,
  onMenuAction,
}) => {
  const {t} = useTranslation();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const isDraft = statusType === 'draft';
  const displayName = useMemo(() => formatDisplayName(name), [name]);

  const menuItems = useMemo(
    () =>
      INVOICE_MENU_ITEMS.map(item => {
        if (item.action !== INVOICE_MENU_ACTION.MARK_PAID) {
          return item;
        }

        return {
          ...item,
          labelKey: isPaid
            ? 'INVOICES.MENU_MARK_VIEWED'
            : 'INVOICES.MENU_MARK_PAID',
        };
      }),
    [isPaid],
  );

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

  return (
    <View style={styles.card}>
      <View style={styles.accent} />
      <View style={styles.content}>
        <View style={styles.avatar}>
          <StyledText
            variant="bold"
            size={14}
            color={COLORS.INVOICE_AVATAR_TEXT}>
            {initials}
          </StyledText>
        </View>

        <View style={styles.details}>
          <View style={styles.nameRow}>
            <StyledText
              variant="bold"
              size={15}
              numberOfLines={1}
              containerStyle={styles.name}>
              {displayName}
            </StyledText>
            <View
              style={[
                styles.badge,
                isDraft ? styles.draftBadge : styles.paidBadge,
              ]}>
              <StyledText
                variant="semiBold"
                size={10}
                color={
                  isDraft ? COLORS.INVOICE_DRAFT_TEXT : COLORS.INVOICE_PAID_TEXT
                }>
                {status}
              </StyledText>
            </View>
          </View>
          <StyledText
            color={COLORS.TEXT_SECONDARY}
            size={12}
            containerStyle={styles.dates}
            numberOfLines={1}>
            {dates}
          </StyledText>
          <StyledText color={COLORS.TEXT_MUTED} size={11} numberOfLines={1}>
            {stayDetails}
          </StyledText>
        </View>

        <View style={styles.amountColumn}>
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
                accessibilityLabel={t('INVOICES.MORE_OPTIONS')}
                hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
                onPress={handleOpenMenu}
                style={styles.menuButton}>
                <MoreIcon color={COLORS.GREYSCALE_900} />
              </TouchableOpacity>
            }>
            <View style={styles.menuList}>
              {menuItems.map(item => {
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
          <StyledText
            variant="bold"
            size={12}
            containerStyle={styles.amount}>
            {amount}
          </StyledText>
          <StyledText
            textStyle={isDraft ? styles.dueText : styles.settledText}>
            {settlement}
          </StyledText>
        </View>
      </View>
    </View>
  );
};

export {INVOICE_MENU_ACTION} from './config';
export default React.memo(InvoiceCard);
