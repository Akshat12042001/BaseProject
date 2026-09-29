import React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';
import {COLORS} from '../../constants';

const DollarCircleIcon = ({color = COLORS.TEXT, size = 18, ...props}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.6} />
    <Path
      d="M12 7v10M14.5 9.2c0-1-1.1-1.7-2.5-1.7s-2.5.7-2.5 1.7c0 2.4 5 1.2 5 3.6 0 1-1.1 1.7-2.5 1.7s-2.5-.7-2.5-1.7"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default DollarCircleIcon;
