import type { InternalAxiosRequestConfig } from "axios";

import { getAccessToken } from "./authStorage";

export function attachAuthorizationHeader(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  const token = getAccessToken();

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
}
