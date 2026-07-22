import { createContext } from "react";

import type { DarkTheme } from "../theme/dark";
import type { LightTheme } from "../theme/light";
import { lightTheme } from "../theme/light";
import type {
  ThemeMode,
  ThemePreference,
} from "../theme/resolveThemeMode";

export type { ThemeMode, ThemePreference } from "../theme/resolveThemeMode";

export type NexusTheme = LightTheme | DarkTheme;

/**
 * Theme engine context — resolved theme plus preference controls.
 */
export interface ThemeContextValue {
  /** Resolved Nexus theme object for the active mode. */
  theme: NexusTheme;
  /** Resolved light/dark mode after applying system preference. */
  mode: ThemeMode;
  /** User preference (`light` | `dark` | `system`). */
  preference: ThemePreference;
  /** Update theme preference (persisted when storage is configured). */
  setPreference: (preference: ThemePreference) => void;
  /**
   * Stable convenience setter for an explicit light/dark mode.
   * Equivalent to `setPreference(mode)` — same persistence and controlled-mode path.
   * Prefer `setPreference` when `"system"` must be selectable.
   */
  setMode: (mode: ThemeMode) => void;
}

const noop = () => undefined;

export const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  mode: "light",
  preference: "light",
  setPreference: noop,
  setMode: noop,
});
