import React, {useCallback, useMemo, useRef, useState} from 'react';
import {FlatList, ScrollView, TouchableOpacity, View} from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';
import {useTranslation} from 'react-i18next';
import {ScreenContainer, StyledText} from '../../../components/atoms';
import {DeletePropertyModal} from '../../../components/modals';
import {PROPERTY_CARD_ACTION, PropertyCard} from '../../../components/molecules';
import {
  ArrowRightIcon,
  BellIcon,
  BrushIcon,
  BuildingIcon,
  CalendarIcon,
  MenuIcon,
  ReceiptIcon,
  StarIcon,
  UserPlusIcon,
} from '../../../components/svgs';
import {COLORS, NAVIGATION, SCREEN} from '../../../constants';
import styles from './styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useGetDashboardQuery, useGetNotificationsQuery} from '../../../redux/tabs/api';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {makeMeRequest} from '../../../api/auth';
import {makeDeleteHomestayRequest} from '../../../api/common';
import {setUserData} from '../../../redux/auth/auth.reducer';
import {errorToast, successToast} from '../../../utils/alerts';
import {getTimeBasedGreetingKey} from '../../../utils/greeting';
import {formatCurrency} from '../../../utils/invoice';

const NOTIFICATION_QUERY = {limit: 10, page: 1};
const POPOVER_CLOSE_DELAY_MS = 500;

const STATS_SKELETON_LAYOUT = [
  {
    key: 'stats-row-one',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    children: [
      {
        key: 'stat-card-0',
        width: SCREEN.WIDTH / 2 - 28,
        height: 88,
        borderRadius: 12,
      },
      {
        key: 'stat-card-1',
        width: SCREEN.WIDTH / 2 - 28,
        height: 88,
        borderRadius: 12,
      },
    ],
  },
  {
    key: 'stats-row-two',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    children: [
      {
        key: 'stat-card-2',
        width: SCREEN.WIDTH / 2 - 28,
        height: 88,
        borderRadius: 12,
      },
      {
        key: 'stat-card-3',
        width: SCREEN.WIDTH / 2 - 28,
        height: 88,
        borderRadius: 12,
      },
    ],
  },
];

const PROPERTY_CARD_WIDTH = SCREEN.WIDTH / 2 - 14;
const PROPERTY_CARD_HEIGHT = 164;

const PROPERTIES_SKELETON_LAYOUT = [
  {
    key: 'property-row',
    flexDirection: 'row',
    children: [
      {
        key: 'property-one',
        width: PROPERTY_CARD_WIDTH,
        height: PROPERTY_CARD_HEIGHT,
        borderRadius: 12,
        marginRight: 10,
      },
    ],
  },
];

const keyExtractor = item => item.id;

