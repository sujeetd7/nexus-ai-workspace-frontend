import { ERROR_CODES, type AppError, type ErrorCode } from "@nexus/shared-types";

import { ApiError } from "./ApiError";

function mapStatusToErrorCode(status?: number, networkCode?: string): ErrorCode {
  if (status === 401) {
    return ERROR_CODES.UNAUTHORIZED;
  }

  if (status === 403) {
    return ERROR_CODES.FORBIDDEN;
  }

  if (status === 404) {
    return ERROR_CODES.NOT_FOUND;
  }

  if (status === 409) {
    return ERROR_CODES.CONFLICT;
  }

  if (status === 429) {
    return ERROR_CODES.RATE_LIMITED;
  }

  if (status === 408 || networkCode === "ECONNABORTED" || networkCode === "ETIMEDOUT") {
    return ERROR_CODES.TIMEOUT;
  }

  if (status !== undefined && status >= 500) {
    return ERROR_CODES.INTERNAL;
  }

  if (status !== undefined && status >= 400) {
    return ERROR_CODES.NETWORK;
  }

  return ERROR_CODES.NETWORK;
}

function mapRetryable(status?: number, code?: ErrorCode): boolean {
  if (
    code === ERROR_CODES.UNAUTHORIZED ||
    code === ERROR_CODES.FORBIDDEN ||
    code === ERROR_CODES.NOT_FOUND ||
    code === ERROR_CODES.CONFLICT
  ) {
    return false;
  }

  if (status === undefined) {
    return true;
  }

  if (status === 408 || status === 429) {
    return true;
  }

  if (status >= 500) {
    return true;
  }

  return false;
}

/**
 * Explicit conversion from network-specific {@link ApiError} to shared {@link AppError}.
 * Does not attach Axios request/response objects or raw response bodies.
 */
export function apiErrorToAppError(error: ApiError): AppError {
  const code = mapStatusToErrorCode(error.status, error.code);
  const metadata: Record<string, string | number> = {};

  if (error.status !== undefined) {
    metadata.status = error.status;
  }

  if (error.requestId !== undefined) {
    metadata.requestId = error.requestId;
  }

  if (error.code !== undefined) {
    metadata.networkCode = error.code;
  }

  return {
    name: error.name,
    code,
    message: error.message,
    cause: error,
    retryable: mapRetryable(error.status, code),
    ...(Object.keys(metadata).length > 0 ? { metadata } : {}),
  };
}
