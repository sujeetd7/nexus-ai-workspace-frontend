param(
  [string]$RepositoryRoot = "."
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = (Resolve-Path $RepositoryRoot).Path
Set-Location $root

function Ensure-Dir([string]$Path) {
  New-Item -ItemType Directory -Force $Path | Out-Null
}

function Write-Utf8([string]$Path, [string]$Content) {
  $parent = Split-Path $Path -Parent
  if ($parent) { Ensure-Dir $parent }
  $Content | Set-Content -Path $Path -Encoding utf8
  Write-Host "Created $Path"
}

$pkg = "packages\shared-network"

@(
  "$pkg\src\auth",
  "$pkg\src\base-query",
  "$pkg\src\client",
  "$pkg\src\errors",
  "$pkg\src\graphql",
  "$pkg\src\interceptors",
  "$pkg\src\logging",
  "$pkg\src\retry",
  "$pkg\src\types"
) | ForEach-Object { Ensure-Dir $_ }

Write-Utf8 "$pkg\package.json" @'
{
  "name": "@nexus/shared-network",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "import": "./src/index.ts",
      "default": "./src/index.ts"
    }
  },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "clean": "rimraf dist",
    "lint": "eslint src",
    "test": "vitest run",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^2.12.0",
    "axios": "^1.18.1"
  },
  "devDependencies": {
    "typescript": "5.9.3",
    "vitest": "^4.1.10"
  }
}
'@

Write-Utf8 "$pkg\tsconfig.json" @'
{
  "extends": "../../configs/typescript/tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src/**/*"]
}
'@

Write-Utf8 "$pkg\src\types\contracts.ts" @'
export interface TokenProvider {
  getAccessToken(): string | null | Promise<string | null>;
}

export interface UnauthorizedHandler {
  onUnauthorized(): void | Promise<void>;
}

export interface NetworkLogger {
  debug?(message: string, metadata?: unknown): void;
  info?(message: string, metadata?: unknown): void;
  warn?(message: string, metadata?: unknown): void;
  error?(message: string, metadata?: unknown): void;
}
'@

Write-Utf8 "$pkg\src\types\index.ts" @'
export * from "./contracts";
'@

Write-Utf8 "$pkg\src\errors\ApiError.ts" @'
import axios, { type AxiosError } from "axios";

export interface ApiErrorDetails {
  status?: number;
  code?: string;
  message: string;
  data?: unknown;
  requestId?: string;
  cause?: unknown;
}

export class ApiError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly data?: unknown;
  readonly requestId?: string;

  constructor(details: ApiErrorDetails) {
    super(details.message, { cause: details.cause });
    this.name = "ApiError";
    this.status = details.status;
    this.code = details.code;
    this.data = details.data;
    this.requestId = details.requestId;
  }
}

interface ErrorResponseBody {
  success?: boolean;
  error?: {
    code?: string;
    message?: string;
  };
  code?: string;
  message?: string;
  requestId?: string;
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (!axios.isAxiosError(error)) {
    return new ApiError({
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      cause: error,
    });
  }

  const axiosError = error as AxiosError<ErrorResponseBody>;
  const body = axiosError.response?.data;

  return new ApiError({
    status: axiosError.response?.status,
    code: body?.error?.code ?? body?.code ?? axiosError.code,
    message:
      body?.error?.message ??
      body?.message ??
      axiosError.message ??
      "The request failed.",
    data: body,
    requestId:
      body?.requestId ??
      (axiosError.response?.headers?.["x-request-id"] as string | undefined),
    cause: error,
  });
}
'@

Write-Utf8 "$pkg\src\errors\index.ts" @'
export * from "./ApiError";
'@

Write-Utf8 "$pkg\src\logging\redact.ts" @'
const sensitiveKeys = new Set([
  "authorization",
  "cookie",
  "set-cookie",
  "access_token",
  "accessToken",
  "refresh_token",
  "refreshToken",
  "api_key",
  "apiKey",
  "password",
  "token"
]);

export function redactSensitive(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redactSensitive);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const source = value as Record<string, unknown>;
  const result: Record<string, unknown> = {};

  for (const [key, entry] of Object.entries(source)) {
    result[key] = sensitiveKeys.has(key.toLowerCase())
      ? "[REDACTED]"
      : redactSensitive(entry);
  }

  return result;
}
'@

Write-Utf8 "$pkg\src\logging\index.ts" @'
export * from "./redact";
'@

Write-Utf8 "$pkg\src\interceptors\requestId.ts" @'
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

export function attachRequestId(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  if (!config.headers.has("X-Request-Id")) {
    config.headers.set("X-Request-Id", createRequestId());
  }

  return config;
}
'@

Write-Utf8 "$pkg\src\interceptors\index.ts" @'
export * from "./requestId";
'@

Write-Utf8 "$pkg\src\retry\retryPolicy.ts" @'
import type { AxiosError, AxiosRequestConfig, Method } from "axios";

export interface RetryPolicy {
  maxRetries: number;
  baseDelayMs: number;
  methods: Method[];
  shouldRetry?: (error: AxiosError) => boolean;
}

export const defaultRetryPolicy: RetryPolicy = {
  maxRetries: 3,
  baseDelayMs: 250,
  methods: ["GET", "HEAD", "OPTIONS"],
};

