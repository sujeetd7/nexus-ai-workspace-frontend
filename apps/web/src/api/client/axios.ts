import { createHttpClient, type ManagedHttpClient } from "@nexus/shared-network";
import type { Logger, PublicClientConfig } from "@nexus/shared-types";
import type { AxiosInstance } from "axios";

import { createNetworkLoggerAdapter } from "../../platform/logging";
import { getAccessToken, logout } from "../auth";

export interface CreateWebHttpClientOptions {
  readonly config: PublicClientConfig;
  readonly logger: Logger;
}

let managedHttpClient: ManagedHttpClient | null = null;

/**
 * Assigned once by {@link createWebHttpClient}. Used by RTK base query after bootstrap.
 */
export let axiosClient!: AxiosInstance;

/**
 * Creates the application HTTP client once. Subsequent calls return the same instance.
 */
export function createWebHttpClient(
  options: CreateWebHttpClientOptions,
): AxiosInstance {
  if (managedHttpClient) {
    return managedHttpClient.client;
  }

  managedHttpClient = createHttpClient({
    baseURL: options.config.apiBaseUrl,
    tokenProvider: {
      getAccessToken,
    },
    unauthorizedHandler: {
      onUnauthorized: logout,
    },
    logger: createNetworkLoggerAdapter(options.logger),
  });

  axiosClient = managedHttpClient.client;
  return axiosClient;
}

export function getWebHttpClient(): AxiosInstance {
  if (!managedHttpClient) {
    throw new Error("Web HTTP client has not been initialized.");
  }
  return managedHttpClient.client;
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
  axiosClient = undefined as unknown as AxiosInstance;
}
