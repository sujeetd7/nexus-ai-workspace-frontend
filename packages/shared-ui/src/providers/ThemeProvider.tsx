import type { PropsWithChildren } from "react";
import { lightTheme } from "../theme/light";
import { ThemeContext } from "./ThemeContext";

export interface ThemeProviderProps extends PropsWithChildren {
  theme?: typeof lightTheme;
}

export function ThemeProvider({
  children,
  theme = lightTheme,
}: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}
