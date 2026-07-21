import type { InternalAxiosRequestConfig } from "axios";

import { attachAuthorizationHeader } from "../auth";

export function authInterceptor(config: InternalAxiosRequestConfig) {
  return attachAuthorizationHeader(config);
}
