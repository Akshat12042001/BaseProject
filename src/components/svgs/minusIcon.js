import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../constants';

const MinusIcon = ({color = COLORS.LOGIN_PRIMARY, size = 14, ...props}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M6 12h12"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

export default MinusIcon;
