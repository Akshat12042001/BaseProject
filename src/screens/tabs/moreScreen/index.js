import React, {useCallback, useMemo, useState} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {ScreenContainer, StyledText} from '../../../components/atoms';
import {ChevronRightIcon} from '../../../components/svgs';
import {makeLogoutRequest} from '../../../api/auth';
import {COLORS} from '../../../constants';
import {reset} from '../../../redux/auth/auth.reducer';
import {showAlert} from '../../../utils/alerts';
import styles from './styles';

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

        <View style={styles.content}>
          <TouchableOpacity
            accessibilityRole="button"
            disabled={isLoggingOut}
            onPress={handleLogoutPress}
            style={[styles.logoutRow, isLoggingOut && styles.disabledRow]}>
            <StyledText color={COLORS.RED_ERROR} variant="semiBold" size={14}>
              {t('MORE.LOGOUT')}
            </StyledText>
            {isLoggingOut ? (
              <ActivityIndicator color={COLORS.RED_ERROR} size="small" />
            ) : (
              <ChevronRightIcon color={COLORS.RED_ERROR} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
};

export default MoreScreen;
