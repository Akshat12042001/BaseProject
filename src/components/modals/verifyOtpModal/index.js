import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import styles from './styles';
import {COLORS} from '../../../constants';
import {useTranslation} from 'react-i18next';
import {CustomButton, OtpInput, StyledText} from '../../atoms';
import {makeSendOtpByEmailRequest} from '../../../api/auth';
import {successToast} from '../../../utils/alerts';

const VerifyOtpModal = ({
  isVisible,
  onCloseModal,
  email = '',
  onVerify,
  onResend,
  isLoading = false,
  isVerifying = false,
}) => {
  const {t} = useTranslation();
  const [otp, setOtp] = useState([]);
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);

  const isOtpComplete = otp.join('').length === 6;

  useEffect(() => {
    if (!isVisible) {
      setOtp([]);
      setError('');
    }
  }, [isVisible]);

  const handleOtpChange = useCallback(value => {
    setError('');
    setOtp(value);
  }, []);

  const handleOtpComplete = useCallback(() => {
    setError('');
  }, []);

  const handleVerify = useCallback(() => {
    if (!isOtpComplete) {
      setError(t('VERIFY_OTP_MODAL.INVALID_OTP'));
      return;
    }

    onVerify?.(otp.join(''));
  }, [isOtpComplete, onVerify, otp, t]);

  const handleResend = useCallback(async () => {
    try {
      setIsResending(true);
      await makeSendOtpByEmailRequest({email});
      setOtp([]);
      setError('');
      onResend?.();
    } catch (error) {
      console.warn('Resend OTP failed', error);
    } finally {
      setIsResending(false);
    }
  }, [onResend, email]);

  return (
    <Modal
      style={styles.modal}
      isVisible={isVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionOutTiming={1000}
      hideModalContentWhileAnimating
      avoidKeyboard
      onBackdropPress={onCloseModal}
      onBackButtonPress={onCloseModal}>
      <View style={styles.container}>
        <StyledText
          size={26}
          variant="bold"
          textAlign="center"
          color={COLORS.GREYSCALE_900}>
          {t('VERIFY_OTP_MODAL.TITLE')}
        </StyledText>
        <StyledText
          size={15}
          textAlign="center"
          color={COLORS.LOGIN_TEXT}
          containerStyle={styles.description}>
          {t('VERIFY_OTP_MODAL.DESCRIPTION')}
        </StyledText>
        {!!email && (
          <StyledText
            size={15}
            variant="bold"
            textAlign="center"
            color={COLORS.LOGIN_TEXT}
            containerStyle={styles.email}>
            {email}
          </StyledText>
        )}

        <View style={styles.otpContainer}>
          <OtpInput
            otp={otp}
            length={6}
            setOtp={handleOtpChange}
            onSubmit={handleOtpComplete}
            error={error}
          />
          {!!error && (
            <StyledText size={12} textAlign="center" color={COLORS.RED_ERROR}>
              {error}
            </StyledText>
          )}
        </View>

        <CustomButton
          title={t('VERIFY_OTP_MODAL.VERIFY_EMAIL')}
          onPress={handleVerify}
          isLoading={isVerifying}
          isDisabled={!isOtpComplete}
          color={COLORS.LOGIN_PRIMARY}
          disabledColor={COLORS.OTP_DISABLED_BACKGROUND}
          disabledTextColor={COLORS.OTP_DISABLED_TEXT}
          containerStyle={styles.verifyButton}
        />

        <View style={styles.resendRow}>
          <StyledText color={COLORS.LOGIN_TEXT} size={14}>
            {t('VERIFY_OTP_MODAL.DID_NOT_RECEIVE')}{' '}
          </StyledText>
          {isResending && (
            <ActivityIndicator size="small" color={COLORS.LOGIN_PRIMARY} />
          )}
          {!isResending && (
            <TouchableOpacity onPress={handleResend}>
              <StyledText color={COLORS.LOGIN_PRIMARY} variant="bold" size={14}>
                {t('VERIFY_OTP_MODAL.RESEND_OTP')}
              </StyledText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default VerifyOtpModal;
