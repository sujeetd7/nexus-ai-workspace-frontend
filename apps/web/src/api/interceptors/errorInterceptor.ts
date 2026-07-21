import type { AxiosError } from "axios";

export function errorInterceptor(error: AxiosError): Promise<never> {
  return Promise.reject(error);
}
