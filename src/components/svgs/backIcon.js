import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../constants';

const BackIcon = ({color = COLORS.SURFACE, size = 20, ...props}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="m15 5-7 7 7 7"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default BackIcon;
