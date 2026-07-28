import { normalizeFrontendApiError } from "@nexus/shared-network";
import { useMemo } from "react";

import {
  classifyAuthError,
  type MappedAuthError,
} from "../utils/authErrorPresentation";

export function useApiErrorMessage(error: unknown): string | undefined {
  return useMemo(() => {
    if (!error) {
      return undefined;
    }

    return mapApiError(error).message;
  }, [error]);
}

export function mapApiError(error: unknown): MappedAuthError {
  const normalized = normalizeFrontendApiError(error);
  return classifyAuthError({
    message: normalized.message,
    retryable: normalized.retryable,
    status: normalized.status,
    code: normalized.code,
    causeType: normalized.causeType,
  });
}
