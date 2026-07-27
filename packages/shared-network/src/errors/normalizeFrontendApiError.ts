import axios, { type AxiosError } from "axios";

import { ApiError } from "./ApiError";
import {
  FrontendApiErrorInstance,
  type FrontendApiError,
  type FrontendApiErrorAuthAction,
  type FrontendApiErrorAuthorizationAction,
  type FrontendApiErrorCauseType,
} from "./FrontendApiError";

interface GatewayErrorBody {
  success?: boolean;
  error?: {
    code?: string;
    message?: string;
    correlationId?: string;
    fieldErrors?: Record<string, string[]>;
  };
  code?: string;
  message?: string;
  requestId?: string;
  correlationId?: string;
  fieldErrors?: Record<string, string[]>;
}

function readCorrelationId(
  body: GatewayErrorBody | undefined,
  headers: Record<string, unknown> | undefined,
): string | undefined {
  const fromBody =
    body?.correlationId ??
    body?.error?.correlationId ??
    body?.requestId;

  if (typeof fromBody === "string" && fromBody.length > 0) {
    return fromBody;
  }

  const headerValue =
    headers?.["x-correlation-id"] ?? headers?.["x-request-id"];

  return typeof headerValue === "string" ? headerValue : undefined;
}

function readFieldErrors(
  body: GatewayErrorBody | undefined,
): Record<string, readonly string[]> | undefined {
  const raw = body?.fieldErrors ?? body?.error?.fieldErrors;
  if (!raw || typeof raw !== "object") {
    return undefined;
  }

  const normalized: Record<string, readonly string[]> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (Array.isArray(value)) {
      normalized[key] = value.map(String);
    }
  }

  return Object.keys(normalized).length > 0 ? normalized : undefined;
}

function mapAuthAction(status?: number, code?: string): FrontendApiErrorAuthAction {
  if (status === 401) {
    if (code === "INVALID_TOKEN" || code === "TOKEN_EXPIRED") {
      return "refresh";
    }
    return "reauthenticate";
  }
  return "none";
}

function mapAuthorizationAction(
  status?: number,
): FrontendApiErrorAuthorizationAction {
  if (status === 403) {
    return "showForbidden";
  }
  return "none";
}

function mapRetryable(
  status: number | undefined,
  causeType: FrontendApiErrorCauseType,
): boolean {
  if (causeType === "cancelled") {
    return false;
  }

  if (status === undefined || causeType === "network" || causeType === "timeout") {
    return true;
  }

  if (status === 408 || status === 429 || status === 502 || status === 503 || status === 504) {
    return true;
  }

  return status >= 500 && status < 600;
}

function fromAxiosError(error: AxiosError<GatewayErrorBody>): FrontendApiErrorInstance {
  const body = error.response?.data;
  const status = error.response?.status;
  const headers = error.response?.headers as Record<string, unknown> | undefined;
  const code =
    body?.error?.code ??
    body?.code ??
    error.code ??
    (status ? `HTTP_${status}` : "NETWORK_ERROR");

  let causeType: FrontendApiErrorCauseType = "http";
  if (error.code === "ERR_CANCELED" || error.name === "CanceledError") {
    causeType = "cancelled";
  } else if (
    error.code === "ECONNABORTED" ||
    error.code === "ETIMEDOUT" ||
    !error.response
  ) {
    causeType = error.code === "ECONNABORTED" || error.code === "ETIMEDOUT"
      ? "timeout"
      : "network";
  }

  const message =
    body?.error?.message ??
    body?.message ??
    (causeType === "cancelled"
      ? "Request was cancelled."
      : error.message || "The request failed.");

  const details: FrontendApiError = {
    status,
    code,
    message,
    fieldErrors: readFieldErrors(body),
    correlationId: readCorrelationId(body, headers),
    retryable: mapRetryable(status, causeType),
    authAction: mapAuthAction(status, code),
    authorizationAction: mapAuthorizationAction(status),
    causeType,
  };

  return new FrontendApiErrorInstance(details);
}

export function normalizeFrontendApiError(error: unknown): FrontendApiErrorInstance {
  if (error instanceof FrontendApiErrorInstance) {
    return error;
  }

  if (error instanceof ApiError) {
    return normalizeFrontendApiError(error.cause ?? error);
  }

  if (axios.isAxiosError(error)) {
    return fromAxiosError(error as AxiosError<GatewayErrorBody>);
  }

  if (error instanceof Error && error.name === "AbortError") {
    return new FrontendApiErrorInstance({
      code: "CANCELLED",
      message: "Request was cancelled.",
      retryable: false,
      causeType: "cancelled",
      authAction: "none",
      authorizationAction: "none",
    });
  }

  return new FrontendApiErrorInstance({
    code: "UNKNOWN_ERROR",
    message:
      error instanceof Error
        ? error.message
        : "An unexpected error occurred.",
    retryable: false,
    causeType: "network",
    authAction: "none",
    authorizationAction: "none",
  });
}
