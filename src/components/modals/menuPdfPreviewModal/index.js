import React, {useCallback} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import Pdf from 'react-native-pdf';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {StyledText} from '../../atoms';
import {BackIcon} from '../../svgs';
import {COLORS} from '../../../constants';
import {getMenuPdfUri} from '../../../utils/menuPdf';
import styles from './styles';

const MenuPdfPreviewModal = ({
  isVisible = false,
  pdfPath = '',
  title = '',
  onClose,
}) => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={handleClose}
      onBackdropPress={handleClose}
      style={styles.modal}
      coverScreen
      useNativeDriver
      hideModalContentWhileAnimating>
      <View
        style={[
          styles.container,
          {paddingTop: insets.top || 12, paddingBottom: insets.bottom || 12},
        ]}>
        <View style={styles.header}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t('CREATE_MENU.BACK')}
            onPress={handleClose}
            style={styles.backButton}>
            <BackIcon color={COLORS.TEXT} />
          </TouchableOpacity>
          <StyledText
            variant="bold"
            size={16}
            numberOfLines={1}
            containerStyle={styles.title}>
            {title || t('CREATE_MENU.PREVIEW')}
          </StyledText>
          <View style={styles.headerSpacer} />
        </View>

        {!!pdfPath && (
          <Pdf
            source={{uri: getMenuPdfUri(pdfPath), cache: true}}
            style={styles.pdf}
            trustAllCerts={false}
            renderActivityIndicator={() => (
              <ActivityIndicator color={COLORS.LOGIN_PRIMARY} size="large" />
            )}
          />
        )}
      </View>
    </Modal>
  );
};

export default MenuPdfPreviewModal;
