import { createHttpClient, type ManagedHttpClient } from "@nexus/shared-network";
import type { Logger, PublicClientConfig } from "@nexus/shared-types";
import type { AxiosInstance } from "axios";

import { createNetworkLoggerAdapter } from "../../platform/logging/createNetworkLoggerAdapter";

export interface CreateMobileHttpClientOptions {
  readonly config: PublicClientConfig;
  readonly logger: Logger;
}

let managedHttpClient: ManagedHttpClient | null = null;

export let axiosClient!: AxiosInstance;

/**
 * Creates the mobile HTTP client once. No auth token wiring in Sprint 3.
 */
export function createMobileHttpClient(
  options: CreateMobileHttpClientOptions,
): AxiosInstance {
  if (managedHttpClient) {
    return managedHttpClient.client;
  }

  managedHttpClient = createHttpClient({
    baseURL: options.config.apiBaseUrl,
    logger: createNetworkLoggerAdapter(options.logger),
  });

  axiosClient = managedHttpClient.client;
  return axiosClient;
}

export function getMobileHttpClient(): AxiosInstance {
  if (!managedHttpClient) {
    throw new Error("Mobile HTTP client has not been initialized.");
  }
  return managedHttpClient.client;
}

export function ejectHttpInterceptors(): void {
  managedHttpClient?.ejectInterceptors();
}

export function resetMobileHttpClientForTests(): void {
  if (managedHttpClient) {
    managedHttpClient.ejectInterceptors();
  }
  managedHttpClient = null;
  axiosClient = undefined as unknown as AxiosInstance;
}
