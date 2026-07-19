export const animations = {
  fast: 150,

  normal: 250,

  slow: 400,

  slower: 600,
} as const;

export type Animations = typeof animations;
