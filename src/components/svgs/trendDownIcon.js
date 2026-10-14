import React from 'react';
import Svg, {Path} from 'react-native-svg';

const TrendDownIcon = ({color = '#D46D58', size = 18, ...props}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M4 7.5 9.5 13l3.5-3.5L20 16.5"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14.5 16.5H20V11"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default TrendDownIcon;
