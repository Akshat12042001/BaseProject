import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';
import {COLORS} from '../../constants';

const LockIcon = ({color = COLORS.LOGIN_ICON, size = 20, ...props}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}>
    <Rect
      x={4.5}
      y={10}
      width={15}
      height={11}
      rx={1.5}
      stroke={color}
      strokeWidth={1.8}
    />
    <Path
      d="M8 10V7.5a4 4 0 0 1 8 0V10"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
    <Path
      d="M12 14.5v2"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

export default LockIcon;
