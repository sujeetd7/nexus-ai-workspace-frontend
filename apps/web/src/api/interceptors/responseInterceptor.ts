import type { AxiosResponse } from "axios";

export function responseInterceptor<T>(
  response: AxiosResponse<T>,
): AxiosResponse<T> {
  return response;
}
