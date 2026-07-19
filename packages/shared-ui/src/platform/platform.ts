export const PlatformType = {
  Web: "web",

  Mobile: "mobile",
} as const;

export type PlatformName = (typeof PlatformType)[keyof typeof PlatformType];

export function getPlatform(): PlatformName {
  return typeof window === "undefined" ? PlatformType.Mobile : PlatformType.Web;
}
