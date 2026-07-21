import axios, { type AxiosError } from "axios";

export interface ApiErrorDetails {
  status?: number;
  code?: string;
  message: string;
  data?: unknown;
  requestId?: string;
  cause?: unknown;
}

export class ApiError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly data?: unknown;
  readonly requestId?: string;

  constructor(details: ApiErrorDetails) {
    super(details.message, { cause: details.cause });
    this.name = "ApiError";
    this.status = details.status;
    this.code = details.code;
    this.data = details.data;
    this.requestId = details.requestId;
  }
}

interface ErrorResponseBody {
  success?: boolean;
  error?: {
    code?: string;
    message?: string;
  };
  code?: string;
  message?: string;
  requestId?: string;
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (!axios.isAxiosError(error)) {
    return new ApiError({
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      cause: error,
    });
  }

  const axiosError = error as AxiosError<ErrorResponseBody>;
  const body = axiosError.response?.data;

  return new ApiError({
    status: axiosError.response?.status,
    code: body?.error?.code ?? body?.code ?? axiosError.code,
    message:
      body?.error?.message ??
      body?.message ??
      axiosError.message ??
      "The request failed.",
    data: body,
    requestId:
      body?.requestId ??
      (axiosError.response?.headers?.["x-request-id"] as string | undefined),
    cause: error,
  });
}
