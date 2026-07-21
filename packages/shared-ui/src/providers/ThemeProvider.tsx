import type { PropsWithChildren } from "react";

import { lightTheme } from "../theme/light";
import { ThemeContext, type ThemeContextValue } from "./ThemeContext";

export interface ThemeProviderProps extends PropsWithChildren {
  theme?: ThemeContextValue;
}

export function ThemeProvider({
  children,
  theme = lightTheme,
}: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}
