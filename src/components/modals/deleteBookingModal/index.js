import React, {useCallback} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {useTranslation} from 'react-i18next';
import {StyledText} from '../../atoms';
import {COLORS} from '../../../constants';
import styles from './styles';

const DeleteBookingModal = ({
  isVisible = false,
  guestName = '',
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

  const displayGuestName =
    String(guestName || '').trim() || t('BOOKING_LIST.DELETE_GUEST_FALLBACK');

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
          {t('BOOKING_LIST.DELETE_TITLE')}
        </StyledText>
        <StyledText
          color={COLORS.TEXT_SECONDARY}
          size={14}
          containerStyle={styles.message}>
          {t('BOOKING_LIST.DELETE_MESSAGE', {guestName: displayGuestName})}
        </StyledText>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            accessibilityRole="button"
            disabled={isDeleting}
            onPress={handleCancel}
            style={[styles.cancelButton, isDeleting && styles.disabledButton]}>
            <StyledText color={COLORS.LOGIN_PRIMARY} variant="semiBold" size={14}>
              {t('BOOKING_LIST.DELETE_CANCEL')}
            </StyledText>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            disabled={isDeleting}
            onPress={handleConfirm}
            style={[styles.deleteButton, isDeleting && styles.disabledButton]}>
            {isDeleting ? (
              <ActivityIndicator color={COLORS.WHITE} size="small" />
            ) : (
              <StyledText color={COLORS.WHITE} variant="semiBold" size={14}>
                {t('BOOKING_LIST.DELETE_CONFIRM')}
              </StyledText>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteBookingModal;
