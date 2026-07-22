import type { PropsWithChildren } from "react";
import { TamaguiProvider } from "@tamagui/core";

import { tamaguiConfig } from "../tamagui/config";
import {
  ThemeProvider,
  type ThemeProviderProps,
} from "./ThemeProvider";

export interface SharedUIProviderProps extends PropsWithChildren {
  /**
   * Optional Nexus theme object passed to the existing ThemeProvider lifecycle.
   */
  theme?: ThemeProviderProps["theme"];
  /**
   * Tamagui default theme name. Defaults to `"light"`.
   */
  defaultTheme?: "light" | "dark";
}

/**
 * Centralized UI provider for web and mobile applications.
 *
 * Applications must use this provider and must not instantiate `TamaguiProvider` directly.
 */
export function SharedUIProvider({
  children,
  theme,
  defaultTheme = "light",
}: SharedUIProviderProps) {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={defaultTheme}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </TamaguiProvider>
  );
}
