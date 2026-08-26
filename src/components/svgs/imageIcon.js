import React from 'react';
import Svg, {Circle, Path, Rect} from 'react-native-svg';
import {COLORS} from '../../constants';

const ImageIcon = ({color = COLORS.SUCCESS, ...props}) => (
  <Svg width={21} height={21} viewBox="0 0 24 24" fill="none" {...props}>
    <Rect
      x={3.5}
      y={4}
      width={17}
      height={16}
      rx={2.5}
      stroke={color}
      strokeWidth={1.6}
    />
    <Circle cx={9} cy={9.5} r={1.5} fill={color} />
    <Path
      d="m6.5 17 4-4 2.7 2.5 2.3-2 2.5 3.5"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ImageIcon;
