import React from 'react';
import Svg, {Path} from 'react-native-svg';

const BrushIcon = ({color = '#6B4EAA', size = 17, ...props}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M14.5 4.5 19.5 9.5c.8.8.8 2.1 0 2.9l-7.8 7.8c-.5.5-1.2.8-1.9.8H6.5v-3.3c0-.7.3-1.4.8-1.9l7.8-7.8c.8-.8 2.1-.8 2.9 0Z"
      stroke={color}
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
    <Path
      d="M13 6l5 5"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  </Svg>
);

export default BrushIcon;
