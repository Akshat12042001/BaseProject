import React, {useCallback} from 'react';
import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {StyledText} from '../../atoms';
import {COLORS} from '../../../constants';
import styles from './styles';

const NotificationCard = ({
  isUnread = false,
  sender = '',
  date = '',
  title = '',
  readLabel = '',
  onPress,
}) => {
  const {t} = useTranslation();

  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={handlePress}
      style={[styles.card, isUnread ? styles.cardUnread : styles.cardRead]}>
      {isUnread ? <View style={styles.unreadDot} /> : null}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.senderRow}>
            {isUnread ? (
              <View style={styles.newBadge}>
                <StyledText color={COLORS.WHITE} size={11} variant="bold">
                  {t('NOTIFICATION.NEW')}
                </StyledText>
              </View>
            ) : null}
            <StyledText
              color={COLORS.GREYSCALE_700}
              size={12}
              variant="semiBold"
              textStyle={styles.sender}
              numberOfLines={1}>
              {sender}
            </StyledText>
          </View>
          <StyledText color={COLORS.GREYSCALE_500} size={13}>
            {date}
          </StyledText>
        </View>

        <StyledText
          variant="bold"
          size={16}
          lineHeight={22}
          containerStyle={styles.title}>
          {title}
        </StyledText>

        {!isUnread && !!readLabel ? (
          <>
            <View style={styles.divider} />
            <View style={styles.readRow}>
              <View style={styles.readDot} />
              <StyledText color={COLORS.GREYSCALE_700} size={13}>
                {readLabel}
              </StyledText>
            </View>
          </>
        ) : null}
      </View>
    </Pressable>
  );
};

export default React.memo(NotificationCard);
