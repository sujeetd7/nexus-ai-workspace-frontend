import { opacity } from "../../theme/opacity";
import { typography } from "../../theme/typography";
import type { Theme } from "../../types/theme";
import type { LinkVariant } from "./Link.types";

export function resolveLinkColor(
  theme: Theme,
  variant: LinkVariant,
): string {
  switch (variant) {
    case "subtle":
      return theme.semantic.textSecondary;
    case "destructive":
      return theme.semantic.danger;
    case "default":
    default:
      return theme.semantic.primary;
  }
}

export function resolveLinkTypography() {
  return {
    fontFamily: typography.fontFamily,
    fontSize: typography.size.body,
    lineHeight: typography.lineHeight.body,
    fontWeight: typography.fontWeight.medium,
    opacityDisabled: opacity.disabled,
    opacityHover: opacity.hover,
    opacityPressed: opacity.pressed,
  };
}

export function resolveLinkAccessibleName(
  accessibilityLabel: string | undefined,
  children: unknown,
): string | undefined {
  return (
    accessibilityLabel ??
    (typeof children === "string" ? children : undefined)
  );
}
