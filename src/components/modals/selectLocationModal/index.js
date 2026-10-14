import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {StyledText} from '../../atoms';
import {CloseIcon} from '../../svgs';
import {COLORS} from '../../../constants';
import {reverseGeocodeLocation, searchLocation} from '../../../utils/location';
import styles from './styles';

const DEFAULT_COORDINATE = {
  latitude: 28.6139,
  longitude: 77.209,
};

const DEFAULT_DELTA = {
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

const MAP_HEIGHT = Math.min(Dimensions.get('window').height * 0.36, 300);
const MAP_WIDTH = Dimensions.get('window').width - 32;

const toCoordinate = (latitude, longitude) => {
  const latRaw = String(latitude ?? '').trim();
  const lngRaw = String(longitude ?? '').trim();

  if (!latRaw || !lngRaw) {
    return null;
  }

  const lat = Number(latRaw);
  const lng = Number(lngRaw);

  if (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    !(lat === 0 && lng === 0) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180
  ) {
    return {latitude: lat, longitude: lng};
  }

  return null;
};

const formatCoordinate = value => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount.toFixed(6) : '';
};

const SelectLocationModal = ({
  isVisible = false,
  latitude = '',
  longitude = '',
  onClose,
  onConfirm,
}) => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const mapRef = useRef(null);
  const initialCoordinate = useMemo(
    () => toCoordinate(latitude, longitude) || DEFAULT_COORDINATE,
    [latitude, longitude],
  );
  const [coordinate, setCoordinate] = useState(initialCoordinate);
  const [latitudeText, setLatitudeText] = useState(
    formatCoordinate(initialCoordinate.latitude),
  );
  const [longitudeText, setLongitudeText] = useState(
    formatCoordinate(initialCoordinate.longitude),
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setIsMapReady(false);
      setIsConfirming(false);
      return undefined;
    }

    const nextCoordinate = toCoordinate(latitude, longitude) || DEFAULT_COORDINATE;
    setCoordinate(nextCoordinate);
    setLatitudeText(formatCoordinate(nextCoordinate.latitude));
    setLongitudeText(formatCoordinate(nextCoordinate.longitude));
    setSearchQuery('');
    setSearchError('');
    setIsConfirming(false);

    const timer = setTimeout(() => {
      setIsMapReady(true);
    }, 250);

    return () => clearTimeout(timer);
  }, [isVisible, latitude, longitude]);

  const animateTo = useCallback(nextCoordinate => {
    mapRef.current?.animateToRegion(
      {
        ...nextCoordinate,
        ...DEFAULT_DELTA,
      },
      350,
    );
  }, []);

  const applyCoordinate = useCallback(
    nextCoordinate => {
      setCoordinate(nextCoordinate);
      setLatitudeText(formatCoordinate(nextCoordinate.latitude));
      setLongitudeText(formatCoordinate(nextCoordinate.longitude));
      animateTo(nextCoordinate);
    },
    [animateTo],
  );

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleMapPress = useCallback(
    event => {
      const nextCoordinate = event?.nativeEvent?.coordinate;
      if (!nextCoordinate) {
        return;
      }

      applyCoordinate({
        latitude: nextCoordinate.latitude,
        longitude: nextCoordinate.longitude,
      });
    },
    [applyCoordinate],
  );

  const handleLatitudeChange = useCallback(text => {
    setLatitudeText(text.replace(/[^0-9.-]/g, ''));
  }, []);

  const handleLongitudeChange = useCallback(text => {
    setLongitudeText(text.replace(/[^0-9.-]/g, ''));
  }, []);

  const handleCoordinateBlur = useCallback(() => {
    const nextCoordinate = toCoordinate(latitudeText, longitudeText);
    if (!nextCoordinate) {
      setLatitudeText(formatCoordinate(coordinate.latitude));
      setLongitudeText(formatCoordinate(coordinate.longitude));
      return;
    }

    applyCoordinate(nextCoordinate);
  }, [applyCoordinate, coordinate.latitude, coordinate.longitude, latitudeText, longitudeText]);

  const handleSearch = useCallback(async () => {
    const query = searchQuery.trim();
    if (!query || isSearching) {
      return;
    }

    setIsSearching(true);
    setSearchError('');

    try {
      const match = await searchLocation(query);
      const nextCoordinate = toCoordinate(match?.lat, match?.lon);

      if (!nextCoordinate) {
        setSearchError(t('CREATE_LISTING.LOCATION.SEARCH_EMPTY'));
        return;
      }

      applyCoordinate(nextCoordinate);
    } catch (error) {
      setSearchError(t('CREATE_LISTING.LOCATION.SEARCH_FAILED'));
    } finally {
      setIsSearching(false);
    }
  }, [applyCoordinate, isSearching, searchQuery, t]);

  const handleConfirm = useCallback(async () => {
    if (isConfirming) {
      return;
    }

    setIsConfirming(true);
    setSearchError('');

    try {
      const location = await reverseGeocodeLocation(
        coordinate.latitude,
        coordinate.longitude,
      );

      onConfirm?.({
        ...location,
        latitude: Number(coordinate.latitude.toFixed(6)),
        longitude: Number(coordinate.longitude.toFixed(6)),
        addressLine1: location.addressLine1 || '',
        addressLine2: location.addressLine2 || '',
        city: location.city || '',
        state: location.state || '',
        postalCode: location.postalCode || '',
      });
    } catch (error) {
      onConfirm?.({
        latitude: Number(coordinate.latitude.toFixed(6)),
        longitude: Number(coordinate.longitude.toFixed(6)),
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
      });
    } finally {
      setIsConfirming(false);
    }
  }, [coordinate.latitude, coordinate.longitude, isConfirming, onConfirm]);

  const canSearch = Boolean(searchQuery.trim()) && !isSearching && !isConfirming;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
      statusBarTranslucent>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropPressable} onPress={handleClose} />
        <View style={[styles.container, {paddingBottom: insets.bottom || 16}]}>
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          <View style={styles.header}>
            <View style={styles.headerSpacer} />
            <StyledText variant="bold" size={18} containerStyle={styles.title}>
              {t('CREATE_LISTING.LOCATION.TITLE')}
            </StyledText>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={t('CREATE_LISTING.LOCATION.CLOSE')}
              onPress={handleClose}
              style={styles.closeButton}>
              <CloseIcon color={COLORS.TEXT} size={16} />
            </TouchableOpacity>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.body}>
            <StyledText
              size={13}
              color={COLORS.GREYSCALE_500}
              containerStyle={styles.subtitle}>
              {t('CREATE_LISTING.LOCATION.SUBTITLE')}
            </StyledText>

            <View style={styles.searchRow}>
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={t('CREATE_LISTING.LOCATION.SEARCH_PLACEHOLDER')}
                placeholderTextColor={COLORS.GREYSCALE_500}
                returnKeyType="search"
                onSubmitEditing={handleSearch}
                style={styles.searchInput}
              />
              <TouchableOpacity
                accessibilityRole="button"
                disabled={!canSearch}
                onPress={handleSearch}
                style={[
                  styles.searchButton,
                  canSearch && styles.searchButtonActive,
                ]}>
                {isSearching ? (
                  <ActivityIndicator color={COLORS.WHITE} size="small" />
                ) : (
                  <StyledText
                    variant="semiBold"
                    size={14}
                    color={canSearch ? COLORS.WHITE : COLORS.GREYSCALE_500}>
                    {t('CREATE_LISTING.LOCATION.SEARCH')}
                  </StyledText>
                )}
              </TouchableOpacity>
            </View>

            {searchError ? (
              <StyledText
                size={12}
                color={COLORS.RED_ERROR}
                containerStyle={styles.searchError}>
                {searchError}
              </StyledText>
            ) : null}

            <View style={styles.coordRow}>
              <View style={styles.coordField}>
                <StyledText size={13} containerStyle={styles.coordLabel}>
                  {t('CREATE_LISTING.LOCATION.LATITUDE')}
                </StyledText>
                <TextInput
                  value={latitudeText}
                  onChangeText={handleLatitudeChange}
                  onBlur={handleCoordinateBlur}
                  keyboardType="decimal-pad"
                  style={styles.coordInput}
                />
              </View>
              <View style={styles.coordField}>
                <StyledText size={13} containerStyle={styles.coordLabel}>
                  {t('CREATE_LISTING.LOCATION.LONGITUDE')}
                </StyledText>
                <TextInput
                  value={longitudeText}
                  onChangeText={handleLongitudeChange}
                  onBlur={handleCoordinateBlur}
                  keyboardType="decimal-pad"
                  style={styles.coordInput}
                />
              </View>
            </View>

            <StyledText
              size={12}
              color={COLORS.GREYSCALE_500}
              containerStyle={styles.coordinatesText}>
              {t('CREATE_LISTING.LOCATION.COORDINATES', {
                latitude: formatCoordinate(coordinate.latitude),
                longitude: formatCoordinate(coordinate.longitude),
              })}
            </StyledText>

            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.85}
              disabled={isConfirming}
              onPress={handleConfirm}
              style={[styles.useButton, isConfirming && styles.useButtonDisabled]}>
              {isConfirming ? (
                <ActivityIndicator color={COLORS.WHITE} size="small" />
              ) : (
                <StyledText color={COLORS.WHITE} variant="semiBold" size={14}>
                  {t('CREATE_LISTING.LOCATION.USE_LOCATION')}
                </StyledText>
              )}
            </TouchableOpacity>

            <View style={[styles.mapWrap, {height: MAP_HEIGHT, width: MAP_WIDTH}]}>
              {isMapReady ? (
                <MapView
                  ref={mapRef}
                  style={{width: MAP_WIDTH, height: MAP_HEIGHT}}
                  provider={PROVIDER_GOOGLE}
                  initialRegion={{
                    ...coordinate,
                    ...DEFAULT_DELTA,
                  }}
                  onPress={handleMapPress}
                  onMapReady={() => animateTo(coordinate)}
                  googleRenderer={Platform.OS === 'android' ? 'LATEST' : undefined}>
                  <Marker coordinate={coordinate} />
                </MapView>
              ) : (
                <View style={[styles.mapLoading, {height: MAP_HEIGHT}]}>
                  <ActivityIndicator color={COLORS.LOGIN_PRIMARY} />
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(SelectLocationModal);
