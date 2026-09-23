import React from 'react';
import Svg, {Path} from 'react-native-svg';

const StarIcon = ({color = '#C9A227', size = 17, ...props}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 3.5l2.35 4.76 5.25.76-3.8 3.7.9 5.23L12 15.9l-4.7 2.05.9-5.23-3.8-3.7 5.25-.76L12 3.5Z"
      stroke={color}
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
  </Svg>
);

export default StarIcon;
