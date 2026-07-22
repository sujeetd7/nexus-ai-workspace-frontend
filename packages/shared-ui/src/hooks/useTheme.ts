import { useContext } from "react";

import {
  ThemeContext,
  type ThemeContextValue,
} from "../providers/ThemeContext";

/**
 * Access the theme engine controller.
 *
 * Returns `{ theme, mode, preference, setPreference, setMode }`.
 * See `docs/architecture/THEME_ENGINE.md` for field meanings and setter rules.
 */
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
