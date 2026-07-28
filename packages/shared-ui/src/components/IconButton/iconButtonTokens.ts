import { MIN_TOUCH_TARGET_SIZE } from "../../accessibility/touchTargets";
import { opacity } from "../../theme/opacity";
import { radius } from "../../theme/radius";
import { spacing } from "../../theme/spacing";
import type { Theme } from "../../types/theme";
import { resolveButtonSurface } from "../Button/buttonTokens";
import type {
  IconButtonShape,
  IconButtonSize,
  IconButtonVariant,
} from "./IconButton.types";

const iconButtonSizeMap: Record<IconButtonSize, number> = {
  sm: MIN_TOUCH_TARGET_SIZE,
  md: MIN_TOUCH_TARGET_SIZE,
  lg: spacing.xxxl + spacing.sm,
};

export function resolveIconButtonSurface(
  theme: Theme,
  variant: IconButtonVariant,
) {
  return resolveButtonSurface(theme, variant);
}

export function resolveIconButtonLayout(
  size: IconButtonSize,
  shape: IconButtonShape = "default",
) {
  const dimension = iconButtonSizeMap[size];
  const borderRadius =
    shape === "pill" || shape === "circle"
      ? radius.pill
      : radius.md;

  return {
    width: dimension,
    height: dimension,
    minHeight: MIN_TOUCH_TARGET_SIZE,
    minWidth: MIN_TOUCH_TARGET_SIZE,
    borderRadius,
    borderWidth: 1,
    opacityDisabled: opacity.disabled,
    opacityHover: opacity.hover,
    opacityPressed: opacity.pressed,
  };
}

export function resolveIconButtonAccessibleName(
  loading: boolean,
  accessibilityLabel: string,
): string {
  if (loading) {
    return `${accessibilityLabel}, loading`;
  }
  return accessibilityLabel;
}
