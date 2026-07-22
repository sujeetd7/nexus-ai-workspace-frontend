import { createFont, createTokens } from "@tamagui/core";

import { breakpoints } from "../responsive/breakpoints";
import { animations } from "../theme/animations";
import { colors } from "../theme/colors";
import { darkColors } from "../theme/darkColors";
import { elevation } from "../theme/elevation";
import { opacity } from "../theme/opacity";
import { radius } from "../theme/radius";
import {
  darkSemanticColors,
  lightSemanticColors,
} from "../theme/semanticColors";
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
    display: typography.size.display,
    h1: typography.size.h1,
    h2: typography.size.h2,
    h3: typography.size.h3,
    body: typography.size.body,
    caption: typography.size.caption,
    label: typography.size.label,
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
  // Motion duration strings only — no animation driver in Batch 2.2.
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
      display: typography.size.display,
      h1: typography.size.h1,
      h2: typography.size.h2,
      h3: typography.size.h3,
      body: typography.size.body,
      caption: typography.size.caption,
      label: typography.size.label,
    },
    lineHeight: {
      display: typography.lineHeight.display,
      h1: typography.lineHeight.h1,
      h2: typography.lineHeight.h2,
      h3: typography.lineHeight.h3,
      body: typography.lineHeight.body,
      caption: typography.lineHeight.caption,
      label: typography.lineHeight.label,
    },
    weight: {
      4: typography.fontWeight.regular,
      5: typography.fontWeight.medium,
      6: typography.fontWeight.semibold,
      7: typography.fontWeight.bold,
    },
    letterSpacing: {
      display: typography.letterSpacing.display,
      h1: typography.letterSpacing.h1,
      h2: typography.letterSpacing.h2,
      h3: typography.letterSpacing.h3,
      body: typography.letterSpacing.body,
      caption: typography.letterSpacing.caption,
      label: typography.letterSpacing.label,
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
    background: lightSemanticColors.background,
    color: lightSemanticColors.text,
    colorSecondary: lightSemanticColors.textSecondary,
    borderColor: lightSemanticColors.border,
    surface: lightSemanticColors.surface,
    primary: lightSemanticColors.primary,
    secondary: lightSemanticColors.secondary,
    success: lightSemanticColors.success,
    warning: lightSemanticColors.warning,
    danger: lightSemanticColors.danger,
    info: lightSemanticColors.info,
    onPrimary: lightSemanticColors.onPrimary,
    onDanger: lightSemanticColors.onDanger,
    focusRing: lightSemanticColors.focusRing,
  },
  dark: {
    background: darkSemanticColors.background,
    color: darkSemanticColors.text,
    colorSecondary: darkSemanticColors.textSecondary,
    borderColor: darkSemanticColors.border,
    surface: darkSemanticColors.surface,
    primary: darkSemanticColors.primary,
    secondary: darkSemanticColors.secondary,
    success: darkSemanticColors.success,
    warning: darkSemanticColors.warning,
    danger: darkSemanticColors.danger,
    info: darkSemanticColors.info,
    onPrimary: darkSemanticColors.onPrimary,
    onDanger: darkSemanticColors.onDanger,
    focusRing: darkSemanticColors.focusRing,
  },
} as const;
