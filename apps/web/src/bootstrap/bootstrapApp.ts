import {
  BOOTSTRAP_FAILURE_CODES,
  type BootstrapFailure,
  type Logger,
  type PublicClientConfig,
  type StorageAdapter,
} from "@nexus/shared-types";
import { logAppError } from "@nexus/shared-utils";

import { createWebHttpClient, resetWebHttpClientForTests } from "../api/client/axios";
import { createWebEnv, type ViteEnvSource } from "../config/env";
import { createWebLogger } from "../platform/logging/createWebLogger";
import { createLocalStorageAdapter } from "../platform/storage";
import {
  createAppStore,
  type AppStore,
  type AppStoreBundle,
} from "../store/createAppStore";
import { registerWebPlatform } from "../platform/registry";
import type { WebBootstrapOutcome, WebHttpClient, WebRuntime } from "./types";

export interface BootstrapWebAppOptions {
  /** Override Vite env (tests). Defaults to `import.meta.env`. */
  readonly viteEnv?: ViteEnvSource;
  /** Inject storage (tests). Defaults to localStorage adapter. */
  readonly themeStorage?: StorageAdapter;
  /** Inject logger factory result (tests). */
  readonly logger?: Logger;
  /** When false, skip starting root Saga. */
  readonly startSaga?: boolean;
}

interface BootstrapCache {
  outcome: WebBootstrapOutcome;
  storeBundle?: AppStoreBundle;
}

let cache: BootstrapCache | null = null;

function readDefaultViteEnv(): ViteEnvSource {
  return {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_GRAPHQL_URL: import.meta.env.VITE_GRAPHQL_URL,
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    MODE: import.meta.env.MODE,
  };
}

function toFailure(
  code: BootstrapFailure["code"],
  message: string,
  cause: unknown,
  retryable: boolean,
): BootstrapFailure {
  return { code, message, cause, retryable };
}

function safeLogFailure(logger: Logger | undefined, failure: BootstrapFailure): void {
  if (!logger) {
    return;
  }
  try {
    if (failure.cause instanceof Error) {
      logAppError(logger, failure.cause, failure.message);
      return;
    }
    logger.error(failure.message, { code: failure.code });
  } catch {
    // Never throw from bootstrap logging.
  }
}

/**
 * Deterministic, idempotent web application bootstrap.
 * Critical failures return a structured outcome instead of throwing to the UI root.
 */
export function bootstrapWebApp(
  options: BootstrapWebAppOptions = {},
): WebBootstrapOutcome {
  if (cache?.outcome.status === "ready") {
    return cache.outcome;
  }

  let logger: Logger | undefined;
  let config: PublicClientConfig | undefined;

  try {
    config = createWebEnv(options.viteEnv ?? readDefaultViteEnv());
    logger = options.logger ?? createWebLogger({ config });

    let themeStorage: StorageAdapter;
    try {
      themeStorage = options.themeStorage ?? createLocalStorageAdapter();
    } catch (cause) {
      // Theme persistence is optional — continue without durable preference.
      logger.warn("Theme storage unavailable; continuing without persistence.", {
        code: "THEME_STORAGE_OPTIONAL",
      });
      themeStorage = {
        getItem: async () => null,
        setItem: async () => undefined,
        removeItem: async () => undefined,
      };
      void cause;
    }

    const httpClient: WebHttpClient = createWebHttpClient({ config, logger });

    let storeBundle: AppStoreBundle;
    try {
      storeBundle = createAppStore({
        config,
        startSaga: options.startSaga,
      });
    } catch (cause) {
      const failure = toFailure(
        BOOTSTRAP_FAILURE_CODES.STORE_INIT_FAILED,
        "The application could not start its state layer.",
        cause,
        true,
      );
      safeLogFailure(logger, failure);
      const outcome: WebBootstrapOutcome = { status: "failed", failure };
      cache = { outcome };
      return outcome;
    }

    let registration;
    try {
      registration = registerWebPlatform({
        config,
        logger,
        themeStorage,
        httpClient,
      });
    } catch (cause) {
      const failure = toFailure(
        BOOTSTRAP_FAILURE_CODES.REGISTRATION_FAILED,
        "The application could not complete platform registration.",
        cause,
        true,
      );
      safeLogFailure(logger, failure);
      const outcome: WebBootstrapOutcome = { status: "failed", failure };
      cache = { outcome };
      return outcome;
    }

    const runtime: WebRuntime = {
      config,
      logger,
      themeStorage,
      httpClient,
      store: storeBundle.store,
      registry: registration.registry,
      extensions: registration.extensions,
      featureOrder: registration.featureOrder,
    };

    const outcome: WebBootstrapOutcome = { status: "ready", runtime };
    cache = { outcome, storeBundle };
    logger.info("Web application bootstrap ready.");
    return outcome;
  } catch (cause) {
    const isConfig =
      cause instanceof Error &&
      (cause.message.toLowerCase().includes("config") ||
        cause.message.toLowerCase().includes("url") ||
        cause.message.toLowerCase().includes("mode"));

    const failure = toFailure(
      isConfig
        ? BOOTSTRAP_FAILURE_CODES.CONFIGURATION_INVALID
        : BOOTSTRAP_FAILURE_CODES.RUNTIME_INIT_FAILED,
      isConfig
        ? "Application configuration is invalid. Check environment settings."
        : "The application failed to start.",
      cause,
      true,
    );
    safeLogFailure(logger, failure);
    const outcome: WebBootstrapOutcome = { status: "failed", failure };
    cache = { outcome };
    return outcome;
  }
}

export function getBootstrappedWebStore(): AppStore | undefined {
  if (cache?.outcome.status === "ready") {
    return cache.outcome.runtime.store;
  }
  return undefined;
}

/**
 * Clears bootstrap cache and HTTP singleton. Intended for tests and safe retry.
 */
export function resetWebBootstrapForTests(): void {
  cache = null;
  resetWebHttpClientForTests();
}

/**
 * Retries bootstrap after a failed attempt. No-ops when already ready.
 */
export function retryWebBootstrap(
  options: BootstrapWebAppOptions = {},
): WebBootstrapOutcome {
  if (cache?.outcome.status === "ready") {
    return cache.outcome;
  }
  cache = null;
  resetWebHttpClientForTests();
  return bootstrapWebApp(options);
}
