import React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';
import {COLORS} from '../../constants';

const BellIcon = ({
  color = COLORS.SURFACE,
  accentColor = COLORS.NOTIFICATION_ACCENT,
  ...props
}) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M6.5 9.5a5.5 5.5 0 0 1 11 0v3.15c0 .78.28 1.54.8 2.12l.7.78H5l.7-.78c.52-.58.8-1.34.8-2.12V9.5Z"
      stroke={color}
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
    <Path
      d="M10 18a2.2 2.2 0 0 0 4 0"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
    <Circle cx={18.5} cy={5.5} r={2.2} fill={accentColor} />
  </Svg>
);

export default BellIcon;