const HomeScreen = () => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {data: dashboardData, isLoading, refetch: refetchDashboard} =
    useGetDashboardQuery();
  const {data: notificationsResponse, refetch: refetchNotifications} =
    useGetNotificationsQuery(NOTIFICATION_QUERY);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const userRef = useRef(user);
  userRef.current = user;
  const recentProperties = dashboardData?.recentProperties || [];
  const [greetingKey, setGreetingKey] = useState(getTimeBasedGreetingKey);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingPropertyId, setDeletingPropertyId] = useState(null);
  const [isMeLoading, setIsMeLoading] = useState(() => !user?.quickStats);

  const quickStats = user?.quickStats || {};
  const hasUnreadNotifications = useMemo(
    () =>
      (notificationsResponse?.data || []).some(
        notification => notification?.status === false,
      ),
    [notificationsResponse],
  );

  const quickStatsData = useMemo(
    () => [
      {
        id: 'properties',
        label: t('HOME.STATS.PROPERTIES'),
        value: String(quickStats?.activeProperties || 0),
        subtitle: t('HOME.STATS.ACTIVE'),
        Icon: BuildingIcon,
        iconColor: COLORS.LOGIN_PRIMARY,
        iconBackground: '#EDF4EF',
        valueColor: COLORS.LOGIN_PRIMARY,
      },
      {
        id: 'bookings',
        label: t('HOME.STATS.UPCOMING_BOOKINGS'),
        value: String(quickStats?.upcomingBookings ?? 0),
        subtitle: t('HOME.STATS.NEXT_7_DAYS'),
        Icon: CalendarIcon,
        iconColor: '#2F6FED',
        iconBackground: '#EAF1FF',
        valueColor: '#2F6FED',
      },
      {
        id: 'bills',
        label: t('HOME.STATS.BILLS_THIS_MONTH'),
        value: formatCurrency(
          quickStats?.billsThisMonth?.total ??
            quickStats?.billsThisMonth?.amount ??
            0,
        ),
        subtitle: t('HOME.STATS.BILLS_COUNT', {
          count: quickStats?.billsThisMonth?.count || 0,
        }),
        Icon: ReceiptIcon,
        iconColor: '#D46D58',
        iconBackground: '#FDEFEA',
        valueColor: '#D46D58',
      },
      {
        id: 'rewards',
        label: t('HOME.STATS.REWARDS'),
        value: String(
          quickStats?.rewardsPoints ??
            quickStats?.rewardPoints ??
            quickStats?.rewards ??
            0,
        ),
        subtitle: t('HOME.STATS.POINTS'),
        Icon: StarIcon,
        iconColor: '#C9A227',
        iconBackground: '#FBF4DF',
        valueColor: '#C9A227',
      },
    ],
    [quickStats, t],
  );

  const quickStatRows = useMemo(
    () => [quickStatsData.slice(0, 2), quickStatsData.slice(2, 4)],
    [quickStatsData],
  );

  const manageTools = useMemo(
    () => [
      {
        id: 'logo',
        title: t('HOME.MANAGE_HOMESTAY.LOGO_TITLE'),
        description: t('HOME.MANAGE_HOMESTAY.LOGO_DESC'),
        Icon: BrushIcon,
        color: '#6B4EAA',
        background: '#F0EBFA',
        onPress: () =>
          navigation.navigate(NAVIGATION.STACKS.COMMON, {
            screen: NAVIGATION.COMMON.CREATE_LOGO_SCREEN,
          }),
      },
      {
        id: 'menu',
        title: t('HOME.MANAGE_HOMESTAY.MENU_TITLE'),
        description: t('HOME.MANAGE_HOMESTAY.MENU_DESC'),
        Icon: MenuIcon,
        color: COLORS.LOGIN_PRIMARY,
        background: '#EDF4EF',
        onPress: () => navigation.navigate(NAVIGATION.TABS.MENU_SCREEN),
      },
      {
        id: 'bills',
        title: t('HOME.MANAGE_HOMESTAY.BILLS_TITLE'),
        description: t('HOME.MANAGE_HOMESTAY.BILLS_DESC'),
        Icon: ReceiptIcon,
        color: '#E07A4F',
        background: '#FDEFEA',
        onPress: () => navigation.navigate(NAVIGATION.TABS.INVOICES_SCREEN),
      },
      {
        id: 'bookings',
        title: t('HOME.MANAGE_HOMESTAY.BOOKINGS_TITLE'),
        description: t('HOME.MANAGE_HOMESTAY.BOOKINGS_DESC'),
        Icon: UserPlusIcon,
        color: '#2F6FED',
        background: '#EAF1FF',
        onPress: () => navigation.navigate(NAVIGATION.STACKS.COMMON,{
          screen: NAVIGATION.COMMON.CREATE_BOOKING_SCREEN,
        }),
      },
    ],
    [navigation, t],
  );

  const manageToolRows = useMemo(
    () => [manageTools.slice(0, 2), manageTools.slice(2, 4)],
    [manageTools],
  );

  const headerStyle = useMemo(
    () => [styles.header, {paddingTop: insets.top || 20}],
    [insets.top],
  );

  const fetchMe = useCallback(async () => {
    const currentUser = userRef.current;
    if (!currentUser?.accessToken) {
      return;
    }

    try {
      if (!currentUser?.quickStats) {
        setIsMeLoading(true);
      }

      const response = await makeMeRequest();
      dispatch(
        setUserData({
          ...response,
          accessToken: currentUser.accessToken,
          refreshToken: currentUser.refreshToken,
        }),
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsMeLoading(false);
    }
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      setGreetingKey(getTimeBasedGreetingKey());
      fetchMe();
      refetchDashboard();
      refetchNotifications();
    }, [fetchMe, refetchDashboard, refetchNotifications]),
  );

  const openPropertyDetail = useCallback(
    (propertyId, isListingView = false) => {
      navigation.navigate(NAVIGATION.STACKS.COMMON, {
        screen: NAVIGATION.COMMON.PROPERTY_DETAIL_SCREEN,
        params: {propertyId, isListingView},
      });
    },
    [navigation],
  );

  const handleCloseDeleteModal = useCallback(() => {
    if (deletingPropertyId) {
      return;
    }
    setDeleteTarget(null);
  }, [deletingPropertyId]);

  const handleConfirmDelete = useCallback(async () => {
    const propertyId = deleteTarget?.id;

    if (!propertyId || deletingPropertyId) {
      return;
    }

    try {
      setDeletingPropertyId(propertyId);
      const response = await makeDeleteHomestayRequest(propertyId);
      successToast(response?.message || t('PROPERTIES.DELETE_SUCCESS'));
      setDeleteTarget(null);
      refetchDashboard();
    } catch (error) {
      if (!error?.response?.data?.message) {
        errorToast(t('PROPERTIES.DELETE_FAILED'));
      }
    } finally {
      setDeletingPropertyId(null);
    }
  }, [deleteTarget?.id, deletingPropertyId, refetchDashboard, t]);

  const handlePropertyMenuAction = useCallback(
    (action, propertyId) => {
      if (action === PROPERTY_CARD_ACTION.PREVIEW) {
        openPropertyDetail(propertyId);
        return;
      }

      if (action === PROPERTY_CARD_ACTION.VIEW_LISTING) {
        openPropertyDetail(propertyId, true);
        return;
      }

      if (action === PROPERTY_CARD_ACTION.EDIT) {
        navigation.navigate(NAVIGATION.STACKS.COMMON, {
          screen: NAVIGATION.COMMON.CREATE_LISTING_SCREEN,
          params: {listingId: propertyId},
        });
        return;
      }

      if (action !== PROPERTY_CARD_ACTION.DELETE) {
        return;
      }

      const property = recentProperties.find(item => item.id === propertyId);
      setTimeout(() => {
        setDeleteTarget({
          id: propertyId,
          listingName: property?.title || '',
        });
      }, POPOVER_CLOSE_DELAY_MS);
    },
    [navigation, openPropertyDetail, recentProperties],
  );

  const renderProperty = useCallback(
    ({item}) => (
      <PropertyCard
        compact
        id={item.id}
        title={item.title}
        city={item.city}
        totalBedrooms={item.totalBedrooms}
        imageUrl={item.primaryImageUrl}
        placeholder={t('HOME.PROPERTY_PHOTO')}
        onPress={() => openPropertyDetail(item.id)}
        onMenuAction={handlePropertyMenuAction}
      />
    ),
    [handlePropertyMenuAction, openPropertyDetail, t],
  );

  const handleQuickStatPress = useCallback(
    (id) => {
      switch (id) {
        case 'properties':
          navigation.navigate(NAVIGATION.TABS.PROPERTIES_SCREEN);
          break;
        case 'bookings':
          navigation.navigate(NAVIGATION.STACKS.COMMON,{
            screen: NAVIGATION.COMMON.BOOKING_SCREEN,
          });
          break;
        case 'bills':
          navigation.navigate(NAVIGATION.TABS.INVOICES_SCREEN);
          break;
        case 'rewards':
          navigation.navigate(NAVIGATION.STACKS.COMMON,{
            screen: NAVIGATION.COMMON.REWARDS_SCREEN,
          });
          break;
      }
    },
    [navigation],
  );

  const renderQuickStatCard = useCallback(
    ({
      label,
      value,
      subtitle,
      Icon,
      iconColor,
      iconBackground,
      valueColor,
      onPress
    }) => (
      <TouchableOpacity style={styles.quickStatCard} onPress={onPress}>
        <View style={[styles.quickStatIconWrap, {backgroundColor: iconBackground}]}>
          <Icon color={iconColor} size={15} />
        </View>
        <StyledText
          color={COLORS.TEXT_SECONDARY}
          size={9}
          variant="medium"
          textStyle={styles.quickStatLabel}>
          {label}
        </StyledText>
        <StyledText
          variant="bold"
          size={16}
          color={valueColor}
          textStyle={styles.quickStatValue}>
          {value}
        </StyledText>
        <StyledText color={COLORS.TEXT_MUTED} size={9} variant="medium">
          {subtitle}
        </StyledText>
      </TouchableOpacity>
    ),
    [],
  );

  const renderManageTool = useCallback(
    ({title, description, Icon, color, background, onPress}) => (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={styles.manageToolCard}>
        <View style={[styles.manageToolIconWrap, {backgroundColor: background}]}>
          <Icon color={color} size={15} />
        </View>
        <View style={styles.manageToolCopy}>
          <StyledText variant="bold" size={11} numberOfLines={1}>
            {title}
          </StyledText>
          <StyledText color={COLORS.TEXT_SECONDARY} size={8} numberOfLines={2}>
            {description}
          </StyledText>
        </View>
        <View style={[styles.manageToolAction, {backgroundColor: color}]}>
          <ArrowRightIcon color={COLORS.WHITE} size={12} />
        </View>
      </TouchableOpacity>
    ),
    [],
  );

  return (
    <ScreenContainer noPaddingTop noPaddingBottom>
      <View style={styles.screen}>
        <View style={headerStyle}>
          <View style={styles.greetingRow}>
            <View style={styles.greetingText}>
              <StyledText color={COLORS.TEXT_SECONDARY} size={10}>
                {moment().format('dddd, MMMM D')}
              </StyledText>
              <StyledText
                color={COLORS.SURFACE}
                variant="bold"
                size={24}
                lineHeight={28}
                containerStyle={styles.greeting}>
                {t(greetingKey, {name: user?.firstName})}
              </StyledText>
            </View>
            <TouchableOpacity style={styles.notification} onPress={() => navigation.navigate(NAVIGATION.STACKS.COMMON,{
              screen: NAVIGATION.COMMON.NOTIFICATION_SCREEN,
            })}>
              <BellIcon showIndicator={hasUnreadNotifications} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <Skeleton
            isLoading={isMeLoading}
            layout={STATS_SKELETON_LAYOUT}
            boneColor={COLORS.SKELETON_BONE}
            highlightColor={COLORS.SKELETON_HIGHLIGHT}
            containerStyle={styles.statsSkeletonContainer}>
            <View style={styles.quickStatsCard}>
              <StyledText variant="bold" size={12} textStyle={styles.quickStatsTitle}>
                {t('HOME.QUICK_STATS')}
              </StyledText>

              <View style={styles.quickStatsGrid}>
                {quickStatRows.map((row, rowIndex) => (
                  <View
                    key={`quick-stats-row-${rowIndex}`}
                    style={[
                      styles.quickStatsRow,
                      rowIndex > 0 && styles.quickStatsRowSpacing,
                    ]}>
                    {row.map(stat => (
                      <View key={stat.id} style={styles.quickStatWrapper}>
                        {renderQuickStatCard({...stat, onPress: () => handleQuickStatPress(stat.id)})}
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </View>
          </Skeleton>

          <View style={styles.manageSection}>
            <StyledText variant="bold" size={12} textStyle={styles.manageTitle}>
              {t('HOME.MANAGE_HOMESTAY.TITLE')}
            </StyledText>
            <StyledText color={COLORS.TEXT_SECONDARY} size={11} containerStyle={styles.manageSubtitle}>
              {t('HOME.MANAGE_HOMESTAY.SUBTITLE')}
            </StyledText>

            <View style={styles.manageGrid}>
              {manageToolRows.map((row, rowIndex) => (
                <View
                  key={`manage-row-${rowIndex}`}
                  style={[styles.manageRow, rowIndex > 0 && styles.manageRowSpacing]}>
                  {row.map(tool => (
                    <View key={tool.id} style={styles.manageToolWrapper}>
                      {renderManageTool(tool)}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <StyledText variant="bold" size={18}>
              {t('HOME.YOUR_PROPERTIES')}
            </StyledText>
            <StyledText
              color={COLORS.SUCCESS}
              variant="bold"
              size={12}
              onPress={() => navigation.navigate(NAVIGATION.TABS.PROPERTIES_SCREEN)}>
              {t('HOME.SEE_ALL')}
            </StyledText>
          </View>

          <Skeleton
            isLoading={isLoading}
            layout={PROPERTIES_SKELETON_LAYOUT}
            boneColor={COLORS.SKELETON_BONE}
            highlightColor={COLORS.SKELETON_HIGHLIGHT}
            containerStyle={styles.propertiesSkeletonContainer}>
            {recentProperties.length ? (
              <FlatList
                horizontal
                data={recentProperties}
                renderItem={renderProperty}
                keyExtractor={keyExtractor}
                initialNumToRender={2}
                maxToRenderPerBatch={4}
                windowSize={3}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.propertyList}
              />
            ) : (
              <View style={styles.emptyProperties}>
                <StyledText color={COLORS.TEXT_SECONDARY} size={13}>
                  {t('HOME.NO_DATA_FOUND')}
                </StyledText>
              </View>
            )}
          </Skeleton>
        </ScrollView>
      </View>

      <DeletePropertyModal
        isVisible={Boolean(deleteTarget)}
        listingName={deleteTarget?.listingName}
        isDeleting={Boolean(deletingPropertyId)}
        onCancel={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </ScreenContainer>
  );
};

export default HomeScreen;
