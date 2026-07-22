import type { Theme } from "../../types/theme";
import type { ElevationToken } from "../shared/types";

/**
 * Maps Nexus elevation tokens to platform shadow / elevation styles.
 * Web uses shadow string tokens; React Native uses numeric elevation.
 */
export function resolveElevationStyle(
  elevation: ElevationToken,
  theme: Theme,
  platform: "web" | "native",
): Record<string, string | number> | undefined {
  if (elevation === "none") {
    return undefined;
  }

  if (platform === "native") {
    return { elevation: theme.elevation[elevation] };
  }

  const shadowKey =
    elevation === "xs" || elevation === "sm"
      ? "sm"
      : elevation === "md"
        ? "md"
        : "lg";

  return { boxShadow: theme.shadows[shadowKey] };
}
