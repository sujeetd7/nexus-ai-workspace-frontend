import type { AxiosError } from "axios";

import { logout } from "../auth";
import { normalizeApiError } from "../errors";

export function errorInterceptor(error: AxiosError): Promise<never> {
  const normalizedError = normalizeApiError(error);

  if (normalizedError.status === 401) {
    logout();
  }

  return Promise.reject(normalizedError);
}
