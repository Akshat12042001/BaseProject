import React, {useCallback, useEffect, useMemo} from 'react';
import {FlatList, ScrollView, TouchableOpacity, View} from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';
import {useTranslation} from 'react-i18next';
import {ScreenContainer, StyledText} from '../../../components/atoms';
import {PropertyCard} from '../../../components/molecules';
import {
  ArrowRightIcon,
  BellIcon,
  ImageIcon,
  MenuIcon,
  PropertyIcon,
  ReceiptIcon,
} from '../../../components/svgs';
import {COLORS, NAVIGATION, SCREEN} from '../../../constants';
import styles from './styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetDashboardQuery } from '../../../redux/tabs/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { makeMeRequest } from '../../../api/auth';
import { setUserData } from '../../../redux/auth/auth.reducer';

const QUICK_ACTIONS = [
  {translationKey: 'HOME.QUICK_ACTIONS.MENU', Icon: MenuIcon, type: 'menu'},
  {translationKey: 'HOME.QUICK_ACTIONS.PROPERTIES', Icon: PropertyIcon, type: 'properties'},
  {translationKey: 'HOME.QUICK_ACTIONS.LOGO', Icon: ImageIcon, type: 'logo'},
];

const CONTENT_WIDTH = SCREEN.WIDTH - 28;
const STAT_WIDTH = CONTENT_WIDTH / 3;

const STATS_SKELETON_LAYOUT = [
  {
    key: 'stats-row',
    flexDirection: 'row',
    marginTop: 14,
    children: [
      {key: 'invoice-stat', width: STAT_WIDTH, height: 77, borderRadius: 12},
      {key: 'property-stat', width: STAT_WIDTH, height: 77},
      {key: 'menu-stat', width: STAT_WIDTH, height: 77, borderRadius: 12},
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
  const {data: dashboardData, isLoading, refetch: refetchDashboard} = useGetDashboardQuery();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const recentProperties = dashboardData?.recentProperties || [];


const STATS_DATA = useMemo(() => [
  {value: dashboardData?.quickStats?.billsThisMonth?.count || 0, translationKey: 'HOME.STATS.INVOICES'},
  {value: dashboardData?.quickStats?.activeProperties || 0, translationKey: 'HOME.STATS.PROPERTIES'},
  {value: dashboardData?.quickStats?.totalMenuItems || 0, translationKey: 'HOME.STATS.MENU_ITEMS'},
], [dashboardData]);
  const headerStyle = useMemo(
    () => [styles.header, {paddingTop: insets.top || 20}],
    [insets.top],
  );


  useFocusEffect(useCallback(() => {
    refetchDashboard();
  }, [refetchDashboard]));

const fetchMe = useCallback(async () => {
  try {
    const response = await makeMeRequest();
    const userData = {...response, accessToken: user?.accessToken, refreshToken: user?.refreshToken};
    dispatch(setUserData(userData));
  } catch (error) {
    console.log(error);
  }
}, [dispatch]);

useEffect(() => {
  fetchMe();
}, []);

  const renderProperty = useCallback(
    ({item}) => (
      <PropertyCard
        compact
        title={item.title}
        city={item.city}
        totalBedrooms={item.totalBedrooms}
        imageUrl={item.primaryImageUrl}
        placeholder={t('HOME.PROPERTY_PHOTO')}
      />
    ),
    [t],
  );

 const handleQuickAction = useCallback((type) => {
  switch (type) {
    case 'menu':
      navigation.navigate(NAVIGATION.TABS.MENU_SCREEN);
      break;
    case 'properties':
      navigation.navigate(NAVIGATION.TABS.PROPERTIES_SCREEN);
      break;
    case 'logo':
      navigation.navigate(NAVIGATION.TABS.MORE_SCREEN);
      break;
  }
}, [navigation]);

  return (
    <ScreenContainer noPaddingTop noPaddingBottom>
      <View style={[styles.screen]}>
        <View style={headerStyle}>
          <View style={styles.brandRow}>
            <View>
              <StyledText variant='bold' size={18} color={COLORS.SURFACE}>{t('HOME.BRAND')}</StyledText>
              <StyledText variant='medium' size={10} color={COLORS.TEXT_SECONDARY}>{t('HOME.TAGLINE')}</StyledText>
            </View>
            <View style={styles.notification}>
              <BellIcon />
            </View>
          </View>
          <StyledText
            color={COLORS.TEXT_SECONDARY}
            size={10}
            containerStyle={styles.date}>
            {moment().format('dddd, MMMM D')}
          </StyledText>
          <StyledText
            color={COLORS.SURFACE}
            variant="bold"
            size={24}
            lineHeight={28}
            containerStyle={styles.greeting}>
            {t('HOME.GREETING', {name: user?.firstName})}
          </StyledText>
        </View>

        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View style={styles.invoiceCard}>
            <View style={styles.invoiceIcon}>
              <ReceiptIcon />
            </View>
            <TouchableOpacity style={styles.invoiceCopy} onPress={() => navigation.navigate(NAVIGATION.STACKS.COMMON, {screen: NAVIGATION.STACKS.COMMON.CREATE_INVOICE_SCREEN})}>
              <StyledText variant="bold" size={15}>
                {t('HOME.CREATE_INVOICE')}
              </StyledText>
              <StyledText color={COLORS.TEXT_SECONDARY} size={10}>
                {t('HOME.CREATE_INVOICE_SUBTITLE')}
              </StyledText>
            </TouchableOpacity>
            <ArrowRightIcon />
          </View>

          <View style={styles.quickActions}>
            {QUICK_ACTIONS.map(({translationKey, Icon, type}) => (
              <TouchableOpacity key={translationKey} style={styles.quickAction} onPress={() => handleQuickAction(type)}>
                <View style={styles.quickIcon}>
                  <Icon color={COLORS.SUCCESS} width={19} height={19} />
                </View>
                <StyledText variant="bold" size={10}>
                  {t(translationKey)}
                </StyledText>
              </TouchableOpacity>
            ))}
          </View>

          <Skeleton
            isLoading={isLoading}
            layout={STATS_SKELETON_LAYOUT}
            boneColor={COLORS.SKELETON_BONE}
            highlightColor={COLORS.SKELETON_HIGHLIGHT}
            containerStyle={styles.statsSkeletonContainer}>
            <View style={styles.stats}>
              {STATS_DATA.map(({value, translationKey}, index) => (
                <View
                  key={translationKey}
                  style={[styles.stat, index > 0 && styles.statBorder]}>
                  <StyledText variant="bold" size={18}>
                    {value}
                  </StyledText>
                  <StyledText color={COLORS.TEXT_SECONDARY} size={10} variant="medium">
                    {t(translationKey)}
                  </StyledText>
                </View>
              ))}
            </View>
          </Skeleton>

          <View style={styles.sectionHeader}>
            <StyledText variant="bold" size={18}>
              {t('HOME.YOUR_PROPERTIES')}
            </StyledText>
            <StyledText color={COLORS.SUCCESS} variant="bold" size={12}>
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
    </ScreenContainer>
  );
};

export default HomeScreen;
