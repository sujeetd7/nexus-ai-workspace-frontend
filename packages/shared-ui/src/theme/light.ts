import { breakpoints } from "../responsive";
import { animations } from "./animations";
import { colors } from "./colors";
import { elevation } from "./elevation";
import { opacity } from "./opacity";
import { radius } from "./radius";
import { lightSemanticColors } from "./semanticColors";
import { shadows } from "./shadows";
import { spacing } from "./spacing";
import { typography } from "./typography";
import { zIndex } from "./zIndex";

export const lightTheme = {
  mode: "light" as const,

  colors,

  semantic: lightSemanticColors,

  spacing,

  radius,

  typography,

  elevation,

  breakpoints,

  opacity,

  shadows,

  animations,

  /** Motion duration tokens — alias of `animations` (no duplicated values). */
  motion: animations,

  zIndex,
} as const;

export type LightTheme = typeof lightTheme;
