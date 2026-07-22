/**
 * Internal log-level vocabulary for shared logger helpers.
 * Not part of `@nexus/shared-types` (Logger contract stays method-based).
 */
export type LogLevel = "debug" | "info" | "warn" | "error";

export const ALL_LOG_LEVELS: readonly LogLevel[] = [
  "debug",
  "info",
  "warn",
  "error",
] as const;

export const PRODUCTION_LOG_LEVELS: readonly LogLevel[] = [
  "warn",
  "error",
] as const;

/**
 * Single shared level policy for Web and Mobile adapters.
 * Development: all levels. Production (and non-development): warn + error.
 */
export function resolveAllowedLogLevels(
  isDevelopment: boolean,
): readonly LogLevel[] {
  return isDevelopment ? ALL_LOG_LEVELS : PRODUCTION_LOG_LEVELS;
}

export function isLogLevelAllowed(
  level: LogLevel,
  allowedLevels: readonly LogLevel[],
): boolean {
  return allowedLevels.includes(level);
}
