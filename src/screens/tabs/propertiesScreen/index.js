import React, {useCallback, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {ScreenContainer, StyledText} from '../../../components/atoms';
import {DeletePropertyModal} from '../../../components/modals';
import {PROPERTY_CARD_ACTION, PropertyCard} from '../../../components/molecules';
import {PlusIcon} from '../../../components/svgs';
import {COLORS, NAVIGATION} from '../../../constants';
import {makeDeleteHomestayRequest} from '../../../api/common';
import {useGetMyPropertiesQuery} from '../../../redux/tabs';
import {errorToast, successToast} from '../../../utils/alerts';
import {
  getProperties,
  getPropertyCancellationLabel,
  getPropertyImageUrl,
} from '../../../utils/property';
import styles from './styles';

const keyExtractor = item => item.id;
const POPOVER_CLOSE_DELAY_MS = 500;

const PropertySeparator = () => <View style={styles.separator} />;

const PropertiesScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingPropertyId, setDeletingPropertyId] = useState(null);
  const {
    data: propertiesResponse,
    isError,
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
      refetch();
    } catch (error) {
      if (!error?.response?.data?.message) {
        errorToast(t('PROPERTIES.DELETE_FAILED'));
      }
    } finally {
      setDeletingPropertyId(null);
    }
  }, [deleteTarget?.id, deletingPropertyId, refetch, t]);

  const handleMenuAction = useCallback(
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

      const property = properties.find(item => item.id === propertyId);
      setTimeout(() => {
        setDeleteTarget({
          id: propertyId,
          listingName: property?.title || '',
        });
      }, POPOVER_CLOSE_DELAY_MS);
    },
    [navigation, openPropertyDetail, properties],
  );

  const renderProperty = useCallback(
    ({item}) => (
      <PropertyCard
        id={item.id}
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
        onPress={() => openPropertyDetail(item.id)}
        onMenuAction={handleMenuAction}
      />
    ),
    [handleMenuAction, openPropertyDetail, t],
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
            <TouchableOpacity
              accessibilityRole="button"
              style={styles.newButton}
              onPress={() =>
                navigation.navigate(NAVIGATION.STACKS.COMMON, {
                  screen: NAVIGATION.COMMON.CREATE_LISTING_SCREEN,
                })
              }>
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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.list,
            !properties.length && styles.emptyList,
          ]}
        />
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

export default PropertiesScreen;
