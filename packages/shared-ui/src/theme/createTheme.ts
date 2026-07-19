import type { ThemeMode } from "../context";
import { darkTheme } from "./dark";
import { lightTheme } from "./light";

export const createTheme = (mode: ThemeMode = "light") =>
  mode === "dark" ? darkTheme : lightTheme;
