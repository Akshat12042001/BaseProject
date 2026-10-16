import React from 'react';
import Svg, {Path} from 'react-native-svg';

const CheckCircleIcon = ({color = '#9DA89F', size = 18, ...props}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 3.8a8.2 8.2 0 1 1 0 16.4 8.2 8.2 0 0 1 0-16.4Z"
      stroke={color}
      strokeWidth={1.6}
    />
    <Path
      d="m8.5 12.2 2.3 2.3 4.7-4.8"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default CheckCircleIcon;
