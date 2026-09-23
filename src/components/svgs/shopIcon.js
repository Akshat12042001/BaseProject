import React from 'react';
import Svg, {Path} from 'react-native-svg';

const ShopIcon = ({color = '#C9A227', size = 12, ...props}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M4 9.5 5.8 4h12.4L20 9.5M4 9.5h16v2.5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V9.5ZM8 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm8 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ShopIcon;
