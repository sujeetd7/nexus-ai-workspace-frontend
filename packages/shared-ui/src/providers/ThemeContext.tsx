import { createContext } from "react";

import { darkTheme } from "../theme/dark";
import { lightTheme } from "../theme/light";

export type ThemeMode = "light" | "dark";

export type ThemeContextValue = typeof lightTheme | typeof darkTheme;

export const ThemeContext = createContext<ThemeContextValue>(lightTheme);
