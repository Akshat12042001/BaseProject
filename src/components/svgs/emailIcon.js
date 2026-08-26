import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';
import {COLORS} from '../../constants';

const EmailIcon = ({color = COLORS.LOGIN_ICON, size = 20, ...props}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}>
    <Rect
      x={2.5}
      y={4.5}
      width={19}
      height={15}
      rx={1.5}
      stroke={color}
      strokeWidth={1.8}
    />
    <Path
      d="m4 6 8 6 8-6"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default EmailIcon;
