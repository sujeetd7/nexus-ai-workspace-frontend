import { useContext } from "react";

import {
  ThemeContext,
  type ThemeContextValue,
} from "../providers/ThemeContext";

/**
 * Access the theme engine: resolved theme, mode, preference, and setters.
 */
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
