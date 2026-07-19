import { breakpoints } from "../responsive";
import {
  animations,
  colors,
  elevation,
  opacity,
  radius,
  shadows,
  spacing,
  typography,
  zIndex,
} from "./index";

export const lightTheme = {
  mode: "light",

  colors,

  spacing,

  radius,

  typography,

  elevation,

  breakpoints,

  opacity,

  shadows,

  animations,

  zIndex,
} as const;
