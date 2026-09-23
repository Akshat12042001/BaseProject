import React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

const UserPlusIcon = ({color = '#2F6FED', size = 17, ...props}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx={9} cy={8} r={3} stroke={color} strokeWidth={1.6} />
    <Path
      d="M4 19c.8-2.8 2.8-4.5 5-4.5s4.2 1.7 5 4.5"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
    <Path
      d="M17 8v6M14 11h6"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  </Svg>
);

export default UserPlusIcon;
