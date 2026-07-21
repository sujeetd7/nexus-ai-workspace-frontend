import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

export interface InterceptorRegistration {
  requestId: number;
  responseId: number;
}

const registrations = new WeakMap<AxiosInstance, InterceptorRegistration>();

export function getInterceptorRegistration(
  client: AxiosInstance,
): InterceptorRegistration | undefined {
  return registrations.get(client);
}

export function hasActiveInterceptors(client: AxiosInstance): boolean {
  return registrations.has(client);
}

export function rememberInterceptorRegistration(
  client: AxiosInstance,
  registration: InterceptorRegistration,
): void {
  registrations.set(client, registration);
}

export function clearInterceptorRegistration(client: AxiosInstance): void {
  registrations.delete(client);
}

function createOpaqueId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function attachRequestId(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  if (!config.headers.has("X-Request-Id")) {
    config.headers.set("X-Request-Id", createOpaqueId());
  }

  return config;
}

/**
 * Opt-in Idempotency-Key for mutating calls.
 * Set `config.idempotent = true` (or pre-set the header) to enable.
 */
export function attachIdempotencyKey(
  config: InternalAxiosRequestConfig & { idempotent?: boolean },
): InternalAxiosRequestConfig {
  if (config.headers.has("Idempotency-Key")) {
    return config;
  }

  if (config.idempotent === true) {
    config.headers.set("Idempotency-Key", createOpaqueId());
  }

  return config;
}
