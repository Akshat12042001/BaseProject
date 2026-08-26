import React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';
import {COLORS} from '../../constants';

const LoginEyeIcon = ({color = COLORS.LOGIN_ICON, size = 20, ...props}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}>
    <Path
      d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={12} cy={12} r={2.5} stroke={color} strokeWidth={1.8} />
  </Svg>
);

export default LoginEyeIcon;