export function isRetryAllowed(
  config: AxiosRequestConfig,
  policy: RetryPolicy,
): boolean {
  const method = (config.method ?? "GET").toUpperCase() as Method;
  return policy.methods.includes(method);
}

export function retryDelay(attempt: number, baseDelayMs = 250): number {
  return baseDelayMs * 2 ** attempt;
}
'@

Write-Utf8 "$pkg\src\retry\index.ts" @'
export * from "./retryPolicy";
'@

Write-Utf8 "$pkg\src\client\createHttpClient.ts" @'
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";

import { normalizeApiError } from "../errors";
import { attachRequestId } from "../interceptors";
import { redactSensitive } from "../logging";
import {
  defaultRetryPolicy,
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
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms);

    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timeout);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
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

  const requestInterceptorId = client.interceptors.request.use(
    async (config) => {
      attachRequestId(config);

      const token = await tokenProvider?.getAccessToken();

      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }

      logger?.debug?.("network.request", redactSensitive({
        method: config.method,
        url: config.url,
        headers: config.headers.toJSON(),
      }));

      return config;
    },
  );

  const responseInterceptorId = client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const config = error.config as
        | (AxiosRequestConfig & { __retryCount?: number })
        | undefined;

      if (
        config &&
        isRetryAllowed(config, retryPolicy) &&
        (config.__retryCount ?? 0) < retryPolicy.maxRetries &&
        (retryPolicy.shouldRetry?.(error) ??
          !error.response ||
          (error.response.status >= 500 && error.response.status < 600))
      ) {
        config.__retryCount = (config.__retryCount ?? 0) + 1;
        await sleep(
          retryDelay(config.__retryCount - 1, retryPolicy.baseDelayMs),
          config.signal ?? undefined,
        );
        return client.request(config);
      }

      const normalized = normalizeApiError(error);

      logger?.error?.("network.error", redactSensitive({
        status: normalized.status,
        code: normalized.code,
        requestId: normalized.requestId,
        message: normalized.message,
      }));

      if (normalized.status === 401) {
        await unauthorizedHandler?.onUnauthorized();
      }

      return Promise.reject(normalized);
    },
  );

  return {
    client,
    ejectInterceptors() {
      client.interceptors.request.eject(requestInterceptorId);
      client.interceptors.response.eject(responseInterceptorId);
    },
  };
}
'@

Write-Utf8 "$pkg\src\client\index.ts" @'
export * from "./createHttpClient";
'@

Write-Utf8 "$pkg\src\base-query\axiosBaseQuery.ts" @'
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosInstance, AxiosRequestConfig, Method } from "axios";

import { normalizeApiError } from "../errors";

export interface AxiosBaseQueryArgs {
  url: string;
  method?: Method;
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: AxiosRequestConfig["headers"];
  signal?: AbortSignal;
}

export interface BaseQueryError {
  status?: number;
  code?: string;
  message: string;
  data?: unknown;
  requestId?: string;
}

export function createAxiosBaseQuery(
  client: AxiosInstance,
): BaseQueryFn<AxiosBaseQueryArgs, unknown, BaseQueryError> {
  return async ({ url, method = "GET", data, params, headers, signal }) => {
    try {
      const response = await client({
        url,
        method,
        data,
        params,
        headers,
        signal,
      });

      return { data: response.data };
    } catch (error) {
      const normalized = normalizeApiError(error);

      return {
        error: {
          status: normalized.status,
          code: normalized.code,
          message: normalized.message,
          data: normalized.data,
          requestId: normalized.requestId,
        },
      };
    }
  };
}
'@

Write-Utf8 "$pkg\src\base-query\index.ts" @'
export * from "./axiosBaseQuery";
'@

Write-Utf8 "$pkg\src\graphql\graphql.ts" @'
import type { AxiosInstance } from "axios";

import { ApiError, normalizeApiError } from "../errors";

export interface GraphQLRequest {
  query: string;
  variables?: Record<string, unknown>;
}

export interface GraphQLErrorShape {
  message: string;
  extensions?: {
    code?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLErrorShape[];
}

export function createGraphQLBaseQuery(client: AxiosInstance) {
  return async function graphqlBaseQuery<T>(
    request: GraphQLRequest,
    signal?: AbortSignal,
  ): Promise<T> {
    try {
      const response = await client.post<GraphQLResponse<T>>("", request, {
        signal,
      });

      if (response.data.errors?.length) {
        const first = response.data.errors[0];

        throw new ApiError({
          code: first?.extensions?.code,
          message: first?.message ?? "GraphQL request failed.",
          data: response.data.errors,
        });
      }

      if (response.data.data === undefined) {
        throw new ApiError({
          message: "GraphQL response did not contain data.",
          data: response.data,
        });
      }

      return response.data.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  };
}
'@

Write-Utf8 "$pkg\src\graphql\index.ts" @'
export * from "./graphql";
'@

Write-Utf8 "$pkg\src\index.ts" @'
export * from "./base-query";
export * from "./client";
export * from "./errors";
export * from "./graphql";
export * from "./interceptors";
export * from "./logging";
export * from "./retry";
export * from "./types";
'@

Write-Host ""
Write-Host "Shared network package scaffolded."
Write-Host "Next commands:"
Write-Host "  pnpm --filter web add @nexus/shared-network@workspace:*"
Write-Host "  pnpm install"
Write-Host "  pnpm --filter @nexus/shared-network typecheck"
Write-Host "  pnpm --filter @nexus/shared-network lint"
