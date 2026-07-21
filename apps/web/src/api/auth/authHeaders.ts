import type { InternalAxiosRequestConfig } from "axios";

import { getAccessToken } from "./authStorage";

export function attachAuthorizationHeader(config: InternalAxiosRequestConfig) {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}
