import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import {Formik} from 'formik';
import {useDispatch} from 'react-redux';
import {
  CustomButton,
  Input,
  ScreenContainer,
  StyledText,
} from '../../../components/atoms';
import {EmailIcon, LockIcon, LoginEyeIcon} from '../../../components/svgs';
import {COLORS, FORM_SCHEMA, NAVIGATION} from '../../../constants';
import {makeLoginRequest, makeSendOtpByEmailRequest, makeVerifyOtpByEmailRequest} from '../../../api/auth';
import {setIsLoggedIn, setUserData} from '../../../redux/auth/auth.reducer';
import styles from './styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import { successToast } from '../../../utils/alerts';
import { VerifyOtpModal } from '../../../components/modals';

const LOGIN_METHODS = {
  PASSWORD: 'password',
  EMAIL_OTP: 'emailOtp',
};

const EMPTY_VALUES = {
  email: '',
  password: '',
};

const LoginScreen = ({navigation}) => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const inputRefs = useRef(FORM_SCHEMA.LOGIN.fields.map(() => null));
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState(LOGIN_METHODS.PASSWORD);
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const isOtpLogin = loginMethod === LOGIN_METHODS.EMAIL_OTP;
  const activeForm = isOtpLogin
    ? FORM_SCHEMA.LOGIN_WITH_OTP
    : FORM_SCHEMA.LOGIN;
  const headerStyle = useMemo(
    () => [styles.header, {paddingTop: insets.top + 40}],
    [insets.top],
  );

  const handleSubmit = useCallback(
    async values => {
      setIsLoading(true);

      try {
        const params = isOtpLogin
          ? {email: values?.email}
          : {
              email: values?.email,
              password: values?.password,
            };
        const response = isOtpLogin ? await makeSendOtpByEmailRequest(params) : await makeLoginRequest(params);
        if(isOtpLogin) {
          setOtpEmail(values?.email || '');
          setIsOtpModalVisible(true);
        }else{
          dispatch(setUserData(response));
          dispatch(setIsLoggedIn(true));
          successToast(response.message);
        }
      } catch (error) {
        console.warn('Login failed', error);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, isOtpLogin],
  );

  const activatePasswordLogin = useCallback(() => {
    setLoginMethod(LOGIN_METHODS.PASSWORD);
  }, []);

  const activateOtpLogin = useCallback(() => {
    setLoginMethod(LOGIN_METHODS.EMAIL_OTP);
  }, []);

  const handleForgotPassword = useCallback(() => {
    const forgotPasswordRoute = NAVIGATION.AUTH.FORGOT_PASSWORD_SCREEN;

    if (forgotPasswordRoute) {
      navigation.navigate(forgotPasswordRoute);
    }
  }, [navigation]);

  const handleVerifyOtp = useCallback(async (otp) => {
    try {
      setIsVerifyingOtp(true);
      const response= await makeVerifyOtpByEmailRequest({email: otpEmail, otp})
      setIsOtpModalVisible(false);
      dispatch(setUserData(response));
      dispatch(setIsLoggedIn(true));
      setTimeout(() => {
        successToast(response.message);
      }, 1000);
    } catch (error) {
      console.warn('Verify OTP failed', error);
    } finally {
      setIsVerifyingOtp(false);
    }
  }, [otpEmail]);
  return (
    <ScreenContainer noPaddingBottom noPaddingTop>
      <View style={styles.screen}>
        <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
          enableResetScrollToCoords={false}
          enableAutoAutomaticScroll={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <View style={headerStyle}>
            <Image
              source={{uri: 'https://www.boonies.in/Final-boonies-logo.png'}}
              style={styles.logo}
              resizeMode="contain"
            />
            <StyledText
              size={32}
              variant="bold"
              color={COLORS.GREYSCALE_900}
              textStyle={styles.titleSpacing}>
              {t('LOGIN_SCREEN.SIGN_IN_TO_YOUR_ACCOUNT')}
            </StyledText>
          </View>

          <StyledText
            size={16}
            variant="bold"
            color={COLORS.LOGIN_TEXT}
            textAlign='center'
            containerStyle={styles.methodLabel}>
            {t('LOGIN_SCREEN.CHOOSE_LOGIN_METHOD')}
          </StyledText>

          <View style={styles.methodSelector}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={activatePasswordLogin}
              style={[
                styles.methodOption,
                !isOtpLogin && styles.activeMethod,
              ]}>
              <LoginEyeIcon
                color={
                  isOtpLogin ? COLORS.LOGIN_PRIMARY : COLORS.WHITE
                }
                size={18}
              />
              <StyledText
                color={isOtpLogin ? COLORS.LOGIN_PRIMARY : COLORS.WHITE}
                variant="bold"
                size={14}>
                {t('LOGIN_SCREEN.PASSWORD_METHOD')}
              </StyledText>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={activateOtpLogin}
              style={[
                styles.methodOption,
                isOtpLogin && styles.activeMethod,
              ]}>
              <EmailIcon
                color={
                  isOtpLogin ? COLORS.WHITE : COLORS.LOGIN_PRIMARY
                }
                size={18}
              />
              <StyledText
                color={isOtpLogin ? COLORS.WHITE : COLORS.LOGIN_PRIMARY}
                variant="bold"
                size={14}>
                {t('LOGIN_SCREEN.EMAIL_OTP_METHOD')}
              </StyledText>
            </TouchableOpacity>
          </View>

          <Formik
            key={loginMethod}
            validateOnChange
            enableReinitialize
            onSubmit={handleSubmit}
            initialValues={EMPTY_VALUES}
            validationSchema={activeForm.schema}>
            {({
              handleBlur,
              handleChange,
              handleSubmit: submitForm,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.form}>
                {activeForm.fields.map((field, index) => {
                  const fieldKey = field?.type;
                  const isPassword = fieldKey === 'password';

                  return (
                    <Input
                      {...field}
                      ref={ref => {
                        inputRefs.current[index] = ref;
                      }}
                      onSubmitEditing={() => {
                        if (index !== activeForm.fields.length - 1) {
                          inputRefs.current[index + 1]?.focus();
                        }
                      }}
                      key={fieldKey}
                      label={t(field?.label)}
                      value={values[fieldKey]}
                      onBlur={handleBlur(fieldKey)}
                      placeholder={t(field?.placeholder)}
                      onChangeText={handleChange(fieldKey)}
                      error={touched?.[fieldKey] && errors?.[fieldKey]}
                      borderColor={COLORS.LOGIN_INPUT_BORDER}
                      focusedBorderColor={COLORS.LOGIN_PRIMARY}
                      inputTextColor={COLORS.GREYSCALE_900}
                      leftIcon={
                        isPassword ? <LockIcon /> : <EmailIcon />
                      }
                      rightIcon={isPassword ? <LoginEyeIcon /> : null}
                      returnKeyType={
                        index === activeForm.fields.length - 1
                          ? 'done'
                          : 'next'
                      }
                    />
                  );
                })}

                {!isOtpLogin && (
                  <View style={styles.forgotPasswordRow}>
                    <TouchableOpacity onPress={handleForgotPassword}>
                      <StyledText
                        color={COLORS.LOGIN_PRIMARY}
                        variant="medium"
                        size={14}>
                        {t('LOGIN_SCREEN.FORGOT_PASSWORD')}
                      </StyledText>
                    </TouchableOpacity>
                  </View>
                )}

                <CustomButton
                  isLoading={isLoading}
                  title={t(
                    isOtpLogin
                      ? 'BUTTONS.SEND_VERIFICATION_OTP'
                      : 'BUTTONS.SIGN_IN',
                  )}
                  onPress={submitForm}
                  color={COLORS.LOGIN_PRIMARY}
                  containerStyle={styles.loginButton}
                />
              </View>
            )}
          </Formik>
        </KeyboardAwareScrollView>
      </View>
      <VerifyOtpModal
        isVisible={isOtpModalVisible}
        email={otpEmail}
        onCloseModal={() => setIsOtpModalVisible(false)}
        onVerify={handleVerifyOtp}
        isVerifying={isVerifyingOtp}
      />
    </ScreenContainer>
  );
};

export default LoginScreen;