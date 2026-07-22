import { createFont, createTokens } from "@tamagui/core";

import { breakpoints } from "../responsive/breakpoints";
import { animations } from "../theme/animations";
import { colors } from "../theme/colors";
import { darkColors } from "../theme/dark";
import { elevation } from "../theme/elevation";
import { opacity } from "../theme/opacity";
import { radius } from "../theme/radius";
import { shadows } from "../theme/shadows";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import { zIndex } from "../theme/zIndex";

/**
 * Maps existing Nexus theme modules into Tamagui tokens.
 * Values are imported only — no duplicated design literals.
 */
export const tokens = createTokens({
  color: {
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
    info: colors.info,
    white: colors.white,
    black: colors.black,
    transparent: colors.transparent,
    gray50: colors.gray[50],
    gray100: colors.gray[100],
    gray200: colors.gray[200],
    gray300: colors.gray[300],
    gray400: colors.gray[400],
    gray500: colors.gray[500],
    gray600: colors.gray[600],
    gray700: colors.gray[700],
    gray800: colors.gray[800],
    gray900: colors.gray[900],
    darkPrimary: darkColors.primary,
    darkSecondary: darkColors.secondary,
    darkSuccess: darkColors.success,
    darkWarning: darkColors.warning,
    darkDanger: darkColors.danger,
    darkBackground: darkColors.background,
    darkSurface: darkColors.surface,
    darkText: darkColors.text,
    darkBorder: darkColors.border,
  },
  space: {
    xs: spacing.xs,
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
    xl: spacing.xl,
    xxl: spacing.xxl,
    xxxl: spacing.xxxl,
  },
  size: {
    xs: spacing.xs,
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
    xl: spacing.xl,
    xxl: spacing.xxl,
    xxxl: spacing.xxxl,
    display: typography.display,
    h1: typography.h1,
    h2: typography.h2,
    h3: typography.h3,
    body: typography.body,
    caption: typography.caption,
    label: typography.label,
  },
  // Numeric radius keys only — `radius.circle` ("50%") remains on the Nexus theme object.
  radius: {
    none: radius.none,
    sm: radius.sm,
    md: radius.md,
    lg: radius.lg,
    xl: radius.xl,
    pill: radius.pill,
  },
  zIndex: {
    dropdown: zIndex.dropdown,
    sticky: zIndex.sticky,
    modal: zIndex.modal,
    popover: zIndex.popover,
    toast: zIndex.toast,
    tooltip: zIndex.tooltip,
  },
  opacity: {
    disabled: opacity.disabled,
    hover: opacity.hover,
    pressed: opacity.pressed,
  },
  elevation: {
    none: elevation.none,
    xs: elevation.xs,
    sm: elevation.sm,
    md: elevation.md,
    lg: elevation.lg,
    xl: elevation.xl,
  },
  shadow: {
    sm: shadows.sm,
    md: shadows.md,
    lg: shadows.lg,
  },
  // Duration strings only — no animation driver in Batch 2.1.
  duration: {
    fast: animations.fast,
    normal: animations.normal,
    slow: animations.slow,
  },
});

export const fonts = {
  body: createFont({
    family: typography.fontFamily,
    size: {
      display: typography.display,
      h1: typography.h1,
      h2: typography.h2,
      h3: typography.h3,
      body: typography.body,
      caption: typography.caption,
      label: typography.label,
    },
  }),
};

export const media = {
  xs: { maxWidth: breakpoints.sm },
  sm: { minWidth: breakpoints.sm },
  md: { minWidth: breakpoints.md },
  lg: { minWidth: breakpoints.lg },
  xl: { minWidth: breakpoints.xl },
} as const;

export const themes = {
  light: {
    background: colors.white,
    color: colors.gray[900],
    borderColor: colors.gray[200],
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
    info: colors.info,
  },
  dark: {
    background: darkColors.background,
    color: darkColors.text,
    borderColor: darkColors.border,
    primary: darkColors.primary,
    secondary: darkColors.secondary,
    success: darkColors.success,
    warning: darkColors.warning,
    danger: darkColors.danger,
    info: colors.info,
    surface: darkColors.surface,
  },
} as const;
