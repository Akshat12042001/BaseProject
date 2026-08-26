import * as React from "react";
import Svg, { Circle } from "react-native-svg";
const SVGComponent = ({ color = '#000000', ...props }) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle cx={5} cy={12} r={1.5} fill={color} />
    <Circle cx={12} cy={12} r={1.5} fill={color} />
    <Circle cx={19} cy={12} r={1.5} fill={color} />
  </Svg>
);
export default SVGComponent;
