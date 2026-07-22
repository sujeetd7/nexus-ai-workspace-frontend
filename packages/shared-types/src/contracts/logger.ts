/**
 * Platform-agnostic structured logger contract.
 * Distinct from `@nexus/shared-network` `NetworkLogger` (transport-scoped).
 */
export interface Logger {
  debug(message: string, metadata?: unknown): void;
  info(message: string, metadata?: unknown): void;
  warn(message: string, metadata?: unknown): void;
  error(message: string, metadata?: unknown): void;
}
