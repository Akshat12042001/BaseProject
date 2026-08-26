import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../constants';

const ChevronRightIcon = ({color = COLORS.MENU_ICON_MUTED, ...props}) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="m9 6 6 6-6 6"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ChevronRightIcon;
