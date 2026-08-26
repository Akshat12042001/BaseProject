import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { COLORS } from "../../constants";
const SVGComponent = ({color = COLORS.TEXT, size = 1, ...props}) => (
  <Svg
    className="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall css-192ol7l"
    focusable="false"
    aria-hidden="true"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...props}
  >
    <Path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3m-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3m0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5m8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5" />
  </Svg>
);
export default SVGComponent;
