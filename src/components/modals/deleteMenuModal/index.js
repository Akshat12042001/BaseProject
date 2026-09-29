import React, {useCallback} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {useTranslation} from 'react-i18next';
import {StyledText} from '../../atoms';
import {COLORS} from '../../../constants';
import styles from '../deleteBookingModal/styles';

const DeleteMenuModal = ({
  isVisible = false,
  menuName = '',
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

  const displayMenuName =
    String(menuName || '').trim() || t('MENU.DELETE_NAME_FALLBACK');

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
          {t('MENU.DELETE_TITLE')}
        </StyledText>
        <StyledText
          color={COLORS.TEXT_SECONDARY}
          size={14}
          containerStyle={styles.message}>
          {t('MENU.DELETE_MESSAGE', {menuName: displayMenuName})}
        </StyledText>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            accessibilityRole="button"
            disabled={isDeleting}
            onPress={handleCancel}
            style={[styles.cancelButton, isDeleting && styles.disabledButton]}>
            <StyledText color={COLORS.LOGIN_PRIMARY} variant="semiBold" size={14}>
              {t('MENU.DELETE_CANCEL')}
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
                {t('MENU.DELETE_CONFIRM')}
              </StyledText>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteMenuModal;
