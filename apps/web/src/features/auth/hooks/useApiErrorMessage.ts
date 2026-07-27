import { normalizeFrontendApiError } from "@nexus/shared-network";
import { useMemo } from "react";

export function useApiErrorMessage(error: unknown): string | undefined {
  return useMemo(() => {
    if (!error) {
      return undefined;
    }

    const normalized = normalizeFrontendApiError(error);
    return normalized.message;
  }, [error]);
}

export function mapApiError(error: unknown): {
  message: string;
  retryable: boolean;
  status?: number;
} {
  const normalized = normalizeFrontendApiError(error);
  return {
    message: normalized.message,
    retryable: normalized.retryable,
    status: normalized.status,
  };
}
