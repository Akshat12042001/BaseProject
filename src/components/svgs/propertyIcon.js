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
    <Path
      d="M4.5 10L12 4L19.5 10V20H4.5V10Z"
      stroke={color}
      strokeWidth={1.7}
      strokeLinejoin="round"
    />
    <Path
      d="M9 20V14H15V20"
      stroke={color}
      strokeWidth={1.7}
      strokeLinejoin="round"
    />
  </Svg>
);
export default SVGComponent;
