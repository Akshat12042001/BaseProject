import React from 'react';
import {ActivityIndicator, Modal, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {COLORS} from '../../../constants';
import StyledText from '../styledText';

const ActionLoadingOverlay = ({
  visible = false,
  message,
}) => {
  const {t} = useTranslation();

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent
      onRequestClose={() => {}}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <ActivityIndicator color={COLORS.LOGIN_PRIMARY} size="large" />
          <StyledText
            color={COLORS.TEXT_SECONDARY}
            size={13}
            variant="medium"
            containerStyle={styles.message}>
            {message || t('COMMON.LOADING')}
          </StyledText>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(24, 35, 27, 0.35)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  card: {
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 14,
    elevation: 6,
    minWidth: 140,
    paddingHorizontal: 28,
    paddingVertical: 24,
    shadowColor: COLORS.INVOICE_SHADOW,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  message: {
    marginTop: 14,
  },
});

export default React.memo(ActionLoadingOverlay);
