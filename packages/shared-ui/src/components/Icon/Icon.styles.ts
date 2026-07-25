import { spacing } from "../../theme/spacing";
import type { IconSize } from "./Icon.types";

export const iconSizeMap: Record<IconSize, number> = {
  sm: spacing.lg,
  md: spacing.xl,
  lg: spacing.xxl,
};
