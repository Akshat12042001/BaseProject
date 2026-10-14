import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  PanResponder,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {launchImageLibrary} from 'react-native-image-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {StyledText} from '../../../components/atoms';
import {ImageIcon, StarIcon, TrashIcon} from '../../../components/svgs';
import {COLORS} from '../../../constants';
import {errorToast} from '../../../utils/alerts';
import styles from './styles';

const MAX_PHOTOS = 20;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const PHOTO_ROW_FALLBACK = 110;
const LONG_PRESS_MS = 350;
const LONG_PRESS_MOVE_TOLERANCE = 12;
const EMPTY_PHOTOS = [];

const isExistingPhoto = photo =>
  Boolean(photo?.existing) || /^https?:/i.test(photo?.uri || '');

const formatPhotoSize = bytes => {
  const size = Number(bytes);

  if (!size) {
    return '';
  }

  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

const GripIcon = () => (
  <View style={styles.photoGrip}>
    {[0, 1, 2].map(row => (
      <View key={row} style={styles.photoGripRow}>
        <View style={styles.photoGripDot} />
        <View style={styles.photoGripDot} />
      </View>
    ))}
  </View>
);

const PhotoCard = React.memo(
  ({
    photo,
    index,
    section,
    order,
    dragSection,
    dragIndex,
    hoverIndex,
    rowSlot,
    dragY,
    onDragStart,
    onDragMove,
    onDragEnd,
    onDelete,
    onFeature,
    onLayout,
  }) => {
    const {t} = useTranslation();
    const longPressTimer = useRef(null);
    const longPressActive = useRef(false);
    const touchStartY = useRef(0);
    const dragOriginY = useRef(0);
    const isDragging = dragSection === section && dragIndex === index;
    let shift = 0;

    const clearLongPress = useCallback(() => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    }, []);

    useEffect(() => clearLongPress, [clearLongPress]);

    if (
      dragSection === section &&
      dragIndex !== null &&
      hoverIndex !== null &&
      !isDragging
    ) {
      if (index > dragIndex && index <= hoverIndex) {
        shift = -1;
      } else if (index < dragIndex && index >= hoverIndex) {
        shift = 1;
      }
    }

    const panResponder = useMemo(
      () =>
        PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          onMoveShouldSetPanResponder: () => true,
          onPanResponderTerminationRequest: () => false,
          onPanResponderGrant: () => {
            clearLongPress();
            longPressActive.current = false;
            onDragStart(section, index);
          },
          onPanResponderMove: (_, gesture) => onDragMove(gesture.dy),
          onPanResponderRelease: () => onDragEnd(),
          onPanResponderTerminate: () => onDragEnd(),
        }),
      [clearLongPress, index, onDragEnd, onDragMove, onDragStart, section],
    );

    const handleTouchStart = useCallback(
      event => {
        touchStartY.current = event.nativeEvent.pageY;
        dragOriginY.current = event.nativeEvent.pageY;
        longPressActive.current = false;
        clearLongPress();
        longPressTimer.current = setTimeout(() => {
          longPressActive.current = true;
          onDragStart(section, index);
        }, LONG_PRESS_MS);
      },
      [clearLongPress, index, onDragStart, section],
    );

    const handleTouchMove = useCallback(
      event => {
        const pageY = event.nativeEvent.pageY;

        if (!longPressActive.current) {
          if (Math.abs(pageY - touchStartY.current) > LONG_PRESS_MOVE_TOLERANCE) {
            clearLongPress();
          }
          return;
        }

        onDragMove(pageY - dragOriginY.current);
      },
      [clearLongPress, onDragMove],
    );

    const handleTouchEnd = useCallback(() => {
      clearLongPress();

      if (!longPressActive.current) {
        return;
      }

      longPressActive.current = false;
      onDragEnd();
    }, [clearLongPress, onDragEnd]);

    const handleDelete = useCallback(() => {
      onDelete(photo.id);
    }, [onDelete, photo.id]);

    const handleFeature = useCallback(() => {
      onFeature(photo.id);
    }, [onFeature, photo.id]);

    return (
      <Animated.View
        onLayout={index === 0 ? onLayout : undefined}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={[
          styles.photoCard,
          isDragging && styles.photoCardDragging,
          {
            elevation: isDragging ? 8 : 0,
            transform: [{translateY: isDragging ? dragY : shift * rowSlot}],
            zIndex: isDragging ? 2 : 0,
          },
        ]}>
        <View style={styles.photoThumbWrap}>
          <Image source={{uri: photo.uri}} style={styles.photoThumb} />
          {section === 'new' ? (
            <View style={styles.photoOrderBadge}>
              <StyledText color={COLORS.WHITE} variant="semiBold" size={10}>
                {order}
              </StyledText>
            </View>
          ) : null}
          {section === 'existing' && photo.featured ? (
            <View style={styles.photoFeaturedBadge}>
              <StyledText color={COLORS.GREYSCALE_900} variant="semiBold" size={10}>
                {t('CREATE_LISTING.PHOTOS.FEATURED')}
              </StyledText>
            </View>
          ) : null}
        </View>
        <View style={styles.photoBody}>
          <StyledText
            color={COLORS.GREYSCALE_900}
            variant="semiBold"
            size={15}
            numberOfLines={1}
            containerStyle={styles.photoName}>
            {photo.name}
          </StyledText>
          {section === 'new' && !formatPhotoSize(photo.fileSize) ? null : (
            <StyledText color={COLORS.GREYSCALE_500} size={13} numberOfLines={1}>
              {section === 'new'
                ? formatPhotoSize(photo.fileSize)
                : t('CREATE_LISTING.PHOTOS.EXISTING_IMAGE')}
            </StyledText>
          )}
        </View>
        <View style={styles.photoActions}>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={handleFeature}
            style={styles.photoActionButton}>
            <StarIcon
              color={photo.featured ? '#F5B301' : '#C8C8C8'}
              filled={photo.featured}
              size={20}
            />
          </TouchableOpacity>
          <View
            accessibilityRole="adjustable"
            style={styles.photoActionButton}
            {...panResponder.panHandlers}>
            <GripIcon />
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={handleDelete}
            style={styles.photoDelete}>
            <TrashIcon color={COLORS.WHITE} size={16} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  },
);

