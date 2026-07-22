type MediaQueryListLike = {
  matches: boolean;
  addEventListener?: (
    type: "change",
    listener: (event: { matches: boolean }) => void,
  ) => void;
  removeEventListener?: (
    type: "change",
    listener: (event: { matches: boolean }) => void,
  ) => void;
  addListener?: (listener: (event: { matches: boolean }) => void) => void;
  removeListener?: (listener: (event: { matches: boolean }) => void) => void;
};

type MatchMediaHost = {
  matchMedia?: (query: string) => MediaQueryListLike;
};

type AccessibilityInfoLike = {
  isReduceMotionEnabled?: () => Promise<boolean>;
  addEventListener?: (
    event: "reduceMotionChanged",
    listener: (enabled: boolean) => void,
  ) => { remove: () => void };
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function getReactNativeAccessibilityInfo(): AccessibilityInfoLike | null {
  try {
    // Optional peer — resolved via Metro / react-native-web when available.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const rn = require("react-native") as {
      AccessibilityInfo?: AccessibilityInfoLike;
    };
    return rn.AccessibilityInfo ?? null;
  } catch {
    return null;
  }
}

/**
 * Synchronous reduced-motion preference.
 *
 * - Web / environments with `matchMedia`: uses `prefers-reduced-motion`.
 * - React Native without matchMedia: returns `false` (safe default). Use
 *   `subscribeReducedMotion` for authoritative native updates.
 * - SSR / tests without matchMedia: returns `false` without throwing.
 */
export function prefersReducedMotion(): boolean {
  const host = globalThis as typeof globalThis & MatchMediaHost;
  if (typeof host.matchMedia === "function") {
    return host.matchMedia(REDUCED_MOTION_QUERY).matches;
  }

  return false;
}

/**
 * Subscribe to reduced-motion preference changes.
 * Prefers React Native `AccessibilityInfo` when present; otherwise `matchMedia`.
 * Always returns a cleanup function (no-op when unavailable).
 */
export function subscribeReducedMotion(
  listener: (prefersReduced: boolean) => void,
): () => void {
  const accessibilityInfo = getReactNativeAccessibilityInfo();
  if (accessibilityInfo?.addEventListener) {
    void accessibilityInfo.isReduceMotionEnabled?.().then((enabled) => {
      listener(Boolean(enabled));
    });

    const subscription = accessibilityInfo.addEventListener(
      "reduceMotionChanged",
      listener,
    );
    return () => subscription.remove();
  }

  const host = globalThis as typeof globalThis & MatchMediaHost;
  if (typeof host.matchMedia !== "function") {
    return () => undefined;
  }

  const media = host.matchMedia(REDUCED_MOTION_QUERY);
  const onChange = (event: { matches: boolean }) => {
    listener(event.matches);
  };

  if (typeof media.addEventListener === "function") {
    media.addEventListener("change", onChange);
    return () => media.removeEventListener?.("change", onChange);
  }

  media.addListener?.(onChange);
  return () => media.removeListener?.(onChange);
}
