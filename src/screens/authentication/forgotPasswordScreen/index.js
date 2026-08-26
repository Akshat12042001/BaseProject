import React, {useCallback, useMemo} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {Formik} from 'formik';
import {
  CustomButton,
  Input,
  ScreenContainer,
  StyledText,
} from '../../../components/atoms';
import {EmailIcon} from '../../../components/svgs';
import {COLORS, FORM_SCHEMA} from '../../../constants';
import styles from './styles';
import {makeForgotPasswordRequest} from '../../../api/auth';
import { successToast } from '../../../utils/alerts';

const INITIAL_VALUES = {
  email: '',
};

const ForgotPasswordScreen = ({navigation}) => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const headerStyle = useMemo(
    () => [styles.header, {paddingTop: insets.top + 32}],
    [insets.top],
  );

  const handleSubmit = useCallback(async values => {
    try {
     const response = await makeForgotPasswordRequest(values);
      successToast(response.message);
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleSignIn = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <ScreenContainer noPaddingBottom noPaddingTop>
      <View style={styles.screen}>
        <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          <View style={headerStyle}>
            <Image
              source={{uri: 'https://www.boonies.in/Final-boonies-logo.png'}}
              style={styles.logo}
              resizeMode="contain"
            />
            <StyledText
              color={COLORS.GREYSCALE_900}
              variant="bold"
              size={28}
              textAlign="center"
              containerStyle={styles.title}>
              {t('FORGOT_PASSWORD_SCREEN.TITLE')}
            </StyledText>
            <StyledText
              color={COLORS.LOGIN_TEXT}
              size={15}
              textAlign="center"
              containerStyle={styles.description}>
              {t('FORGOT_PASSWORD_SCREEN.DESCRIPTION')}
            </StyledText>
          </View>

          <Formik
            validateOnChange
            onSubmit={handleSubmit}
            initialValues={INITIAL_VALUES}
            validationSchema={FORM_SCHEMA.FORGOT_PASSWORD.schema}>
            {({
              handleBlur,
              handleChange,
              handleSubmit: submitForm,
              values,
              errors,
              touched,
              isSubmitting,
            }) => {
              const field = FORM_SCHEMA.FORGOT_PASSWORD.fields[0];

              return (
                <View style={styles.form}>
                  <Input
                    {...field}
                    keyboardType="email-address"
                    returnKeyType="done"
                    label={t(field.label)}
                    placeholder={t(field.placeholder)}
                    value={values.email}
                    onBlur={handleBlur('email')}
                    onChangeText={handleChange('email')}
                    error={touched.email && errors.email}
                    borderColor={COLORS.LOGIN_INPUT_BORDER}
                    focusedBorderColor={COLORS.LOGIN_PRIMARY}
                    inputTextColor={COLORS.GREYSCALE_900}
                    leftIcon={<EmailIcon />}
                    onSubmitEditing={submitForm}
                  />
                  <CustomButton
                    title={t('BUTTONS.SEND_RESET_LINK')}
                    onPress={submitForm}
                    isLoading={isSubmitting}
                    color={COLORS.LOGIN_PRIMARY}
                    containerStyle={styles.resetButton}
                  />
                  <View style={styles.signInRow}>
                    <StyledText color={COLORS.LOGIN_TEXT} size={14}>
                      {t('FORGOT_PASSWORD_SCREEN.REMEMBER_PASSWORD')}{' '}
                    </StyledText>
                    <TouchableOpacity onPress={handleSignIn}>
                      <StyledText
                        color={COLORS.LOGIN_PRIMARY}
                        variant="medium"
                        size={14}>
                        {t('FORGOT_PASSWORD_SCREEN.SIGN_IN')}
                      </StyledText>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          </Formik>
        </KeyboardAwareScrollView>
      </View>
    </ScreenContainer>
  );
};

export default ForgotPasswordScreen;