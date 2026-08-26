import React, {useCallback} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {StyledText} from '../../atoms';
import {COLORS} from '../../../constants';
import styles from './styles';

const InvoiceCard = ({
  id,
  initials,
  name,
  status,
  statusType,
  dates,
  stayDetails,
  amount,
  settlement,
  onPress,
}) => {
  const isDraft = statusType === 'draft';
  const handlePress = useCallback(() => {
    onPress?.(id);
  }, [id, onPress]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={!onPress}
      onPress={handlePress}
      style={styles.card}>
      <View style={styles.avatar}>
        <StyledText variant='bold' size={14} color={COLORS.PRIMARY_DARK}>{initials}</StyledText>
      </View>

      <View style={styles.details}>
        <View style={styles.nameRow}>
          <StyledText
            variant="bold"
            size={14}
            numberOfLines={1}
            containerStyle={styles.name}>
            {name}
          </StyledText>
          <View
            style={[
              styles.badge,
              isDraft ? styles.draftBadge : styles.paidBadge,
            ]}>
            <StyledText
              variant='extraBold'
              size={10}
              color={
                isDraft
                  ? COLORS.INVOICE_DRAFT_TEXT
                  : COLORS.INVOICE_PAID_TEXT
              }>
              {status}
            </StyledText>
          </View>
        </View>
        <StyledText
          color={COLORS.TEXT_SECONDARY}
          size={10}
          containerStyle={styles.dates}
          numberOfLines={1}>
          {dates}
        </StyledText>
        <StyledText color={COLORS.TEXT_MUTED} size={10} numberOfLines={1}>
          {stayDetails}
        </StyledText>
      </View>

      <View style={styles.amountColumn}>
        <StyledText variant="bold" size={14}>
          {amount}
        </StyledText>
        <StyledText
          textStyle={isDraft ? styles.dueText : styles.settledText}
          containerStyle={styles.settlement}>
          {settlement}
        </StyledText>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(InvoiceCard);
