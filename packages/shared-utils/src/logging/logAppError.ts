import type { Logger } from "@nexus/shared-types";

import { serializeAppError, toAppError } from "../errors/appError";

/**
 * Logs an AppError (or normalizes unknown values first) via `logger.error`.
 * Uses Batch 1.2 serialization — no cause, stack, or raw payloads.
 * Never throws.
 */
export function logAppError(
  logger: Logger,
  error: unknown,
  message = "Application error",
): void {
  try {
    const appError = toAppError(error);
    const serialized = serializeAppError(appError);

    logger.error(message, {
      code: serialized.code,
      message: serialized.message,
      ...(serialized.name !== undefined ? { name: serialized.name } : {}),
      ...(serialized.retryable !== undefined
        ? { retryable: serialized.retryable }
        : {}),
      ...(serialized.metadata !== undefined
        ? { metadata: serialized.metadata }
        : {}),
    });
  } catch {
    try {
      logger.error(message);
    } catch {
      // Never throw from logging.
    }
  }
}
