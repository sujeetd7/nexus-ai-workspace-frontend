import type { ThemeMode } from "./resolveThemeMode";
import { darkTheme } from "./dark";
import { lightTheme } from "./light";

export const createTheme = (mode: ThemeMode = "light") =>
  mode === "dark" ? darkTheme : lightTheme;
