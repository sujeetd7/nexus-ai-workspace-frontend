import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type { StorageAdapter } from "@nexus/shared-types";

import {
  prefersDarkMode,
  subscribeSystemColorScheme,
} from "../appearance/appearance";
import { createTheme } from "../theme/createTheme";
import {
  resolveThemeMode,
  type ThemeMode,
  type ThemePreference,
} from "../theme/resolveThemeMode";
import { ThemeContext, type ThemeContextValue } from "./ThemeContext";
import {
  readThemePreference,
  writeThemePreference,
} from "./themePersistence";

export interface ThemeProviderProps extends PropsWithChildren {
  /**
   * Controlled preference. When set, the provider becomes controlled
   * and does not write preference changes internally (caller owns state).
   */
  preference?: ThemePreference;
  /** Uncontrolled initial preference. Defaults to `"light"`. */
  defaultPreference?: ThemePreference;
  /**
   * Optional storage adapter for persisting preference.
   * Applications inject platform adapters (e.g. web localStorage).
   */
  storage?: StorageAdapter;
  /** Storage key used with `storage`. Required when `storage` is provided. */
  storageKey?: string;
  onPreferenceChange?: (preference: ThemePreference) => void;
}

export function ThemeProvider({
  children,
  preference: controlledPreference,
  defaultPreference = "light",
  storage,
  storageKey,
  onPreferenceChange,
}: ThemeProviderProps) {
  const isControlled = controlledPreference !== undefined;
  const [uncontrolledPreference, setUncontrolledPreference] =
    useState<ThemePreference>(defaultPreference);
  const [systemIsDark, setSystemIsDark] = useState(() => prefersDarkMode());

  const preference = isControlled
    ? controlledPreference
    : uncontrolledPreference;

  useEffect(() => {
    return subscribeSystemColorScheme(setSystemIsDark);
  }, []);

  useEffect(() => {
    if (!storage || !storageKey || isControlled) {
      return;
    }

    let cancelled = false;

    void (async () => {
      const stored = await readThemePreference(storage, storageKey);
      if (!cancelled && stored) {
        setUncontrolledPreference(stored);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [storage, storageKey, isControlled]);

  const setPreference = useCallback(
    (next: ThemePreference) => {
      onPreferenceChange?.(next);

      if (!isControlled) {
        setUncontrolledPreference(next);
        if (storage && storageKey) {
          void writeThemePreference(storage, storageKey, next);
        }
      }
    },
    [isControlled, onPreferenceChange, storage, storageKey],
  );

  const setMode = useCallback(
    (mode: ThemeMode) => {
      setPreference(mode);
    },
    [setPreference],
  );

  const mode = resolveThemeMode(preference, systemIsDark);
  const theme = useMemo(() => createTheme(mode), [mode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      mode,
      preference,
      setPreference,
      setMode,
    }),
    [theme, mode, preference, setPreference, setMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
