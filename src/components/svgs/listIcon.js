import React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';
import {COLORS} from '../../constants';

const ListIcon = ({color = COLORS.LOGIN_PRIMARY, size = 17, ...props}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx={5} cy={7} r={1} fill={color} />
    <Circle cx={5} cy={12} r={1} fill={color} />
    <Circle cx={5} cy={17} r={1} fill={color} />
    <Path d="M9 7h10M9 12h10M9 17h10" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
  </Svg>
);

export default ListIcon;
