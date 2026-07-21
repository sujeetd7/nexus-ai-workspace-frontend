import { breakpoints } from "../responsive";
import { animations } from "./animations";
import { elevation } from "./elevation";
import { opacity } from "./opacity";
import { radius } from "./radius";
import { shadows } from "./shadows";
import { spacing } from "./spacing";
import { typography } from "./typography";
import { zIndex } from "./zIndex";

export const darkColors = {
  primary: "#3B82F6",

  secondary: "#8B5CF6",

  success: "#22C55E",

  warning: "#F59E0B",

  danger: "#EF4444",

  background: "#121212",

  surface: "#1E1E1E",

  text: "#FFFFFF",

  border: "#333333",
};

export const darkTheme = {
  mode: "dark",

  colors: darkColors,

  spacing,

  radius,

  typography,

  elevation,

  opacity,

  shadows,

  animations,

  breakpoints,

  zIndex,
} as const;
