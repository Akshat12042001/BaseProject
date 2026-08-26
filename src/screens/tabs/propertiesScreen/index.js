import React, {useCallback, useMemo} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {ScreenContainer, StyledText} from '../../../components/atoms';
import {PropertyCard} from '../../../components/molecules';
import {PlusIcon} from '../../../components/svgs';
import {COLORS} from '../../../constants';
import {useGetMyPropertiesQuery} from '../../../redux/tabs';
import {
  getProperties,
  getPropertyCancellationLabel,
  getPropertyImageUrl,
} from '../../../utils/property';
import styles from './styles';

const keyExtractor = item => item.id;

const PropertySeparator = () => <View style={styles.separator} />;

const PropertiesScreen = () => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const {
    data: propertiesResponse,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetMyPropertiesQuery({page: 1, limit: 100});

  const properties = useMemo(
    () => getProperties(propertiesResponse),
    [propertiesResponse],
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

  const subtitle = t('PROPERTIES.SUBTITLE', {count: properties.length});

  const renderProperty = useCallback(
    ({item}) => (
      <PropertyCard
        title={item.title}
        city={item.city}
        state={item.state}
        maxGuests={item.maxGuests}
        totalBedrooms={item.totalBedrooms}
        totalBathrooms={item.totalBathrooms}
        cancellationPolicy={getPropertyCancellationLabel(item)}
        imageUrl={getPropertyImageUrl(item)}
        pricePerDay={item.pricePerDay}
        status={item.status}
        placeholder={t('HOME.PROPERTY_PHOTO')}
      />
    ),
    [t],
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
          {isError ? t('PROPERTIES.LOAD_ERROR') : t('PROPERTIES.EMPTY')}
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
              {t('PROPERTIES.TITLE')}
            </StyledText>
            <TouchableOpacity accessibilityRole="button" style={styles.newButton}>
              <PlusIcon />
              <StyledText color={COLORS.PRIMARY} variant="bold" size={12}>
                {t('PROPERTIES.NEW')}
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
          data={properties}
          renderItem={renderProperty}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={PropertySeparator}
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
            !properties.length && styles.emptyList,
          ]}
        />
      </View>
    </ScreenContainer>
  );
};

export default PropertiesScreen;
