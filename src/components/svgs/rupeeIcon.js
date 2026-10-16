import React from 'react';
import Svg, {Path} from 'react-native-svg';

const RupeeIcon = ({color = '#9DA89F', size = 18, ...props}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M7 6.5h10M7 10h10M13.5 6.5A3.5 3.5 0 0 1 10 13.5H7l7.5 5"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default RupeeIcon;
