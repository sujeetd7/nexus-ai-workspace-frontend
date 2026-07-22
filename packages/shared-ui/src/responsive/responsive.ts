import { BREAKPOINT_ORDER, breakpoints, type BreakpointName } from "./breakpoints";

export type DeviceClass = "mobile" | "tablet" | "desktop";

/**
 * Interprets a width (viewport or window) against the shared breakpoint scale.
 * Platform-agnostic: callers supply the width from browser viewport or RN dimensions.
 */
export function resolveBreakpoint(width: number): BreakpointName {
  let resolved: BreakpointName = "xs";

  for (const name of BREAKPOINT_ORDER) {
    if (width >= breakpoints[name]) {
      resolved = name;
    }
  }

  return resolved;
}

export function getDeviceClass(width: number): DeviceClass {
  if (isMobile(width)) {
    return "mobile";
  }
  if (isTablet(width)) {
    return "tablet";
  }
  return "desktop";
}

export function isMobile(width: number): boolean {
  return width < breakpoints.md;
}

export function isTablet(width: number): boolean {
  return width >= breakpoints.md && width < breakpoints.lg;
}

export function isDesktop(width: number): boolean {
  return width >= breakpoints.lg;
}
