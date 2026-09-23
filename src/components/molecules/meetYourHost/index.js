import React, {memo} from 'react';
import {Image, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';
import {MaterialIcon, StyledText} from '../../atoms';
import {CheckIcon} from '../../svgs';
import {COLORS} from '../../../constants';
import {
  formatHostLanguages,
  getHostDisplayName,
  getHostInitial,
} from '../../../utils/propertyDetail';
import styles from './styles';

const MeetYourHost = ({host}) => {
  const {t} = useTranslation();

  if (!host) {
    return null;
  }

  const hostName = getHostDisplayName(host);
  const hostInitial = getHostInitial(host);
  const languages = formatHostLanguages(host.languages);
  const tagline = host.tagline || t('PROPERTY_DETAIL.HOST_TAGLINE');

  return (
    <View style={styles.section}>
      <StyledText variant="bold" size={18} containerStyle={styles.sectionTitle}>
        {t('PROPERTY_DETAIL.MEET_YOUR_HOST')}
      </StyledText>

      <View style={styles.card}>
        <LinearGradient
          colors={['#E8F3E6', COLORS.SURFACE]}
          style={styles.cardHeader}
        />

        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            {host.avatar ? (
              <Image source={{uri: host.avatar}} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <StyledText color={COLORS.SURFACE} variant="bold" size={32}>
                  {hostInitial}
                </StyledText>
              </View>
            )}

            {host.isVerified ? (
              <View style={styles.verifiedBadge}>
                <CheckIcon color={COLORS.SURFACE} size={12} />
              </View>
            ) : null}
          </View>

          {host.isVerified ? (
            <View style={styles.verifiedRow}>
              <CheckIcon color={COLORS.LOGIN_PRIMARY} size={12} />
              <StyledText
                color={COLORS.LOGIN_PRIMARY}
                variant="semiBold"
                size={11}>
                {t('PROPERTY_DETAIL.VERIFIED_HOST')}
              </StyledText>
            </View>
          ) : null}

          <StyledText variant="bold" size={18} containerStyle={styles.hostName}>
            {hostName}
          </StyledText>
        </View>

        {languages ? (
          <View style={styles.languagesBox}>
            <View style={styles.languagesIconWrap}>
              <MaterialIcon
                name="language"
                size={18}
                color={COLORS.LOGIN_PRIMARY}
              />
            </View>
            <View style={styles.languagesContent}>
              <StyledText color={COLORS.TEXT_MUTED} size={11}>
                {t('PROPERTY_DETAIL.SPEAKS')}
              </StyledText>
              <StyledText variant="semiBold" size={14}>
                {languages}
              </StyledText>
            </View>
          </View>
        ) : null}

        <StyledText
          color={COLORS.TEXT_SECONDARY}
          size={13}
          textStyle={styles.tagline}>
          {tagline}
        </StyledText>
      </View>
    </View>
  );
};

export default memo(MeetYourHost);
