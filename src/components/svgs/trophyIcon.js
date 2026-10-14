import React from 'react';
import Svg, {Path} from 'react-native-svg';

const TrophyIcon = ({color = '#2F6FED', size = 18, ...props}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M8 4h8v3.5a4 4 0 0 1-8 0V4Z"
      stroke={color}
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
    <Path
      d="M8 6H5.8A2.8 2.8 0 0 0 3 8.8V9a3 3 0 0 0 3 3h.5M16 6h2.2A2.8 2.8 0 0 1 21 8.8V9a3 3 0 0 1-3 3h-.5"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
    <Path
      d="M10 14.5h4M12 11.5v3M9 20h6M12 17.5V20"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default TrophyIcon;
