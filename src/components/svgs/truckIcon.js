import React from 'react';
import Svg, {Path} from 'react-native-svg';

const TruckIcon = ({color = '#9DA89F', size = 18, ...props}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M3.5 7.5h10v8H7.2M13.5 10.5H18l2.5 3v2h-7v-5ZM7 17.8a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6Zm10.5 0a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6Z"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default TruckIcon;
