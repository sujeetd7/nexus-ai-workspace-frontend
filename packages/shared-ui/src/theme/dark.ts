import { breakpoints } from "../responsive";
import { animations } from "./animations";
import { darkColors } from "./darkColors";
import { elevation } from "./elevation";
import { opacity } from "./opacity";
import { radius } from "./radius";
import { darkSemanticColors } from "./semanticColors";
import { shadows } from "./shadows";
import { spacing } from "./spacing";
import { typography } from "./typography";
import { zIndex } from "./zIndex";

export { darkColors } from "./darkColors";

export const darkTheme = {
  mode: "dark" as const,

  colors: darkColors,

  semantic: darkSemanticColors,

  spacing,

  radius,

  typography,

  elevation,

  opacity,

  shadows,

  animations,

  /** Motion duration tokens — alias of `animations` (no duplicated values). */
  motion: animations,

  breakpoints,

  zIndex,
} as const;

export type DarkTheme = typeof darkTheme;
