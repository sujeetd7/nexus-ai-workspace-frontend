export const opacity = {
  disabled: 0.38,

  low: 0.54,

  medium: 0.72,

  high: 0.87,

  full: 1,
} as const;

export type Opacity = typeof opacity;
