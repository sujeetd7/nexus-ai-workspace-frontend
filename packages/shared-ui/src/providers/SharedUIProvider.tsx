import type { PropsWithChildren } from "react";
import { Theme, TamaguiProvider } from "@tamagui/core";
import type { StorageAdapter } from "@nexus/shared-types";

import { resolveModeFromPreference } from "../appearance/appearance";
import { tamaguiConfig } from "../tamagui/config";
import type { ThemeMode, ThemePreference } from "../theme/resolveThemeMode";
import {
  ThemeProvider,
  type ThemeProviderProps,
} from "./ThemeProvider";
import { useTheme } from "../hooks/useTheme";

export interface SharedUIProviderProps extends PropsWithChildren {
  /**
   * Controlled theme preference (`light` | `dark` | `system`).
   */
  preference?: ThemePreference;
  /**
   * Uncontrolled initial preference. Defaults to `"light"`.
   * When `defaultTheme` is provided without `defaultPreference`, it is used.
   */
  defaultPreference?: ThemePreference;
  /**
   * Batch 2.1 compatibility: initial light/dark mode.
   * Prefer `defaultPreference` for new code (supports `"system"`).
   */
  defaultTheme?: ThemeMode;
  storage?: StorageAdapter;
  storageKey?: string;
  onPreferenceChange?: ThemeProviderProps["onPreferenceChange"];
}

function TamaguiThemeBridge({ children }: PropsWithChildren) {
  const { mode } = useTheme();
  return <Theme name={mode}>{children}</Theme>;
}

/**
 * Centralized UI provider for web and mobile applications.
 *
 * Applications must use this provider and must not instantiate `TamaguiProvider` directly.
 */
export function SharedUIProvider({
  children,
  preference,
  defaultPreference,
  defaultTheme = "light",
  storage,
  storageKey,
  onPreferenceChange,
}: SharedUIProviderProps) {
  const initialPreference = defaultPreference ?? defaultTheme;
  const initialMode = resolveModeFromPreference(initialPreference);

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={initialMode}>
      <ThemeProvider
        preference={preference}
        defaultPreference={initialPreference}
        storage={storage}
        storageKey={storageKey}
        onPreferenceChange={onPreferenceChange}
      >
        <TamaguiThemeBridge>{children}</TamaguiThemeBridge>
      </ThemeProvider>
    </TamaguiProvider>
  );
}
