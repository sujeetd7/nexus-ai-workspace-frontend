import type { AxiosResponse } from "axios";

export function responseInterceptor(response: AxiosResponse): AxiosResponse {
  return response;
}
