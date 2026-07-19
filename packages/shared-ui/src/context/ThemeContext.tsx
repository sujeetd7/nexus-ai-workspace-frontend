import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeContextValue {
  mode: ThemeMode;

  setMode(mode: ThemeMode): void;

  toggleTheme(): void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeContextProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ThemeMode>("light");

  const toggleTheme = () => {
    setMode((current) => (current === "light" ? "dark" : "light"));
  };

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      setMode,
      toggleTheme,
    }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useThemeContext must be used inside ThemeContextProvider");
  }

  return context;
}
