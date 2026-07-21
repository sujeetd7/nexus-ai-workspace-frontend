import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

import { normalizeApiError } from "../errors";
import {
  attachIdempotencyKey,
  attachRequestId,
  clearInterceptorRegistration,
  getInterceptorRegistration,
  hasActiveInterceptors,
  rememberInterceptorRegistration,
} from "../interceptors";
import { redactSensitive } from "../logging";
import {
  defaultRetryPolicy,
  defaultShouldRetry,
  isRetryAllowed,
  retryDelay,
  type RetryPolicy,
} from "../retry";
import type {
  NetworkLogger,
  TokenProvider,
  UnauthorizedHandler,
} from "../types";

export interface CreateHttpClientOptions {
  baseURL: string;
  timeoutMs?: number;
  withCredentials?: boolean;
  tokenProvider?: TokenProvider;
  unauthorizedHandler?: UnauthorizedHandler;
  retryPolicy?: RetryPolicy;
  logger?: NetworkLogger;
}

export interface ManagedHttpClient {
  client: AxiosInstance;
  ejectInterceptors(): void;
  /** Re-attach interceptors after ejection without stacking duplicates. */
  ensureInterceptors(): void;
}

type RetriableConfig = AxiosRequestConfig & {
  __retryCount?: number;
  idempotent?: boolean;
};

function sleep(ms: number, signal?: AbortSignal | null): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms);

    if (!signal) {
      return;
    }

    const onAbort = () => {
      clearTimeout(timeout);
      reject(new DOMException("Aborted", "AbortError"));
    };

    if (signal.aborted) {
      onAbort();
      return;
    }

    signal.addEventListener("abort", onAbort, { once: true });
  });
}

function attachInterceptors(
  client: AxiosInstance,
  options: {
    tokenProvider?: TokenProvider;
    unauthorizedHandler?: UnauthorizedHandler;
    retryPolicy: RetryPolicy;
    logger?: NetworkLogger;
  },
): void {
  if (hasActiveInterceptors(client)) {
    return;
  }

  const { tokenProvider, unauthorizedHandler, retryPolicy, logger } = options;

  const requestInterceptorId = client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig & { idempotent?: boolean }) => {
      attachRequestId(config);
      attachIdempotencyKey(config);

      const token = await tokenProvider?.getAccessToken();

      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }

      // Never log raw Axios config objects — only redacted summaries.
      logger?.debug?.(
        "network.request",
        redactSensitive({
          method: config.method,
          url: config.url,
          headers: config.headers.toJSON(),
          params: config.params,
          data: config.data,
        }),
      );

      return config;
    },
  );

  const responseInterceptorId = client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config as RetriableConfig | undefined;
      const retryCount = config?.__retryCount ?? 0;
      const shouldRetry =
        retryPolicy.shouldRetry?.(error) ?? defaultShouldRetry(error);

      if (
        config &&
        isRetryAllowed(config, retryPolicy) &&
        retryCount < retryPolicy.maxRetries &&
        shouldRetry
      ) {
        config.__retryCount = retryCount + 1;
        await sleep(
          retryDelay(
            retryCount,
            retryPolicy.baseDelayMs,
            retryPolicy.jitterRatio ?? 0.2,
          ),
          config.signal as AbortSignal | undefined,
        );
        return client.request(config);
      }

      const normalized = normalizeApiError(error);

      logger?.error?.(
        "network.error",
        redactSensitive({
          status: normalized.status,
          code: normalized.code,
          requestId: normalized.requestId,
          message: normalized.message,
        }),
      );

      if (normalized.status === 401) {
        await unauthorizedHandler?.onUnauthorized();
      }

      return Promise.reject(normalized);
    },
  );

  rememberInterceptorRegistration(client, {
    requestId: requestInterceptorId,
    responseId: responseInterceptorId,
  });
}

function ejectAttachedInterceptors(client: AxiosInstance): void {
  const registration = getInterceptorRegistration(client);

  if (!registration) {
    return;
  }

  client.interceptors.request.eject(registration.requestId);
  client.interceptors.response.eject(registration.responseId);
  clearInterceptorRegistration(client);
}

export function createHttpClient(
  options: CreateHttpClientOptions,
): ManagedHttpClient {
  const {
    baseURL,
    timeoutMs = 30_000,
    withCredentials = true,
    tokenProvider,
    unauthorizedHandler,
    retryPolicy = defaultRetryPolicy,
    logger,
  } = options;

  const client = axios.create({
    baseURL,
    timeout: timeoutMs,
    withCredentials,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const interceptorOptions = {
    tokenProvider,
    unauthorizedHandler,
    retryPolicy,
    logger,
  };

  attachInterceptors(client, interceptorOptions);

  return {
    client,
    ejectInterceptors() {
      ejectAttachedInterceptors(client);
    },
    ensureInterceptors() {
      attachInterceptors(client, interceptorOptions);
    },
  };
}
