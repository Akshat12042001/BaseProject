import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../constants';

const LocationPinIcon = ({color = COLORS.TEXT_SECONDARY, size = 12, ...props}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 21s6-5.2 6-10a6 6 0 10-12 0c0 4.8 6 10 6 10z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
    <Path
      d="M12 11a2 2 0 100-4 2 2 0 000 4z"
      stroke={color}
      strokeWidth={1.8}
    />
  </Svg>
);

export default LocationPinIcon;
