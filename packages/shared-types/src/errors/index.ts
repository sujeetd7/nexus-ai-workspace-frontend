/**
 * Platform-agnostic error shape for non-HTTP domain/application failures.
 * Do not use this in place of `@nexus/shared-network` `ApiError`.
 */
export interface AppError {
  readonly name?: string;
  readonly code?: string;
  readonly message: string;
  readonly cause?: unknown;
}
