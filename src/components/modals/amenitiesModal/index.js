import React, {useCallback} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {MaterialIcon, StyledText} from '../../atoms';
import {CloseIcon} from '../../svgs';
import {COLORS} from '../../../constants';
import styles from './styles';

const AmenitiesModal = ({
  isVisible = false,
  amenities = [],
  onClose,
}) => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const renderAmenity = useCallback(
    ({item}) => (
      <View style={styles.amenityRow}>
        <View style={styles.amenityIcon}>
          <MaterialIcon
            name={item.icon}
            size={18}
            color={COLORS.TEXT_MUTED}
          />
        </View>
        <StyledText size={14}>{item.name}</StyledText>
      </View>
    ),
    [],
  );

  const keyExtractor = useCallback(
    (item, index) => `${item.name}-${index}`,
    [],
  );

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={handleClose}
      onBackdropPress={handleClose}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating
      useNativeDriver>
      <View style={[styles.container, {paddingBottom: insets.bottom || 24}]}>
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <StyledText variant="bold" size={18} containerStyle={styles.title}>
            {t('PROPERTY_DETAIL.AMENITIES')}
          </StyledText>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t('PROPERTY_DETAIL.CLOSE')}
            onPress={handleClose}
            style={styles.closeButton}>
            <CloseIcon color={COLORS.TEXT} size={16} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={amenities}
          renderItem={renderAmenity}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </Modal>
  );
};

export default AmenitiesModal;
