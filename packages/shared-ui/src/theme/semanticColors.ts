import { colors } from "./colors";
import { darkColors } from "./darkColors";

/**
 * Semantic color roles for light mode.
 * Values are derived from the palette source of truth — no new hex literals.
 */
export const lightSemanticColors = {
  background: colors.white,
  surface: colors.gray[50],
  text: colors.gray[900],
  textSecondary: colors.gray[600],
  border: colors.gray[200],
  primary: colors.primary,
  secondary: colors.secondary,
  success: colors.success,
  warning: colors.warning,
  danger: colors.danger,
  info: colors.info,
} as const;

/**
 * Semantic color roles for dark mode.
 * Values are derived from `darkColors` (and palette `info`) — no new hex literals.
 */
export const darkSemanticColors = {
  background: darkColors.background,
  surface: darkColors.surface,
  text: darkColors.text,
  textSecondary: colors.gray[400],
  border: darkColors.border,
  primary: darkColors.primary,
  secondary: darkColors.secondary,
  success: darkColors.success,
  warning: darkColors.warning,
  danger: darkColors.danger,
  info: colors.info,
} as const;

export type SemanticColors =
  | typeof lightSemanticColors
  | typeof darkSemanticColors;
