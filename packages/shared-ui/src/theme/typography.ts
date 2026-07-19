export const fontFamily = {
  regular: "System",
  medium: "System",
  semibold: "System",
  bold: "System",
} as const;

export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
  "5xl": 48,
} as const;

export const lineHeight = {
  xs: 18,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  "2xl": 36,
  "3xl": 42,
  "4xl": 48,
  "5xl": 56,
} as const;

export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
} as const;

export const typography = {
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing,
} as const;

export type Typography = typeof typography;
