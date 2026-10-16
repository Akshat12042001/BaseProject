import * as React from "react";
import Svg, { Path } from "react-native-svg";
const BagIcon = ({ color = '#0D0D0D', size = 24, ...props }) => (
  <Svg
    className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-q7mezt"
    focusable="false"
    aria-hidden="true"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill={color}
    {...props}
  >
    <Path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2m-8 4c0 .55-.45 1-1 1s-1-.45-1-1V8h2zm2-6c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2m4 6c0 .55-.45 1-1 1s-1-.45-1-1V8h2z" />
  </Svg>
);
export default BagIcon;
