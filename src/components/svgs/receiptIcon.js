import React from 'react';
import Svg, {Line, Path} from 'react-native-svg';
import {COLORS} from '../../constants';

const ReceiptIcon = ({color = COLORS.SURFACE, ...props}) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M7 3.5h10v17l-2-1.35L13 20.5l-2-1.35L9 20.5l-2-1.35V3.5Z"
      stroke={color}
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
    <Line x1={9.5} y1={8} x2={14.5} y2={8} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    <Line x1={9.5} y1={11.5} x2={14.5} y2={11.5} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    <Line x1={9.5} y1={15} x2={12.5} y2={15} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

export default ReceiptIcon;
