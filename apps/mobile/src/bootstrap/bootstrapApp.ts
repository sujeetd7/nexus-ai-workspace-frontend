import {
  BOOTSTRAP_FAILURE_CODES,
  type BootstrapFailure,
  type Logger,
  type PublicClientConfig,
} from "@nexus/shared-types";
import { logAppError } from "@nexus/shared-utils";

import {
  createMobileHttpClient,
  resetMobileHttpClientForTests,
} from "../api/client/axios";
import { createMobileEnv } from "../config/env";
import {
  mobilePublicConfigSource,
  type MobilePublicConfigSource,
} from "../config/publicConfig";
import { createMobileLogger } from "../platform/logging/createMobileLogger";
import {
  createAppStore,
  type AppStore,
  type AppStoreBundle,
} from "../store/createAppStore";
import type {
  MobileBootstrapOutcome,
  MobileHttpClient,
  MobileRuntime,
} from "./types";

export interface BootstrapMobileAppOptions {
  readonly configSource?: MobilePublicConfigSource;
  readonly logger?: Logger;
  readonly startSaga?: boolean;
}

interface BootstrapCache {
  outcome: MobileBootstrapOutcome;
  storeBundle?: AppStoreBundle;
}

let cache: BootstrapCache | null = null;

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
 * Deterministic, idempotent mobile application bootstrap.
 */
export function bootstrapMobileApp(
  options: BootstrapMobileAppOptions = {},
): MobileBootstrapOutcome {
  if (cache?.outcome.status === "ready") {
    return cache.outcome;
  }

  let logger: Logger | undefined;
  let config: PublicClientConfig | undefined;

  try {
    config = createMobileEnv(
      options.configSource ?? mobilePublicConfigSource,
    );
    logger = options.logger ?? createMobileLogger({ config });

    const httpClient: MobileHttpClient = createMobileHttpClient({
      config,
      logger,
    });

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
      const outcome: MobileBootstrapOutcome = { status: "failed", failure };
      cache = { outcome };
      return outcome;
    }

    const runtime: MobileRuntime = {
      config,
      logger,
      httpClient,
      store: storeBundle.store,
    };

    const outcome: MobileBootstrapOutcome = { status: "ready", runtime };
    cache = { outcome, storeBundle };
    logger.info("Mobile application bootstrap ready.");
    return outcome;
  } catch (cause) {
    const failure = toFailure(
      BOOTSTRAP_FAILURE_CODES.CONFIGURATION_INVALID,
      "Application configuration is invalid.",
      cause,
      true,
    );
    safeLogFailure(logger, failure);
    const outcome: MobileBootstrapOutcome = { status: "failed", failure };
    cache = { outcome };
    return outcome;
  }
}

export function getBootstrappedMobileStore(): AppStore | undefined {
  if (cache?.outcome.status === "ready") {
    return cache.outcome.runtime.store;
  }
  return undefined;
}

export function resetMobileBootstrapForTests(): void {
  cache = null;
  resetMobileHttpClientForTests();
}

export function retryMobileBootstrap(
  options: BootstrapMobileAppOptions = {},
): MobileBootstrapOutcome {
  if (cache?.outcome.status === "ready") {
    return cache.outcome;
  }
  cache = null;
  resetMobileHttpClientForTests();
  return bootstrapMobileApp(options);
}
