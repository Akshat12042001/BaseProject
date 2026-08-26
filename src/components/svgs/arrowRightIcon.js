import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../constants';

const ArrowRightIcon = ({color = COLORS.SUCCESS, ...props}) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M5 12h13M14 8l4 4-4 4"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ArrowRightIcon;
