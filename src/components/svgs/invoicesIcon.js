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
      d="M6 3.5H18V20.5L16 19L14 20.5L12 19L10 20.5L8 19L6 20.5V3.5Z"
      stroke={color}
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
    <Path
      d="M9 8H15"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
    <Path
      d="M9 11H15"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
    <Path
      d="M9 14H13"
      stroke="#AAB8AD"
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  </Svg>
);
export default SVGComponent;
