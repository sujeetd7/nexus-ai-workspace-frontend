import { normalizeFrontendApiError } from '@nexus/shared-network';
import { useMemo } from 'react';

export interface MappedApiError {
  readonly message: string;
  readonly retryable: boolean;
  readonly status?: number;
  readonly code?: string;
  readonly causeType?: string;
  readonly authAction?: string;
  readonly authorizationAction?: string;
}

function isBaseQueryErrorShape(
  error: unknown,
): error is {
  status?: number;
  message: string;
  code?: string;
  requestId?: string;
} {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string' &&
    ('status' in error || 'code' in error)
  );
}

function isRetryableStatus(status: number | undefined): boolean {
  if (status === undefined) {
    return true;
  }
  return (
    status === 408 ||
    status === 429 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    (status >= 500 && status < 600)
  );
}

function inferCauseTypeFromBaseQuery(error: {
  status?: number;
  code?: string;
}): string | undefined {
  const code = (error.code ?? '').toUpperCase();
  if (
    error.status === undefined ||
    code === 'NETWORK_ERROR' ||
    code === 'ERR_NETWORK'
  ) {
    return 'network';
  }
  if (code === 'ECONNABORTED' || code === 'ETIMEDOUT') {
    return 'timeout';
  }
  return 'http';
}

export function useApiErrorMessage(error: unknown): string | undefined {
  return useMemo(() => {
    if (!error) {
      return undefined;
    }

    return mapApiError(error).message;
  }, [error]);
}

export function mapApiError(error: unknown): MappedApiError {
  if (isBaseQueryErrorShape(error)) {
    const causeType = inferCauseTypeFromBaseQuery(error);
    const retryable = isRetryableStatus(error.status);
    return {
      message: error.message,
      retryable,
      status: error.status,
      code: error.code,
      causeType,
      authAction: error.status === 401 ? 'reauthenticate' : 'none',
      authorizationAction:
        error.status === 403 ? 'showForbidden' : 'none',
    };
  }

  const normalized = normalizeFrontendApiError(error);
  return {
    message: normalized.message,
    retryable: normalized.retryable,
    status: normalized.status,
    code: normalized.code,
    causeType: normalized.causeType,
    authAction: normalized.authAction,
    authorizationAction: normalized.authorizationAction,
  };
}
