import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SVGComponent = ({color = COLORS.RED_ERROR, size = 24, ...props}) => (
  <Svg
    className="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall css-vh810p"
    focusable="false"
    aria-hidden="true"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill={color}
    {...props}
  >
    <Path d="m17 7-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4z" />
  </Svg>
);
export default SVGComponent;
