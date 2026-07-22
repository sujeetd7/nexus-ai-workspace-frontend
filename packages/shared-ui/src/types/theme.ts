import type { breakpoints } from "../responsive";
import type { animations } from "../theme/animations";
import type { colors } from "../theme/colors";
import type { elevation } from "../theme/elevation";
import type { opacity } from "../theme/opacity";
import type { radius } from "../theme/radius";
import type { SemanticColors } from "../theme/semanticColors";
import type { shadows } from "../theme/shadows";
import type { spacing } from "../theme/spacing";
import type { typography } from "../theme/typography";
import type { zIndex } from "../theme/zIndex";

export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type Typography = typeof typography;
export type Radius = typeof radius;
export type Shadows = typeof shadows;
export type Breakpoints = typeof breakpoints;
export type Opacity = typeof opacity;
export type Animations = typeof animations;
export type Motion = typeof animations;
export type ZIndex = typeof zIndex;

export interface Theme {
  mode: "light" | "dark";
  colors: Colors | Record<string, unknown>;
  semantic: SemanticColors;
  spacing: Spacing;
  typography: Typography;
  radius: Radius;
  elevation: typeof elevation;
  shadows: Shadows;
  breakpoints: Breakpoints;
  opacity: Opacity;
  animations: Animations;
  motion: Motion;
  zIndex: ZIndex;
}
