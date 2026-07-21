import { breakpoints } from "../responsive";
import { animations } from "./animations";
import { colors } from "./colors";
import { elevation } from "./elevation";
import { opacity } from "./opacity";
import { radius } from "./radius";
import { shadows } from "./shadows";
import { spacing } from "./spacing";
import { typography } from "./typography";
import { zIndex } from "./zIndex";

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
