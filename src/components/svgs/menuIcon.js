import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SVGComponent = ({ color = '#000000', ...props }) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path d="M7 3V9" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    <Path
      d="M5 3V9C5 10.1 5.9 11 7 11C8.1 11 9 10.1 9 9V3"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
    />
    <Path
      d="M7 11V21"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
    />
    <Path
      d="M15 3V21"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
    />
    <Path
      d="M15 3C18 5.2 18 9.2 15 11"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
    />
  </Svg>
);
export default SVGComponent;
