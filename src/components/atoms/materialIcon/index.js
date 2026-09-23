import React, {memo} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {COLORS} from '../../../constants';
import {normalizeMaterialIconName} from '../../../utils/materialIcons';

const MaterialIcon = ({
  name,
  size = 20,
  color = COLORS.TEXT_MUTED,
  style,
}) => {
  const iconName = normalizeMaterialIconName(name);

  return (
    <MaterialIcons
      name={iconName}
      size={size}
      color={color}
      style={style}
    />
  );
};

export default memo(MaterialIcon);
