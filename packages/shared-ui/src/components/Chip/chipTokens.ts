import { MIN_TOUCH_TARGET_SIZE } from "../../accessibility/touchTargets";
import { opacity } from "../../theme/opacity";
import { radius } from "../../theme/radius";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";
import type { Theme } from "../../types/theme";
import type { ChipTone } from "./Chip.types";

export function resolveChipSurface(
  theme: Theme,
  selected: boolean,
  tone: ChipTone = "default",
): { backgroundColor: string; borderColor: string; color: string } {
  if (selected) {
    return {
      backgroundColor: theme.semantic.primary,
      borderColor: theme.semantic.primary,
      color: theme.semantic.onPrimary,
    };
  }

  if (tone === "muted") {
    return {
      backgroundColor: theme.semantic.surfaceMuted,
      borderColor: theme.semantic.borderSubtle,
      color: theme.semantic.text,
    };
  }

  return {
    backgroundColor: theme.semantic.surface,
    borderColor: theme.semantic.border,
    color: theme.semantic.text,
  };
}

export function resolveChipLayout() {
  return {
    minHeight: MIN_TOUCH_TARGET_SIZE,
    minWidth: MIN_TOUCH_TARGET_SIZE,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    fontFamily: typography.fontFamily,
    fontSize: typography.size.label,
    lineHeight: typography.lineHeight.label,
    fontWeight: typography.fontWeight.medium,
    opacityDisabled: opacity.disabled,
    opacityPressed: opacity.pressed,
    focusRing: undefined as string | undefined,
  };
}

export function resolveChipAccessibleName(
  accessibilityLabel: string | undefined,
  children: unknown,
  selected: boolean,
): string | undefined {
  const base =
    accessibilityLabel ??
    (typeof children === "string" ? children : undefined);
  if (!base) {
    return selected ? "Selected" : undefined;
  }
  return selected ? `${base}, selected` : base;
}
