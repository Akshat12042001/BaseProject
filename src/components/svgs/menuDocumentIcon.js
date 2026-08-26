import React from 'react';
import Svg, {Line, Rect} from 'react-native-svg';

const MenuDocumentIcon = ({
  backgroundColor,
  borderColor,
  accentColor,
  lineColor,
  ...props
}) => (
  <Svg width={46} height={58} viewBox="0 0 46 58" fill="none" {...props}>
    <Rect
      x={0.75}
      y={0.75}
      width={44.5}
      height={56.5}
      rx={5.25}
      fill={backgroundColor}
      stroke={borderColor}
      strokeWidth={1.5}
    />
    <Rect x={6} y={7} width={34} height={7} rx={1.5} fill={accentColor} />
    <Line x1={7} y1={20} x2={37} y2={20} stroke={lineColor} strokeWidth={2} strokeLinecap="round" />
    <Line x1={7} y1={26} x2={33} y2={26} stroke={lineColor} strokeWidth={2} strokeLinecap="round" />
    <Line x1={7} y1={32} x2={37} y2={32} stroke={lineColor} strokeWidth={2} strokeLinecap="round" />
    <Line x1={7} y1={38} x2={29} y2={38} stroke={lineColor} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

export default MenuDocumentIcon;
