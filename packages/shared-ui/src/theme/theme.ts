import { breakpoints } from "../responsive";
import { animations } from "./animations";
import { colors } from "./colors";
import { opacity } from "./opacity";
import { radius } from "./radius";
import { shadows } from "./shadows";
import { spacing } from "./spacing";
import { typography } from "./typography";
import { zIndex } from "./zIndex";

export const theme = {
  colors,

  spacing,

  radius,

  typography,

  shadows,

  breakpoints,

  opacity,

  animations,

  zIndex,
} as const;
