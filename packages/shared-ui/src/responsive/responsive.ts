import { breakpoints } from "./breakpoints";

export function isMobile(width: number) {
  return width < breakpoints.md;
}

export function isTablet(width: number) {
  return width >= breakpoints.md && width < breakpoints.lg;
}

export function isDesktop(width: number) {
  return width >= breakpoints.lg;
}
