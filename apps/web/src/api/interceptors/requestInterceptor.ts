import type { InternalAxiosRequestConfig } from "axios";

function createRequestId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `request-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function requestInterceptor(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  if (!config.headers.has("X-Request-Id")) {
    config.headers.set("X-Request-Id", createRequestId());
  }

  return config;
}
