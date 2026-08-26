import React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';
import {COLORS} from '../../constants';

const CalendarIcon = ({color = COLORS.LOGIN_ICON, size = 17, ...props}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Rect x={3} y={5} width={18} height={16} rx={2} stroke={color} strokeWidth={1.7} />
    <Path d="M7 3v4M17 3v4M3 10h18" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
  </Svg>
);

export default CalendarIcon;
