import React, {useCallback} from 'react';
import {Pressable, View} from 'react-native';
import {CheckIcon} from '../../svgs';
import {MaterialIcon, StyledText} from '../../atoms';
import {COLORS} from '../../../constants';
import styles from './styles';

const AmenityCard = ({title, iconName, selected = false, onPress}) => {
  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  const iconColor = selected ? COLORS.WHITE : COLORS.GREYSCALE_500;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{selected}}
      onPress={handlePress}
      style={[styles.card, selected ? styles.cardSelected : styles.cardIdle]}>
      <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
        <MaterialIcon
          name={String(iconName || '').replace(/_/g, '-')}
          size={18}
          color={iconColor}
        />
      </View>
      <StyledText
        variant="medium"
        size={15}
        color={selected ? COLORS.GREYSCALE_900 : COLORS.GREYSCALE_700}
        containerStyle={styles.title}>
        {title}
      </StyledText>
      {selected ? (
        <View style={styles.check}>
          <CheckIcon color={COLORS.LOGIN_PRIMARY} size={14} />
        </View>
      ) : (
        <View style={styles.checkSpacer} />
      )}
    </Pressable>
  );
};

export default React.memo(AmenityCard);
