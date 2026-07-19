export const palette = {
  white: "#FFFFFF",
  black: "#000000",

  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray800: "#1F2937",
  gray900: "#111827",

  blue50: "#EFF6FF",
  blue100: "#DBEAFE",
  blue500: "#3B82F6",
  blue600: "#2563EB",
  blue700: "#1D4ED8",

  green500: "#22C55E",
  yellow500: "#EAB308",
  orange500: "#F97316",
  red500: "#EF4444",

  transparent: "transparent",
} as const;

export const semanticColors = {
  primary: palette.blue600,
  primaryHover: palette.blue700,

  success: palette.green500,
  warning: palette.orange500,
  error: palette.red500,

  background: palette.white,
  surface: palette.gray50,

  text: palette.gray900,
  textSecondary: palette.gray600,

  border: palette.gray200,

  divider: palette.gray100,
} as const;

export type Palette = typeof palette;
export type SemanticColors = typeof semanticColors;
