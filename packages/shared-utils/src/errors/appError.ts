import {
  ERROR_CODES,
  type AppError,
  type ErrorCode,
  type ErrorMetadata,
  type ErrorMetadataValue,
  type SerializedAppError,
} from "@nexus/shared-types";

const ERROR_CODE_SET = new Set<string>(Object.values(ERROR_CODES));

export interface CreateAppErrorInput {
  readonly message: string;
  readonly code?: ErrorCode;
  readonly name?: string;
  readonly cause?: unknown;
  readonly metadata?: ErrorMetadata;
  readonly retryable?: boolean;
}

function isErrorMetadataValue(value: unknown): value is ErrorMetadataValue {
  return (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

/**
 * Copies only flat JSON-safe metadata entries. Drops nested/unknown values.
 */
export function sanitizeErrorMetadata(
  metadata: unknown,
): ErrorMetadata | undefined {
  if (metadata === null || metadata === undefined) {
    return undefined;
  }

  if (typeof metadata !== "object" || Array.isArray(metadata)) {
    return undefined;
  }

  const result: Record<string, ErrorMetadataValue> = {};

  for (const [key, value] of Object.entries(metadata)) {
    if (isErrorMetadataValue(value)) {
      result[key] = value;
    }
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

const APP_ERROR_KEYS = new Set([
  "name",
  "code",
  "message",
  "cause",
  "metadata",
  "retryable",
]);

export function isErrorCode(value: unknown): value is ErrorCode {
  return typeof value === "string" && ERROR_CODE_SET.has(value);
}

export function isAppError(value: unknown): value is AppError {
  if (!isPlainObject(value)) {
    return false;
  }

  for (const key of Object.keys(value)) {
    if (!APP_ERROR_KEYS.has(key)) {
      return false;
    }
  }

  if (typeof value.message !== "string" || value.message.length === 0) {
    return false;
  }

  if (value.code !== undefined && !isErrorCode(value.code)) {
    return false;
  }

  if (value.name !== undefined && typeof value.name !== "string") {
    return false;
  }

  if (value.retryable !== undefined && typeof value.retryable !== "boolean") {
    return false;
  }

  if (value.metadata !== undefined) {
    if (
      value.metadata === null ||
      typeof value.metadata !== "object" ||
      Array.isArray(value.metadata)
    ) {
      return false;
    }

    for (const metaValue of Object.values(
      value.metadata as Record<string, unknown>,
    )) {
      if (!isErrorMetadataValue(metaValue)) {
        return false;
      }
    }
  }

  return true;
}

export function createAppError(input: CreateAppErrorInput): AppError {
  const metadata = sanitizeErrorMetadata(input.metadata);

  return {
    message: input.message,
    code: input.code ?? ERROR_CODES.UNKNOWN,
    ...(input.name !== undefined ? { name: input.name } : {}),
    ...(input.cause !== undefined ? { cause: input.cause } : {}),
    ...(input.retryable !== undefined ? { retryable: input.retryable } : {}),
    ...(metadata !== undefined ? { metadata } : {}),
  };
}

export function toAppError(
  value: unknown,
  fallbackMessage = "An unexpected error occurred.",
  fallbackCode: ErrorCode = ERROR_CODES.UNKNOWN,
): AppError {
  if (isAppError(value)) {
    const metadata = sanitizeErrorMetadata(value.metadata);

    return {
      message: value.message,
      code: value.code ?? fallbackCode,
      ...(value.name !== undefined ? { name: value.name } : {}),
      ...(value.cause !== undefined ? { cause: value.cause } : {}),
      ...(value.retryable !== undefined ? { retryable: value.retryable } : {}),
      ...(metadata !== undefined ? { metadata } : {}),
    };
  }

  if (value instanceof Error) {
    return createAppError({
      name: value.name,
      message: value.message || fallbackMessage,
      code: fallbackCode,
      cause: value,
    });
  }

  if (typeof value === "string") {
    return createAppError({
      message: value.length > 0 ? value : fallbackMessage,
      code: fallbackCode,
      cause: value,
    });
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return createAppError({
      message: fallbackMessage,
      code: fallbackCode,
      cause: value,
      metadata: { valueType: typeof value },
    });
  }

  if (value === null || value === undefined) {
    return createAppError({
      message: fallbackMessage,
      code: fallbackCode,
      cause: value,
      metadata: { valueType: value === null ? "null" : "undefined" },
    });
  }

  // Objects / other values: do not leak arbitrary fields into metadata.
  return createAppError({
    message: fallbackMessage,
    code: fallbackCode,
    cause: value,
    metadata: { valueType: "object" },
  });
}

/** Alias preferred by call sites that normalize thrown/rejected values. */
export function normalizeError(
  value: unknown,
  fallbackMessage?: string,
  fallbackCode?: ErrorCode,
): AppError {
  return toAppError(value, fallbackMessage, fallbackCode);
}

export function serializeAppError(error: AppError): SerializedAppError {
  const metadata = sanitizeErrorMetadata(error.metadata);

  return {
    code: error.code ?? ERROR_CODES.UNKNOWN,
    message: error.message,
    ...(error.name !== undefined ? { name: error.name } : {}),
    ...(error.retryable !== undefined ? { retryable: error.retryable } : {}),
    ...(metadata !== undefined ? { metadata } : {}),
  };
}

export function getErrorMessage(
  value: unknown,
  fallbackMessage = "An unexpected error occurred.",
): string {
  if (isAppError(value)) {
    return value.message;
  }

  if (value instanceof Error && value.message.length > 0) {
    return value.message;
  }

  if (typeof value === "string" && value.length > 0) {
    return value;
  }

  return fallbackMessage;
}

export function validationError(
  message: string,
  metadata?: ErrorMetadata,
): AppError {
  return createAppError({
    code: ERROR_CODES.VALIDATION,
    message,
    metadata,
  });
}

export function unauthorizedError(
  message = "Unauthorized",
  metadata?: ErrorMetadata,
): AppError {
  return createAppError({
    code: ERROR_CODES.UNAUTHORIZED,
    message,
    metadata,
    retryable: false,
  });
}

export function forbiddenError(
  message = "Forbidden",
  metadata?: ErrorMetadata,
): AppError {
  return createAppError({
    code: ERROR_CODES.FORBIDDEN,
    message,
    metadata,
    retryable: false,
  });
}

export function notFoundError(
  message = "Not found",
  metadata?: ErrorMetadata,
): AppError {
  return createAppError({
    code: ERROR_CODES.NOT_FOUND,
    message,
    metadata,
    retryable: false,
  });
}

export function conflictError(
  message = "Conflict",
  metadata?: ErrorMetadata,
): AppError {
  return createAppError({
    code: ERROR_CODES.CONFLICT,
    message,
    metadata,
    retryable: false,
  });
}

export function networkError(
  message = "Network request failed",
  metadata?: ErrorMetadata,
  retryable = true,
): AppError {
  return createAppError({
    code: ERROR_CODES.NETWORK,
    message,
    metadata,
    retryable,
  });
}

export function timeoutError(
  message = "Request timed out",
  metadata?: ErrorMetadata,
): AppError {
  return createAppError({
    code: ERROR_CODES.TIMEOUT,
    message,
    metadata,
    retryable: true,
  });
}

export function storageError(
  message = "Storage operation failed",
  metadata?: ErrorMetadata,
): AppError {
  return createAppError({
    code: ERROR_CODES.STORAGE,
    message,
    metadata,
  });
}

export function internalError(
  message = "Internal error",
  metadata?: ErrorMetadata,
): AppError {
  return createAppError({
    code: ERROR_CODES.INTERNAL,
    message,
    metadata,
  });
}
