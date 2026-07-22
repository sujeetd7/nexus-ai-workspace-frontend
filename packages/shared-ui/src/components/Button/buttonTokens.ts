import { MIN_TOUCH_TARGET_SIZE } from "../../accessibility/touchTargets";
import { opacity } from "../../theme/opacity";
import { radius } from "../../theme/radius";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";
import type { Theme } from "../../types/theme";
import type { ButtonSize, ButtonVariant } from "./Button.types";

export const labelColor: Record<
  ButtonVariant,
  "onPrimary" | "text" | "primary" | "onDanger"
> = {
  primary: "onPrimary",
  secondary: "text",
  ghost: "primary",
  destructive: "onDanger",
};

const sizePadding: Record<
  ButtonSize,
  { paddingHorizontal: number; paddingVertical: number; gap: number }
> = {
  sm: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  md: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  lg: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
};

export function resolveButtonSurface(
  theme: Theme,
  variant: ButtonVariant,
): { backgroundColor: string; borderColor: string; color: string } {
  switch (variant) {
    case "primary":
      return {
        backgroundColor: theme.semantic.primary,
        borderColor: theme.semantic.primary,
        color: theme.semantic.onPrimary,
      };
    case "secondary":
      return {
        backgroundColor: theme.semantic.surface,
        borderColor: theme.semantic.border,
        color: theme.semantic.text,
      };
    case "ghost":
      return {
        backgroundColor: "transparent",
        borderColor: "transparent",
        color: theme.semantic.primary,
      };
    case "destructive":
      return {
        backgroundColor: theme.semantic.danger,
        borderColor: theme.semantic.danger,
        color: theme.semantic.onDanger,
      };
  }
}

export function resolveButtonLayout(size: ButtonSize, fullWidth: boolean) {
  const padding = sizePadding[size];
  return {
    ...padding,
    minHeight: MIN_TOUCH_TARGET_SIZE,
    minWidth: MIN_TOUCH_TARGET_SIZE,
    borderRadius: radius.md,
    borderWidth: 1,
    fontFamily: typography.fontFamily,
    fontSize:
      size === "sm" ? typography.size.label : typography.size.body,
    lineHeight:
      size === "sm" ? typography.lineHeight.label : typography.lineHeight.body,
    fontWeight: typography.fontWeight.semibold,
    width: fullWidth ? ("100%" as const) : undefined,
    alignSelf: fullWidth ? ("stretch" as const) : undefined,
    opacityDisabled: opacity.disabled,
    opacityHover: opacity.hover,
    opacityPressed: opacity.pressed,
    focusRing: undefined as string | undefined,
  };
}

export function resolveAccessibleName(
  loading: boolean,
  accessibilityLabel: string | undefined,
  children: unknown,
): string | undefined {
  const label =
    accessibilityLabel ??
    (typeof children === "string" ? children : undefined);
  if (loading) {
    return `${label ?? "Button"}, loading`;
  }
  return label;
}
