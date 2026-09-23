import React, {useCallback, useMemo, useState} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {ScreenContainer, StyledText} from '../../../components/atoms';
import {CalendarIcon, ChevronRightIcon} from '../../../components/svgs';
import {makeLogoutRequest} from '../../../api/auth';
import {COLORS} from '../../../constants';
import {reset} from '../../../redux/auth/auth.reducer';
import {showAlert} from '../../../utils/alerts';
import styles from './styles';
import DATA from './config';

const MoreScreen = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const user = useSelector(state => state.auth.user);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const headerStyle = useMemo(
    () => [styles.header, {paddingTop: insets.top || 20, paddingBottom: 20}],
    [insets.top],
  );

  const subtitle = user?.email || user?.firstName || t('MORE.SUBTITLE');

  const handleLogoutConfirm = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      await makeLogoutRequest();
    } catch {
      // APIClient displays the server error toast.
    } finally {
      dispatch(reset());
      setIsLoggingOut(false);
    }
  }, [dispatch]);

  const handleLogoutPress = useCallback(() => {
    showAlert({
      title: t('MORE.LOGOUT_TITLE'),
      message: t('MORE.LOGOUT_MESSAGE'),
      isConfirmationPopup: true,
      t,
      onSuccess: handleLogoutConfirm,
      onCancel: () => {},
    });
  }, [handleLogoutConfirm, t]);

  const onPress = id => {
    switch (id) {
      case 1:
        // navigation.navigate('Bookings');
        break;
      case 2:
        handleLogoutPress();
        break;
    }
  };
  return (
    <ScreenContainer noPaddingTop noPaddingBottom>
      <View style={styles.screen}>
        <View style={headerStyle}>
          <StyledText color={COLORS.SURFACE} variant="bold" size={20}>
            {t('MORE.TITLE')}
          </StyledText>
          <StyledText
            color={COLORS.HEADER_TEXT_MUTED}
            size={12}
            containerStyle={styles.subtitle}>
            {subtitle}
          </StyledText>
        </View>

        {DATA.map(item => (
          <View style={styles.content} key={item.id}>
            <TouchableOpacity
              accessibilityRole="button"
              disabled={isLoggingOut}
              onPress={onPress.bind(null, item.id)}
              style={[styles.logoutRow, isLoggingOut && styles.disabledRow]}>
              {item.icon}
              <View style={styles.logoutRowContent}>
                <StyledText
                  color={item.id === 1 ? COLORS.PRIMARY : COLORS.RED_ERROR}
                  variant="semiBold"
                  size={14}>
                  {item.title}
                </StyledText>
                <ChevronRightIcon
                  color={item.id === 1 ? COLORS.PRIMARY : COLORS.RED_ERROR}
                />
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
};

export default MoreScreen;
