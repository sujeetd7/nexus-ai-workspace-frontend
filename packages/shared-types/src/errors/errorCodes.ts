/**
 * Stable, serializable application error codes.
 * Feature-specific codes belong in feature packages, not here.
 */
export const ERROR_CODES = {
  UNKNOWN: "UNKNOWN",
  VALIDATION: "VALIDATION",
  NETWORK: "NETWORK",
  TIMEOUT: "TIMEOUT",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  RATE_LIMITED: "RATE_LIMITED",
  STORAGE: "STORAGE",
  CONFIGURATION: "CONFIGURATION",
  INTERNAL: "INTERNAL",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
