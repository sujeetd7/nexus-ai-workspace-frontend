import { resolveThemeMode } from "../theme/resolveThemeMode";
import type { ThemeMode, ThemePreference } from "../theme/resolveThemeMode";

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

type AppearanceLike = {
  getColorScheme: () => "light" | "dark" | null | undefined;
  addChangeListener: (
    listener: (preferences: { colorScheme: "light" | "dark" | null }) => void,
  ) => { remove: () => void };
};

function getReactNativeAppearance(): AppearanceLike | null {
  try {
    // Optional peer — resolved via Metro / react-native-web when available.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const rn = require("react-native") as { Appearance?: AppearanceLike };
    return rn.Appearance ?? null;
  } catch {
    return null;
  }
}

export function prefersDarkMode(): boolean {
  const appearance = getReactNativeAppearance();
  if (appearance) {
    return appearance.getColorScheme() === "dark";
  }

  const host = globalThis as typeof globalThis & MatchMediaHost;
  if (typeof host.matchMedia !== "function") {
    return false;
  }

  return host.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Subscribe to system color-scheme changes.
 * Prefers React Native `Appearance` when present; otherwise uses `matchMedia`.
 */
export function subscribeSystemColorScheme(
  listener: (isDark: boolean) => void,
): () => void {
  const appearance = getReactNativeAppearance();
  if (appearance) {
    const subscription = appearance.addChangeListener(({ colorScheme }) => {
      listener(colorScheme === "dark");
    });
    return () => subscription.remove();
  }

  const host = globalThis as typeof globalThis & MatchMediaHost;
  if (typeof host.matchMedia !== "function") {
    return () => undefined;
  }

  const media = host.matchMedia("(prefers-color-scheme: dark)");
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

export function resolveModeFromPreference(
  preference: ThemePreference,
): ThemeMode {
  return resolveThemeMode(preference, prefersDarkMode());
}
