import {
  createHttpClient,
  type ManagedHttpClient,
} from "@nexus/shared-network";
import type { Logger, PublicClientConfig } from "@nexus/shared-types";
import type { SessionManager } from "@nexus/shared-utils";
import type { AxiosInstance } from "axios";

import {
  createWebAuthClient,
  resetWebAuthClientForTests,
  setWebAuthClient,
} from "../auth/createWebAuthClient";
import {
  createWebUserClient,
  resetWebUserClientForTests,
  setWebUserClient,
} from "../user/createWebUserClient";
import {
  createWebWorkspaceClient,
  resetWebWorkspaceClientForTests,
  setWebWorkspaceClient,
} from "../workspace/createWebWorkspaceClient";
import {
  createWebSessionManager,
  getWebSessionManager,
  resetWebSessionManagerForTests,
} from "../../platform/auth";
import { createWebTokenStorage } from "../../platform/auth/createWebTokenStorage";
import { createNetworkLoggerAdapter } from "../../platform/logging";
import { setUnauthorizedHandler } from "../auth";

export interface CreateWebHttpClientOptions {
  readonly config: PublicClientConfig;
  readonly logger: Logger;
}

let managedHttpClient: ManagedHttpClient | null = null;
let sessionManagerRef: SessionManager | null = null;

/**
 * Assigned once by {@link createWebHttpClient}. Used by RTK base query after bootstrap.
 */
export let axiosClient!: AxiosInstance;

/**
 * Creates the application HTTP client once. Subsequent calls return the same instance.
 */
export function createWebHttpClient(
  options: CreateWebHttpClientOptions
): AxiosInstance {
  if (managedHttpClient) {
    return managedHttpClient.client;
  }

  const tokenStorage = createWebTokenStorage();

  managedHttpClient = createHttpClient({
    baseURL: options.config.apiBaseUrl,
    tokenProvider: {
      getAccessToken: () => tokenStorage.getAccessToken(),
    },
    refreshHandler: {
      tryRefresh: async () => sessionManagerRef?.tryRefresh() ?? null,
      shouldSkipRefresh: (url) =>
        sessionManagerRef?.shouldSkipRefresh?.(url) ?? false,
    },
    unauthorizedHandler: {
      onUnauthorized: async () => {
        if (sessionManagerRef?.getSnapshot().status === "session-expired") {
          setUnauthorizedHandler(() => undefined);
        }
      },
    },
    logger: createNetworkLoggerAdapter(options.logger),
  });

  axiosClient = managedHttpClient.client;
  const authClient = setWebAuthClient(
    createWebAuthClient({ client: axiosClient })
  );
  setWebUserClient(createWebUserClient({ client: axiosClient }));
  setWebWorkspaceClient(createWebWorkspaceClient({ client: axiosClient }));
  sessionManagerRef = createWebSessionManager({
    authClient,
    logger: options.logger,
  });

  return axiosClient;
}

export function getWebHttpClient(): AxiosInstance {
  if (!managedHttpClient) {
    throw new Error("Web HTTP client has not been initialized.");
  }
  return managedHttpClient.client;
}

export function getWebSession(): SessionManager {
  return getWebSessionManager();
}

export function ejectHttpInterceptors(): void {
  managedHttpClient?.ejectInterceptors();
}

/** Test helper — resets the singleton between isolated suites. */
export function resetWebHttpClientForTests(): void {
  if (managedHttpClient) {
    managedHttpClient.ejectInterceptors();
  }
  managedHttpClient = null;
  sessionManagerRef = null;
  axiosClient = undefined as unknown as AxiosInstance;
  resetWebAuthClientForTests();
  resetWebUserClientForTests();
  resetWebWorkspaceClientForTests();
  resetWebSessionManagerForTests();
}
