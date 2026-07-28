import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";
import type { AvatarSize } from "./Avatar.types";

/** Avatar dimensions — derived from spacing tokens (md = xl+lg = 40). */
export const avatarSizeMap: Record<AvatarSize, number> = {
  xs: spacing.xl,
  sm: spacing.xxl,
  md: spacing.xl + spacing.lg,
  lg: spacing.xxxl,
  xl: spacing.xxxl + spacing.lg,
};

export const avatarFontSizeMap: Record<AvatarSize, number> = {
  xs: typography.size.caption,
  sm: typography.size.label,
  md: typography.size.label,
  lg: typography.size.body,
  xl: typography.size.h3,
};

export function resolveAvatarLabel(
  decorative: boolean,
  alt: string | undefined,
  accessibilityLabel: string | undefined,
  initials: string | undefined,
): string | undefined {
  if (decorative) {
    return undefined;
  }
  return accessibilityLabel ?? alt ?? (initials ? `Avatar ${initials}` : "Avatar");
}
