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

/**
 * Neutral theme bag (mode-agnostic foundations).
 * Prefer `lightTheme` / `darkTheme` / `createTheme` for runtime theming.
 */
export const theme = {
  colors,

  semantic: lightSemanticColors,

  spacing,

  radius,

  typography,

  elevation,

  shadows,

  breakpoints,

  opacity,

  animations,

  motion: animations,

  zIndex,
} as const;
