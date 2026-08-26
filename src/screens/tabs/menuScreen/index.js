import React, {useCallback, useMemo} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {ScreenContainer, StyledText} from '../../../components/atoms';
import {MenuCard} from '../../../components/molecules';
import {PlusIcon} from '../../../components/svgs';
import {COLORS, NAVIGATION} from '../../../constants';
import {useGetFoodMenuQuery} from '../../../redux/tabs';
import {
  formatMenuDescription,
  formatMenuUpdatedAt,
  getFoodMenus,
  getMenuTemplateImage,
} from '../../../utils/menu';
import styles from './styles';

const keyExtractor = item => item.id;

const MenuSeparator = () => <View style={styles.separator} />;

const MenuScreen = () => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {
    data: foodMenuResponse,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetFoodMenuQuery();

  const menus = useMemo(
    () => getFoodMenus(foodMenuResponse),
    [foodMenuResponse],
  );

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const headerStyle = useMemo(
    () => [styles.header, {paddingTop: insets.top || 20, paddingBottom: 20}],
    [insets.top],
  );

  const subtitle = t('MENU.SUBTITLE', {count: menus.length});

  const handleCreateMenu = useCallback(() => {
    navigation.navigate(NAVIGATION.STACKS.COMMON, {
      screen: NAVIGATION.COMMON.CREATE_MENU_SCREEN,
    });
  }, [navigation]);

  const handleMenuPress = useCallback(
    id => {
      navigation.navigate(NAVIGATION.STACKS.COMMON, {
        screen: NAVIGATION.COMMON.CREATE_MENU_SCREEN,
        params: {menuId: id},
      });
    },
    [navigation],
  );

  const renderMenu = useCallback(
    ({item}) => (
      <MenuCard
        title={item.title}
        description={formatMenuDescription(item, t)}
        updated={formatMenuUpdatedAt(item.updatedAt)}
        templateImage={getMenuTemplateImage(item.templateId)}
        onPress={() => handleMenuPress(item.id)}
      />
    ),
    [handleMenuPress, t],
  );

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator color={COLORS.LOGIN_PRIMARY} size="large" />
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <StyledText color={COLORS.TEXT_SECONDARY} size={13}>
          {isError ? t('MENU.LOAD_ERROR') : t('MENU.EMPTY')}
        </StyledText>
      </View>
    );
  }, [isError, isLoading, t]);

  return (
    <ScreenContainer noPaddingTop noPaddingBottom>
      <View style={styles.screen}>
        <View style={headerStyle}>
          <View style={styles.topRow}>
            <StyledText color={COLORS.SURFACE} variant="bold" size={20}>
              {t('MENU.TITLE')}
            </StyledText>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={handleCreateMenu}
              style={styles.newButton}>
              <PlusIcon />
              <StyledText color={COLORS.PRIMARY} variant="bold" size={12}>
                {t('MENU.NEW')}
              </StyledText>
            </TouchableOpacity>
          </View>
          <StyledText
            color={COLORS.HEADER_TEXT_MUTED}
            size={12}
            containerStyle={styles.subtitle}>
            {subtitle}
          </StyledText>
        </View>

        <FlatList
          data={menus}
          renderItem={renderMenu}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={MenuSeparator}
          ListEmptyComponent={renderEmpty}
          // refreshControl={
          //   <RefreshControl
          //     refreshing={isFetching && !isLoading}
          //     onRefresh={refetch}
          //     tintColor={COLORS.LOGIN_PRIMARY}
          //   />
          // }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.list,
            !menus.length && styles.emptyList,
          ]}
        />
      </View>
    </ScreenContainer>
  );
};

export default MenuScreen;
