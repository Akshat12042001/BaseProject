import React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';
import {COLORS} from '../../constants';

const ShareIcon = ({color = COLORS.TEXT, size = 18, ...props}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx={18} cy={5} r={2.5} stroke={color} strokeWidth={1.6} />
    <Circle cx={6} cy={12} r={2.5} stroke={color} strokeWidth={1.6} />
    <Circle cx={18} cy={19} r={2.5} stroke={color} strokeWidth={1.6} />
    <Path
      d="M8.2 11 15.8 6.3M8.2 13l7.6 4.7"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  </Svg>
);

export default ShareIcon;
