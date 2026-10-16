import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../constants';

const StorefrontIcon = ({color = COLORS.TEXT_MUTED, size = 48, ...props}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M4 9.2 5.5 4.8h13L20 9.2"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4 9.2c1.1 0 1.7.8 1.7 1.6S5.1 12.4 4 12.4M8.3 9.2c1.1 0 1.7.8 1.7 1.6s-.6 1.6-1.7 1.6M12 9.2c1.1 0 1.7.8 1.7 1.6s-.6 1.6-1.7 1.6M15.7 9.2c1.1 0 1.7.8 1.7 1.6s-.6 1.6-1.7 1.6M20 9.2c-1.1 0-1.7.8-1.7 1.6s.6 1.6 1.7 1.6"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.2 12.4V19h13.6v-6.6M10 19v-4.2h4V19"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default StorefrontIcon;
