import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosInstance, AxiosRequestConfig, Method } from "axios";

import { normalizeApiError } from "../errors";

export interface AxiosBaseQueryArgs {
  url: string;
  method?: Method;
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: AxiosRequestConfig["headers"];
  signal?: AbortSignal;
}

export interface BaseQueryError {
  status?: number;
  code?: string;
  message: string;
  data?: unknown;
  requestId?: string;
}

export function createAxiosBaseQuery(
  client: AxiosInstance,
): BaseQueryFn<AxiosBaseQueryArgs, unknown, BaseQueryError> {
  return async ({ url, method = "GET", data, params, headers, signal }) => {
    try {
      const response = await client({
        url,
        method,
        data,
        params,
        headers,
        signal,
      });

      return { data: response.data };
    } catch (error) {
      const normalized = normalizeApiError(error);

      return {
        error: {
          status: normalized.status,
          code: normalized.code,
          message: normalized.message,
          data: normalized.data,
          requestId: normalized.requestId,
        },
      };
    }
  };
}
