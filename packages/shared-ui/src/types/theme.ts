import type { Animations } from "../theme/animations";
import type { Breakpoints } from "../theme/breakpoints";
import type { Palette, SemanticColors } from "../theme/colors";
import type { Elevation } from "../theme/elevation";
import type { Opacity } from "../theme/opacity";
import type { Radius } from "../theme/radius";
import type { Shadows } from "../theme/shadows";
import type { Spacing } from "../theme/spacing";
import type { Typography } from "../theme/typography";
import type { ZIndex } from "../theme/zIndex";

export interface ThemeBase {
  spacing: Spacing;
  radius: Radius;
  opacity: Opacity;
  zIndex: ZIndex;
  animations: Animations;
  breakpoints: Breakpoints;

  palette: Palette;
  colors: SemanticColors;

  typography: Typography;

  elevation: Elevation;
  shadows: Shadows;
}
