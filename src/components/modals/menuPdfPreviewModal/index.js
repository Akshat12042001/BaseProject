import React, {useCallback, useState} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import Pdf from 'react-native-pdf';
import Share from 'react-native-share';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {StyledText} from '../../atoms';
import {BackIcon, ShareIcon} from '../../svgs';
import {COLORS} from '../../../constants';
import {errorToast} from '../../../utils/alerts';
import {getMenuPdfFileName, getMenuPdfUri} from '../../../utils/menuPdf';
import styles from './styles';

const MenuPdfPreviewModal = ({
  isVisible = false,
  pdfPath = '',
  title = '',
  onClose,
}) => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const [isSharing, setIsSharing] = useState(false);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleShare = useCallback(async () => {
    if (!pdfPath || isSharing) {
      return;
    }

    try {
      setIsSharing(true);
      await Share.open({
        title: t('CREATE_MENU.SHARE'),
        subject: title || t('CREATE_MENU.PREVIEW'),
        url: getMenuPdfUri(pdfPath),
        type: 'application/pdf',
        filename: getMenuPdfFileName({title}),
        failOnCancel: false,
      });
    } catch (error) {
      const message = String(error?.message || '').toLowerCase();
      if (!message.includes('cancel') && !message.includes('did not share')) {
        errorToast(t('CREATE_MENU.SHARE_FAILED'));
      }
    } finally {
      setIsSharing(false);
    }
  }, [isSharing, pdfPath, t, title]);

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
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t('CREATE_MENU.SHARE')}
            disabled={!pdfPath || isSharing}
            onPress={handleShare}
            style={styles.shareButton}>
            {isSharing ? (
              <ActivityIndicator color={COLORS.LOGIN_PRIMARY} size="small" />
            ) : (
              <ShareIcon color={COLORS.TEXT} size={18} />
            )}
          </TouchableOpacity>
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
