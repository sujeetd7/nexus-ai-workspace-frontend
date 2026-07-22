export type ThemeMode = "light" | "dark";

export type ThemePreference = ThemeMode | "system";

export const THEME_PREFERENCES = [
  "light",
  "dark",
  "system",
] as const satisfies readonly ThemePreference[];

export function isThemePreference(value: unknown): value is ThemePreference {
  return (
    value === "light" || value === "dark" || value === "system"
  );
}

export function resolveThemeMode(
  preference: ThemePreference,
  systemIsDark: boolean,
): ThemeMode {
  if (preference === "system") {
    return systemIsDark ? "dark" : "light";
  }

  return preference;
}
