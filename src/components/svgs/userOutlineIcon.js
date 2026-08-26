import React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';
import {COLORS} from '../../constants';

const UserOutlineIcon = ({color = COLORS.LOGIN_PRIMARY, size = 17, ...props}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx={12} cy={8} r={3.5} stroke={color} strokeWidth={1.6} />
    <Path d="M5 20c.7-3.5 3.3-5.5 7-5.5s6.3 2 7 5.5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
  </Svg>
);

export default UserOutlineIcon;
