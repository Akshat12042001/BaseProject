import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {StyledText} from '../../atoms';
import {ChevronRightIcon, ClockIcon} from '../../svgs';
import {COLORS} from '../../../constants';
import styles from './styles';

const MenuCard = ({
  title,
  description,
  updated,
  templateImage,
  onPress,
}) => (
  <TouchableOpacity
    accessibilityRole="button"
    activeOpacity={0.85}
    onPress={onPress}
    style={styles.card}>
    <Image
      source={templateImage}
      style={styles.templateImage}
      resizeMode="cover"
    />
    <View style={styles.details}>
      <StyledText
        variant="bold"
        size={16}
        numberOfLines={1}
        containerStyle={styles.title}>
        {title}
      </StyledText>
      <StyledText color={COLORS.TEXT_SECONDARY} size={12} numberOfLines={1}>
        {description}
      </StyledText>
      {!!updated && (
        <View style={styles.updatedRow}>
          <ClockIcon />
          <StyledText
            color={COLORS.TEXT_MUTED}
            size={10}
            containerStyle={styles.updatedText}
            numberOfLines={1}>
            {updated}
          </StyledText>
        </View>
      )}
    </View>
    <View style={styles.chevron}>
      <ChevronRightIcon />
    </View>
  </TouchableOpacity>
);

export default React.memo(MenuCard);
