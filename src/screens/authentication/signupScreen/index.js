import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
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
import {
  makeRegisterHostRequest,
  makeSendHostRegistrationOtpRequest,
  makeVerifyHostRegistrationOtpRequest,
} from '../../../api/auth';
import {setIsLoggedIn, setUserData} from '../../../redux/auth/auth.reducer';
import styles from './styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {successToast} from '../../../utils/alerts';
import { VerifyOtpModal } from '../../../components/modals';

const EMPTY_VALUES = {
  firstName: 'akshat',
  lastName: 'kumar',
  email: 'akshat1@yopmail.com',
  phone: '9876543210',
  password: '12345678',
  confirmPassword: '12345678',
  city: 'New Delhi',
};

const SignupScreen = ({navigation}) => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const inputRefs = useRef(FORM_SCHEMA.SIGNUP.fields.map(() => null));
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [registeredUserId, setRegisteredUserId] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const activeForm = FORM_SCHEMA.SIGNUP;
  const headerStyle = useMemo(
    () => [styles.header, {paddingTop: insets.top + 40}],
    [insets.top],
  );

  const handleSubmit = useCallback(async values => {
    setIsLoading(true);

    try {
      const response = await makeRegisterHostRequest({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        password: values.password,
        city: values.city,
      });
      const userId =
        response?.id ||
        response?.userId ||
        response?.user?.id ||
        response?.data?.id ||
        response?.data?.userId;

      await makeSendHostRegistrationOtpRequest(userId);
      setRegisteredUserId(userId);
      setOtpEmail(values.email || '');
      setIsOtpModalVisible(true);
      successToast(response?.message);
    } catch (error) {
      console.warn('Signup failed', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleResendOtp = useCallback(async () => {
    const response = await makeSendHostRegistrationOtpRequest(registeredUserId);
    successToast(response?.message);
  }, [registeredUserId]);

  const handleVerifyOtp = useCallback(async otp => {
    try {
      setIsVerifyingOtp(true);
      const response = await makeVerifyHostRegistrationOtpRequest(
        registeredUserId,
        {otp},
      );
      setIsOtpModalVisible(false);
      dispatch(setUserData(response));
      dispatch(setIsLoggedIn(true));
      setTimeout(() => {
        successToast(response?.message);
      }, 1000);
    } catch (error) {
      throw error;
    } finally {
      setIsVerifyingOtp(false);
    }
  }, [dispatch, registeredUserId]);
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
              textAlign='center'
              color={COLORS.GREYSCALE_900}
              textStyle={styles.titleSpacing}>
              {t('SIGNUP_SCREEN.TITLE')}
            </StyledText>
          </View>

          <StyledText
            size={16}
            variant="bold"
            color={COLORS.LOGIN_TEXT}
            textAlign='center'
            containerStyle={styles.methodLabel}>
            {t('SIGNUP_SCREEN.SUBTITLE')}
          </StyledText>

          <Formik
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

                <CustomButton
                  isLoading={isLoading}
                  title={t(
                    'BUTTONS.SIGN_UP',
                  )}
                  onPress={submitForm}
                  color={COLORS.LOGIN_PRIMARY}
                  containerStyle={styles.loginButton}
                />
              </View>
            )}
          </Formik>

          <View style={styles.registerRow}>
            <Text style={styles.registerTextLink}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate(NAVIGATION.AUTH.LOGIN_SCREEN)}>
            <Text style={styles.registerText}>Login</Text>
          </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
      <VerifyOtpModal
        isVisible={isOtpModalVisible}
        email={otpEmail}
        onCloseModal={() => setIsOtpModalVisible(false)}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        isVerifying={isVerifyingOtp}
      />
    </ScreenContainer>
  );
};

export default SignupScreen;