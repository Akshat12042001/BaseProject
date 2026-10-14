import React from 'react';
import Svg, {Path} from 'react-native-svg';

const TrendUpIcon = ({color = '#2B5D32', size = 18, ...props}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M4 16.5 9.5 11l3.5 3.5L20 7.5"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14.5 7.5H20V13"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default TrendUpIcon;
