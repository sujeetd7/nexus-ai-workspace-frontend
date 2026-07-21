import type { AxiosError, AxiosRequestConfig, Method } from "axios";

import { axiosClient } from "../client";

export interface BaseQueryArgs {
  url: string;
  method?: Method;
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: AxiosRequestConfig["headers"];
}

export async function axiosBaseQuery({
  url,
  method = "GET",
  data,
  params,
  headers,
}: BaseQueryArgs) {
  try {
    const result = await axiosClient({
      url,
      method,
      data,
      params,
      headers,
    });

    return {
      data: result.data,
    };
  } catch (error) {
    const err = error as AxiosError;

    return {
      error: {
        status: err.response?.status,
        data: err.response?.data,
      },
    };
  }
}
