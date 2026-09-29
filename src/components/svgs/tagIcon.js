import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../constants';

const TagIcon = ({color = COLORS.LOGIN_PRIMARY, size = 18, ...props}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M20 12l-8 8-8-8V4h8l8 8z"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7 7h.01"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
    />
  </Svg>
);

export default TagIcon;
