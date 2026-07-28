import { MIN_TOUCH_TARGET_SIZE } from "../../accessibility/touchTargets";
import { opacity } from "../../theme/opacity";
import { radius } from "../../theme/radius";
import { spacing } from "../../theme/spacing";
import type { Theme } from "../../types/theme";

/** Track size — thumb diameter uses spacing.lg (16); track fits touch target height. */
export const switchTrack = {
  width: spacing.xxxl + spacing.sm,
  height: spacing.xl + spacing.sm,
  padding: spacing.xs,
  thumbSize: spacing.lg,
  borderRadius: radius.pill,
} as const;

export function resolveSwitchSurface(
  theme: Theme,
  checked: boolean,
): { trackColor: string; thumbColor: string } {
  if (checked) {
    return {
      trackColor: theme.semantic.primary,
      thumbColor: theme.semantic.onPrimary,
    };
  }
  return {
    trackColor: theme.semantic.border,
    thumbColor: theme.semantic.surface,
  };
}

export function resolveSwitchLayout() {
  return {
    minHeight: MIN_TOUCH_TARGET_SIZE,
    minWidth: MIN_TOUCH_TARGET_SIZE,
    trackWidth: switchTrack.width,
    trackHeight: switchTrack.height,
    thumbSize: switchTrack.thumbSize,
    trackPadding: switchTrack.padding,
    borderRadius: switchTrack.borderRadius,
    opacityDisabled: opacity.disabled,
    opacityPressed: opacity.pressed,
  };
}
