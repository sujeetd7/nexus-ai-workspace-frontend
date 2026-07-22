import type { ErrorCode } from "./errorCodes";
import type { ErrorMetadata } from "./errorMetadata";

/**
 * Platform-agnostic application error contract.
 * HTTP transport failures remain `@nexus/shared-network` `ApiError` and convert via
 * an explicit adapter — do not treat `ApiError` as a substitute for this type.
 *
 * Batch 1.1 fields remain; Batch 1.2 adds typed codes, metadata, and retryability.
 * `code` stays optional for backward compatibility; factories and normalizers set it.
 */
export interface AppError {
  readonly name?: string;
  readonly code?: ErrorCode;
  readonly message: string;
  readonly cause?: unknown;
  readonly metadata?: ErrorMetadata;
  readonly retryable?: boolean;
}
