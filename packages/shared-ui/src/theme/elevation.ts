export const elevation = {
  none: 0,

  xs: 1,

  sm: 2,

  md: 4,

  lg: 8,

  xl: 16,
} as const;

export type Elevation = typeof elevation;
