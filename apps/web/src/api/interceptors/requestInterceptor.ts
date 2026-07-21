import type { InternalAxiosRequestConfig } from "axios";

export function requestInterceptor(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  return config;
}
