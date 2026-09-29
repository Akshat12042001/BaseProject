import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../constants';

const DownloadIcon = ({color = COLORS.TEXT, size = 18, ...props}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 4v10m0 0 3.5-3.5M12 14l-3.5-3.5M5 18h14"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default DownloadIcon;
