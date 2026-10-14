import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../constants';

const PhoneIcon = ({color = COLORS.LOGIN_PRIMARY, size = 20, ...props}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M8.2 3.8h2.1c.5 0 .9.3 1 .8l.6 2.4a1 1 0 0 1-.3 1L9.9 9.6a11.8 11.8 0 0 0 4.5 4.5l1.6-1.7a1 1 0 0 1 1-.3l2.4.6c.5.1.8.5.8 1v2.1c0 .8-.6 1.4-1.4 1.4A14.6 14.6 0 0 1 4.8 5.2c0-.8.6-1.4 1.4-1.4Z"
      stroke={color}
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
  </Svg>
);

export default PhoneIcon;
