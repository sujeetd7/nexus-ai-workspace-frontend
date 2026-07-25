import { MIN_TOUCH_TARGET_SIZE } from "../../accessibility/touchTargets";
import { opacity } from "../../theme/opacity";
import { radius } from "../../theme/radius";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";
import type { Theme } from "../../types/theme";

export function resolveCheckboxSurface(
  theme: Theme,
  checked: boolean,
  indeterminate: boolean,
): { backgroundColor: string; borderColor: string; markColor: string } {
  if (checked || indeterminate) {
    return {
      backgroundColor: theme.semantic.primary,
      borderColor: theme.semantic.primary,
      markColor: theme.semantic.onPrimary,
    };
  }
  return {
    backgroundColor: theme.semantic.surface,
    borderColor: theme.semantic.border,
    markColor: theme.semantic.onPrimary,
  };
}

export function resolveCheckboxLayout() {
  return {
    boxSize: spacing.lg,
    minTarget: MIN_TOUCH_TARGET_SIZE,
    gap: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    fontFamily: typography.fontFamily,
    fontSize: typography.size.label,
    lineHeight: typography.lineHeight.label,
    fontWeight: typography.fontWeight.medium,
    opacityDisabled: opacity.disabled,
    opacityPressed: opacity.pressed,
  };
}
