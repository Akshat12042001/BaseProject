import React, {useCallback} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { StyledText } from '../../atoms';
import { COLORS, NAVIGATION } from '../../../constants';
import { HomeIcon, InvoicesIcon, PropertyIcon, MoreIcon, MenuIcon } from '../../svgs';

const CustomTabBar = ({state, navigation}) => {
  const insets = useSafeAreaInsets();
  const {t} = useTranslation();


  const onPress = useCallback(
    (route, index) => {
      const isFocused = state?.index === index;
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
      });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    },
    [state.index, navigation],
  );

  const onLongPress = useCallback(
    route => {
      navigation.emit({
        target: route.key,
        type: 'tabLongPress',
      });
    },
    [navigation],
  );

  const getIcon = (route, isFocused) => {
    const color = isFocused ? COLORS.SUCCESS : COLORS.TEXT_MUTED;
    switch (route.name) {
      case NAVIGATION.TABS.HOME_SCREEN:
        return <HomeIcon color={color}/>;
      case NAVIGATION.TABS.MENU_SCREEN:
        return <MenuIcon color={color}/>;
      case NAVIGATION.TABS.INVOICES_SCREEN:
        return <InvoicesIcon color={color}/>;
      case NAVIGATION.TABS.PROPERTIES_SCREEN:
        return <PropertyIcon color={color}/>;
      case NAVIGATION.TABS.MORE_SCREEN:
        return <MoreIcon color={color}/>;
      default:
        return null;
    }
  };

  return (
    <View style={{paddingBottom: insets.bottom || 10, borderTopWidth:1, borderTopColor:COLORS.BORDER, paddingTop:10, backgroundColor:COLORS.BACKGROUND}}>
      <View style={styles.tabRow}>
        {state.routes.map((route, index) => {
          const isFocused = state?.index === index;
          return (
            <TouchableOpacity
              key={route?.name}
              accessibilityRole="button"
              accessibilityState={{selected: isFocused}}
              accessibilityLabel={route.name}
              activeOpacity={0.75}
              style={styles.tabHit}
              onPress={onPress.bind(null, route, index)}
              onLongPress={onLongPress.bind(null, route)}>
              <View style={styles.tabColumn}>
                {getIcon(route, isFocused)}
                <StyledText color={isFocused ? COLORS.SUCCESS : COLORS.TEXT_MUTED} variant="bold" size={12}>{t(route.params.title)}</StyledText>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CustomTabBar;
