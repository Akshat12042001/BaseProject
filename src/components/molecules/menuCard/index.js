import React, {useCallback, useState} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Popover, {PopoverPlacement} from 'react-native-popover-view';
import {AnimatedSwitch, StyledText} from '../../atoms';
import {ClockIcon, MoreIcon} from '../../svgs';
import {COLORS} from '../../../constants';
import {MENU_CARD_ITEMS} from './config';
import styles from './styles';

const MENU_ICON_SIZE = 18;

const MenuCard = ({
  id,
  title,
  description,
  updated,
  templateImage,
  isActive = false,
  isActiveUpdating = false,
  onActiveChange,
  onMenuAction,
}) => {
  const {t} = useTranslation();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

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

  const handleActivePress = useCallback(
    nextValue => {
      onActiveChange?.(id, nextValue);
    },
    [id, onActiveChange],
  );

  return (
    <View style={styles.card}>
      <Image
        source={templateImage}
        style={styles.templateImage}
        resizeMode="cover"
      />
      <View style={styles.details}>
        <View style={styles.titleRow}>
          <StyledText
            variant="bold"
            size={16}
            numberOfLines={1}
            containerStyle={styles.title}>
            {title}
          </StyledText>
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
                accessibilityLabel={t('MENU.MORE_OPTIONS')}
                hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
                onPress={handleOpenMenu}
                style={styles.menuButton}>
                <MoreIcon color={COLORS.GREYSCALE_900} />
              </TouchableOpacity>
            }>
            <View style={styles.menuList}>
              {MENU_CARD_ITEMS.map(item => {
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

        <StyledText
          color={COLORS.TEXT_SECONDARY}
          size={12}
          numberOfLines={1}
          containerStyle={styles.description}>
          {description}
        </StyledText>

        <View style={styles.activeRow}>
          <StyledText
            color={COLORS.LOGIN_PRIMARY}
            size={13}
            variant="medium"
            containerStyle={styles.activeLabel}>
            {t('MENU.ACTIVE_MENU')}
          </StyledText>
          <AnimatedSwitch
            accessibilityLabel={t('MENU.ACTIVE_MENU')}
            disabled={isActiveUpdating}
            onPress={handleActivePress}
            thumbColor={COLORS.LOGIN_PRIMARY}
            trackColors={{
              on: '#397D2D80',
              off: COLORS.BORDER_LIGHT,
            }}
            value={isActive}
          />
        </View>

        {!!updated && (
          <View style={styles.updatedRow}>
            <ClockIcon />
            <StyledText
              color={COLORS.TEXT_MUTED}
              size={10}
              containerStyle={styles.updatedText}
              numberOfLines={1}>
              {updated}
            </StyledText>
          </View>
        )}
      </View>
    </View>
  );
};

export {MENU_CARD_ACTION} from './config';
export default React.memo(MenuCard);
