import React, {useCallback} from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {useTranslation} from 'react-i18next';
import {StyledText} from '../../atoms';
import {TrashIcon} from '../../svgs';
import {COLORS, FONTS} from '../../../constants';
import styles from '../deleteBookingModal/styles';

const DeletePropertyModal = ({
  isVisible = false,
  listingName = '',
  isDeleting = false,
  onCancel,
  onConfirm,
}) => {
  const {t} = useTranslation();

  const handleCancel = useCallback(() => {
    if (isDeleting) {
      return;
    }
    onCancel?.();
  }, [isDeleting, onCancel]);

  const handleConfirm = useCallback(() => {
    if (isDeleting) {
      return;
    }
    onConfirm?.();
  }, [isDeleting, onConfirm]);

  const displayListingName =
    String(listingName || '').trim() || t('PROPERTIES.DELETE_NAME_FALLBACK');

  return (
    <Modal
      isVisible={isVisible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating
      onBackButtonPress={handleCancel}
      onBackdropPress={handleCancel}
      style={styles.modal}
      useNativeDriver>
      <View style={styles.container}>
        <StyledText variant="bold" size={18} containerStyle={styles.title}>
          {t('PROPERTIES.DELETE_TITLE')}
        </StyledText>
        <StyledText
          color={COLORS.TEXT_SECONDARY}
          size={14}
          containerStyle={styles.message}>
          {t('PROPERTIES.DELETE_MESSAGE_BEFORE')}
          <Text
            style={{
              color: COLORS.GREYSCALE_900,
              fontFamily: FONTS.semiBold,
              fontSize: 14,
            }}>
            {displayListingName}
          </Text>
          {t('PROPERTIES.DELETE_MESSAGE_AFTER')}
        </StyledText>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            accessibilityRole="button"
            disabled={isDeleting}
            onPress={handleCancel}
            style={[styles.cancelButton, isDeleting && styles.disabledButton]}>
            <StyledText color={COLORS.LOGIN_PRIMARY} variant="semiBold" size={14}>
              {t('PROPERTIES.DELETE_CANCEL')}
            </StyledText>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            disabled={isDeleting}
            onPress={handleConfirm}
            style={[
              styles.deleteButton,
              styles.deleteButtonWithIcon,
              isDeleting && styles.disabledButton,
            ]}>
            {isDeleting ? (
              <ActivityIndicator color={COLORS.WHITE} size="small" />
            ) : (
              <>
                <TrashIcon color={COLORS.WHITE} size={16} />
                <StyledText color={COLORS.WHITE} variant="semiBold" size={14}>
                  {t('PROPERTIES.DELETE_CONFIRM')}
                </StyledText>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DeletePropertyModal;
