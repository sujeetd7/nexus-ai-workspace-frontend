import type { ErrorCode } from "./errorCodes";
import type { ErrorMetadata } from "./errorMetadata";

/**
 * Safe serialized representation of {@link AppError}.
 * Excludes stack traces and raw causes by default.
 */
export interface SerializedAppError {
  readonly code: ErrorCode;
  readonly message: string;
  readonly name?: string;
  readonly retryable?: boolean;
  readonly metadata?: ErrorMetadata;
}