const PhotosStep = ({
  onNext,
  onPrevious,
  isFirst,
  initialPhotos = EMPTY_PHOTOS,
  isSaving = false,
  isEditMode = false,
}) => {
  const {t} = useTranslation();
  const [photos, setPhotos] = useState(() =>
    Array.isArray(initialPhotos) ? initialPhotos : EMPTY_PHOTOS,
  );
  const initialPhotoKey = useMemo(
    () =>
      (Array.isArray(initialPhotos) ? initialPhotos : EMPTY_PHOTOS)
        .map(photo => photo.id)
        .join('|'),
    [initialPhotos],
  );

  useEffect(() => {
    setPhotos(Array.isArray(initialPhotos) ? initialPhotos : EMPTY_PHOTOS);
    // Sync only when listing photo ids change, not on new array references.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPhotoKey]);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [dragIndex, setDragIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [rowSlot, setRowSlot] = useState(PHOTO_ROW_FALLBACK);
  const photosRef = useRef(photos);
  const startIndexRef = useRef(0);
  const hoverIndexRef = useRef(0);
  const dragSectionRef = useRef('existing');
  const rowSlotRef = useRef(PHOTO_ROW_FALLBACK);
  const isDraggingRef = useRef(false);
  const [dragSection, setDragSection] = useState(null);
  const dragY = useRef(new Animated.Value(0)).current;

  photosRef.current = photos;

  const handleChoosePhotos = useCallback(async () => {
    const remaining = MAX_PHOTOS - photos.length;

    if (remaining <= 0) {
      errorToast(t('CREATE_LISTING.PHOTOS.LIMIT'));
      return;
    }

    const response = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
      selectionLimit: remaining,
    });

    if (response?.didCancel || response?.errorCode) {
      return;
    }

    const assets = response?.assets || [];
    const accepted = [];
    let skippedLarge = false;

    assets.forEach(asset => {
      if (asset.fileSize && asset.fileSize > MAX_PHOTO_BYTES) {
        skippedLarge = true;
        return;
      }

      if (!asset.uri) {
        return;
      }

      accepted.push({
        uri: asset.uri,
        name: asset.fileName || 'photo',
        type: asset.type || 'image/jpeg',
        fileSize: asset.fileSize || 0,
        existing: false,
      });
    });

    if (skippedLarge) {
      errorToast(t('CREATE_LISTING.PHOTOS.TOO_LARGE'));
    }

    if (!accepted.length) {
      return;
    }

    setPhotos(currentPhotos => {
      const hasFeatured = currentPhotos.some(photo => photo.featured);
      const pickedAt = Date.now();
      const nextPhotos = accepted.map((photo, index) => ({
        ...photo,
        id: `${pickedAt}-${index}-${photo.uri}`,
        featured: !hasFeatured && index === 0,
      }));

      return [...currentPhotos, ...nextPhotos].slice(0, MAX_PHOTOS);
    });
  }, [photos.length, t]);

  const handleDelete = useCallback(id => {
    setPhotos(currentPhotos => {
      const nextPhotos = currentPhotos.filter(photo => photo.id !== id);

      if (nextPhotos.length && !nextPhotos.some(photo => photo.featured)) {
        return nextPhotos.map((photo, index) => ({
          ...photo,
          featured: index === 0,
        }));
      }

      return nextPhotos;
    });
  }, []);

  const handleFeature = useCallback(id => {
    setPhotos(currentPhotos =>
      currentPhotos.map(photo => ({
        ...photo,
        featured: photo.id === id,
      })),
    );
  }, []);

  const handleRowLayout = useCallback(event => {
    const nextSlot = event.nativeEvent.layout.height + 12;

    if (Math.abs(rowSlotRef.current - nextSlot) <= 1) {
      return;
    }

    rowSlotRef.current = nextSlot;
    setRowSlot(nextSlot);
  }, []);

  const handleDragStart = useCallback(
    (section, index) => {
      if (isDraggingRef.current) {
        return;
      }

      isDraggingRef.current = true;
      dragSectionRef.current = section;
      startIndexRef.current = index;
      hoverIndexRef.current = index;
      dragY.setValue(0);
      setDragSection(section);
      setDragIndex(index);
      setHoverIndex(index);
      setScrollEnabled(false);
    },
    [dragY],
  );

  const handleDragMove = useCallback(
    dy => {
      dragY.setValue(dy);
      const sectionPhotos = photosRef.current.filter(photo =>
        dragSectionRef.current === 'existing'
          ? isExistingPhoto(photo)
          : !isExistingPhoto(photo),
      );
      const lastIndex = sectionPhotos.length - 1;
      const nextIndex = Math.max(
        0,
        Math.min(
          lastIndex,
          startIndexRef.current + Math.round(dy / rowSlotRef.current),
        ),
      );

      if (hoverIndexRef.current === nextIndex) {
        return;
      }

      hoverIndexRef.current = nextIndex;
      setHoverIndex(nextIndex);
    },
    [dragY],
  );

  const handleDragEnd = useCallback(() => {
    if (!isDraggingRef.current) {
      return;
    }

    isDraggingRef.current = false;
    const from = startIndexRef.current;
    const to = hoverIndexRef.current;
    const section = dragSectionRef.current;

    dragY.setValue(0);
    setDragSection(null);
    setDragIndex(null);
    setHoverIndex(null);
    setScrollEnabled(true);

    if (from === to) {
      return;
    }

    setPhotos(currentPhotos => {
      const existingPhotos = currentPhotos.filter(isExistingPhoto);
      const addedPhotos = currentPhotos.filter(photo => !isExistingPhoto(photo));
      const sectionPhotos = section === 'existing' ? existingPhotos : addedPhotos;
      const nextSection = [...sectionPhotos];
      const [movedPhoto] = nextSection.splice(from, 1);
      nextSection.splice(to, 0, movedPhoto);

      return section === 'existing'
        ? [...nextSection, ...addedPhotos]
        : [...existingPhotos, ...nextSection];
    });
  }, [dragY]);

  const handleUpdate = useCallback(() => {
    if (!photos.length) {
      errorToast(t('CREATE_LISTING.PHOTOS.REQUIRED'));
      return;
    }

    onNext?.(photos);
  }, [onNext, photos, t]);

  const existingPhotos = photos.filter(isExistingPhoto);
  const newPhotos = photos.filter(photo => !isExistingPhoto(photo));

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
      scrollEnabled={scrollEnabled}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <Pressable
          accessibilityRole="button"
          onPress={handleChoosePhotos}
          style={styles.photoDrop}>
          <View style={styles.photoIcon}>
            <ImageIcon color={COLORS.GREYSCALE_500} />
          </View>
          <StyledText
            color={COLORS.GREYSCALE_700}
            size={16}
            textAlign="center"
            containerStyle={styles.photoTitle}>
            {t('CREATE_LISTING.PHOTOS.DROP_TITLE')}
          </StyledText>
          <StyledText
            color={COLORS.GREYSCALE_500}
            size={13}
            textAlign="center"
            containerStyle={styles.photoHint}>
            {t('CREATE_LISTING.PHOTOS.DROP_HINT')}
          </StyledText>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={handleChoosePhotos}
            style={styles.photoChoose}>
            <StyledText color={COLORS.WHITE} variant="semiBold" size={15}>
              {t('CREATE_LISTING.PHOTOS.CHOOSE')}
            </StyledText>
          </TouchableOpacity>
        </Pressable>

        {photos.length ? (
          <View style={styles.photoSection}>
            <View style={styles.photoSectionTitle}>
              <StyledText color={COLORS.GREYSCALE_900} variant="semiBold" size={16}>
                {t('CREATE_LISTING.PHOTOS.TITLE')}
              </StyledText>
              <StyledText color={COLORS.RED_ERROR} variant="semiBold" size={16}>
                {' *'}
              </StyledText>
              <StyledText
                color={COLORS.GREYSCALE_500}
                size={14}
                containerStyle={styles.photoLimits}>
                {t('CREATE_LISTING.PHOTOS.LIMITS')}
              </StyledText>
            </View>
            {newPhotos.length ? (
              <>
                <StyledText
                  color={COLORS.GREYSCALE_700}
                  size={14}
                  containerStyle={styles.photoExistingLabel}>
                  {t('CREATE_LISTING.PHOTOS.NEW_TITLE', {count: newPhotos.length})}
                </StyledText>
                {newPhotos.map((photo, index) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    index={index}
                    section="new"
                    order={existingPhotos.length + index + 1}
                    dragSection={dragSection}
                    dragIndex={dragIndex}
                    hoverIndex={hoverIndex}
                    rowSlot={rowSlot}
                    dragY={dragY}
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                    onDelete={handleDelete}
                    onFeature={handleFeature}
                  />
                ))}
              </>
            ) : null}
            {existingPhotos.length ? (
              <>
                <StyledText
                  color={COLORS.GREYSCALE_700}
                  size={14}
                  containerStyle={styles.photoExistingLabel}>
                  {t('CREATE_LISTING.PHOTOS.EXISTING_TITLE', {
                    count: existingPhotos.length,
                  })}
                </StyledText>
                {existingPhotos.map((photo, index) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    index={index}
                    section="existing"
                    dragSection={dragSection}
                    dragIndex={dragIndex}
                    hoverIndex={hoverIndex}
                    rowSlot={rowSlot}
                    dragY={dragY}
                    onDragStart={handleDragStart}
                    onDragMove={handleDragMove}
                    onDragEnd={handleDragEnd}
                    onDelete={handleDelete}
                    onFeature={handleFeature}
                    onLayout={handleRowLayout}
                  />
                ))}
              </>
            ) : null}
          </View>
        ) : null}

        <View style={styles.addOnDivider} />
        <View style={styles.addOnFooter}>
          <TouchableOpacity
            accessibilityRole="button"
            disabled={isFirst}
            onPress={onPrevious}
            style={[
              styles.addOnPrevious,
              isFirst && styles.previousButtonDisabled,
            ]}>
            <StyledText color={COLORS.LOGIN_PRIMARY} variant="semiBold" size={15}>
              {t('CREATE_LISTING.PREVIOUS')}
            </StyledText>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            disabled={isSaving}
            onPress={handleUpdate}
            style={[styles.addOnNext, isSaving && styles.buttonSaving]}>
            {isSaving ? (
              <ActivityIndicator color={COLORS.WHITE} size="small" />
            ) : (
              <StyledText color={COLORS.WHITE} variant="semiBold" size={15}>
                {t(
                  isEditMode
                    ? 'CREATE_LISTING.PHOTOS.UPDATE'
                    : 'CREATE_LISTING.PHOTOS.CREATE',
                )}
              </StyledText>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default React.memo(PhotosStep);
