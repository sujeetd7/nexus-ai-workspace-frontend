import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, Method } from "axios";

import { axiosClient } from "../client";
import { normalizeApiError, type ApiError } from "../errors";

export interface AxiosBaseQueryArgs {
  url: string;
  method?: Method;
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: AxiosRequestConfig["headers"];
}

export interface BaseQueryError {
  status?: number;
  code?: string;
  message: string;
  data?: unknown;
  requestId?: string;
}

function toBaseQueryError(error: ApiError): BaseQueryError {
  return {
    status: error.status,
    code: error.code,
    message: error.message,
    data: error.data,
    requestId: error.requestId,
  };
}

export const axiosBaseQuery =
  (): BaseQueryFn<AxiosBaseQueryArgs, unknown, BaseQueryError> =>
  async ({ url, method = "GET", data, params, headers }) => {
    try {
      const response = await axiosClient({
        url,
        method,
        data,
        params,
        headers,
      });

      return {
        data: response.data,
      };
    } catch (error) {
      return {
        error: toBaseQueryError(normalizeApiError(error)),
      };
    }
  };
