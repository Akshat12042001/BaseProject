import React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';
import {COLORS} from '../../constants';

const ClockIcon = ({color = COLORS.MENU_ICON_MUTED, ...props}) => (
  <Svg width={11} height={11} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx={12} cy={12} r={8.5} stroke={color} strokeWidth={1.8} />
    <Path
      d="M12 7.5V12l3 2"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ClockIcon;
