import { MIN_TOUCH_TARGET_SIZE } from "../../accessibility/touchTargets";
import { opacity } from "../../theme/opacity";
import { radius } from "../../theme/radius";
import { spacing } from "../../theme/spacing";
import type { Theme } from "../../types/theme";

export function resolveListRowSurface(
  theme: Theme,
  selected: boolean,
): {
  backgroundColor: string;
  borderWidth: number;
  borderColor: string;
} {
  return {
    backgroundColor: selected
      ? theme.semantic.surfaceMuted
      : theme.semantic.surface,
    borderWidth: selected ? 1 : 0,
    borderColor: selected ? theme.semantic.primary : "transparent",
  };
}

export function resolveListRowLayout(): {
  minHeight: number;
  paddingHorizontal: number;
  paddingVertical: number;
  gap: number;
  borderRadius: number;
  opacityDisabled: number;
  opacityPressed: number;
} {
  return {
    minHeight: MIN_TOUCH_TARGET_SIZE,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.md,
    borderRadius: radius.md,
    opacityDisabled: opacity.disabled,
    opacityPressed: opacity.pressed,
  };
}
