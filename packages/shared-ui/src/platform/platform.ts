export const PlatformType = {
  Web: "web",

  Mobile: "mobile",
} as const;

export type PlatformName = (typeof PlatformType)[keyof typeof PlatformType];

export function getPlatform(): PlatformName {
  const host = globalThis as typeof globalThis & {
    document?: unknown;
    navigator?: { product?: string };
  };

  // Prefer document presence over navigator heuristics for web detection.
  if (typeof host.document !== "undefined") {
    return PlatformType.Web;
  }

  return PlatformType.Mobile;
}
