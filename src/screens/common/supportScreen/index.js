import React, {useCallback} from 'react';
import {Linking, ScrollView, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {ScreenContainer, StyledText} from '../../../components/atoms';
import {ScreenHeader} from '../../../components/molecules';
import {ClockIcon, EmailIcon, PhoneIcon} from '../../../components/svgs';
import {COLORS} from '../../../constants';
import {errorToast} from '../../../utils/alerts';
import styles from './styles';

const SupportCard = React.memo(({
  icon,
  title,
  description,
  availability,
  contact,
  actionLabel,
  actionIcon,
  onPress,
}) => (
  <View style={styles.card}>
    <View style={styles.iconWrap}>{icon}</View>
    <StyledText
      variant="bold"
      size={18}
      textAlign="center"
      containerStyle={styles.cardTitle}>
      {title}
    </StyledText>
    <StyledText
      color={COLORS.GREYSCALE_700}
      size={14}
      lineHeight={20}
      textAlign="center"
      containerStyle={styles.cardDescription}>
      {description}
    </StyledText>
    <View style={styles.availability}>
      <ClockIcon color={COLORS.LOGIN_PRIMARY} width={14} height={14} />
      <StyledText
        color={COLORS.LOGIN_PRIMARY}
        size={12}
        variant="medium"
        containerStyle={styles.availabilityText}>
        {availability}
      </StyledText>
    </View>
    <StyledText
      color={COLORS.GREYSCALE_900}
      size={15}
      variant="medium"
      textAlign="center"
      containerStyle={styles.contact}>
      {contact}
    </StyledText>
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={actionLabel}
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.actionButton}>
      {actionIcon}
      <StyledText
        color={COLORS.WHITE}
        variant="semiBold"
        size={15}
        containerStyle={styles.actionLabel}>
        {actionLabel}
      </StyledText>
    </TouchableOpacity>
  </View>
));

const SupportScreen = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleEmail = useCallback(() => {
    Linking.openURL(`mailto:${t('SUPPORT.EMAIL_ADDRESS')}`).catch(() => {
      errorToast(t('SUPPORT.EMAIL_FAILED'));
    });
  }, [t]);

  const handleCall = useCallback(() => {
    const phoneNumber = t('SUPPORT.PHONE_NUMBER').replace(/[^\d+]/g, '');
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      errorToast(t('SUPPORT.CALL_FAILED'));
    });
  }, [t]);

  return (
    <ScreenContainer noPaddingTop noPaddingBottom>
      <ScreenHeader
        title={t('SUPPORT.TITLE')}
        backAccessibilityLabel={t('SUPPORT.BACK')}
        onBack={handleBack}
      />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <StyledText
          variant="bold"
          size={26}
          textAlign="center"
          containerStyle={styles.heading}>
          {t('SUPPORT.HEADING')}
        </StyledText>
        <StyledText
          color={COLORS.GREYSCALE_700}
          size={14}
          lineHeight={22}
          textAlign="center"
          containerStyle={styles.description}>
          {t('SUPPORT.DESCRIPTION')}
        </StyledText>

        <SupportCard
          icon={<EmailIcon color={COLORS.LOGIN_PRIMARY} size={26} />}
          title={t('SUPPORT.EMAIL_TITLE')}
          description={t('SUPPORT.EMAIL_DESCRIPTION')}
          availability={t('SUPPORT.EMAIL_AVAILABILITY')}
          contact={t('SUPPORT.EMAIL_ADDRESS')}
          actionLabel={t('SUPPORT.EMAIL_ACTION')}
          actionIcon={<EmailIcon color={COLORS.WHITE} size={18} />}
          onPress={handleEmail}
        />
        <SupportCard
          icon={<PhoneIcon color={COLORS.LOGIN_PRIMARY} size={26} />}
          title={t('SUPPORT.PHONE_TITLE')}
          description={t('SUPPORT.PHONE_DESCRIPTION')}
          availability={t('SUPPORT.PHONE_AVAILABILITY')}
          contact={t('SUPPORT.PHONE_NUMBER')}
          actionLabel={t('SUPPORT.PHONE_ACTION')}
          actionIcon={<PhoneIcon color={COLORS.WHITE} size={18} />}
          onPress={handleCall}
        />

        <StyledText
          color={COLORS.GREYSCALE_500}
          size={13}
          lineHeight={20}
          textAlign="center"
          containerStyle={styles.footer}>
          {t('SUPPORT.FOOTER')}
        </StyledText>
      </ScrollView>
    </ScreenContainer>
  );
};

export default SupportScreen;
