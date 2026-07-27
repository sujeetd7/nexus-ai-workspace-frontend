import {
  createHttpClient,
  type ManagedHttpClient,
} from '@nexus/shared-network';
import type { Logger, PublicClientConfig } from '@nexus/shared-types';
import type { SessionManager } from '@nexus/shared-utils';
import type { AxiosInstance } from 'axios';

import {
  createMobileAuthClient,
  resetMobileAuthClientForTests,
  setMobileAuthClient,
} from '../auth/createMobileAuthClient';
import {
  createMobileUserClient,
  resetMobileUserClientForTests,
  setMobileUserClient,
} from '../user/createMobileUserClient';
import {
  createMobileWorkspaceClient,
  resetMobileWorkspaceClientForTests,
  setMobileWorkspaceClient,
} from '../workspace/createMobileWorkspaceClient';
import {
  createMobileSessionManager,
  getMobileSessionManager,
  resetMobileSessionManagerForTests,
} from '../../platform/auth/createMobileSessionManager';
import { createMobileTokenStorage } from '../../platform/auth/createMobileTokenStorage';
import { createNetworkLoggerAdapter } from '../../platform/logging/createNetworkLoggerAdapter';

export interface CreateMobileHttpClientOptions {
  readonly config: PublicClientConfig;
  readonly logger: Logger;
}

let managedHttpClient: ManagedHttpClient | null = null;
let sessionManagerRef: SessionManager | null = null;

export let axiosClient!: AxiosInstance;

export function createMobileHttpClient(
  options: CreateMobileHttpClientOptions,
): AxiosInstance {
  if (managedHttpClient) {
    return managedHttpClient.client;
  }

  const tokenStorage = createMobileTokenStorage();

  managedHttpClient = createHttpClient({
    baseURL: options.config.apiBaseUrl,
    tokenProvider: {
      getAccessToken: () => tokenStorage.getAccessToken(),
    },
    refreshHandler: {
      tryRefresh: async () => sessionManagerRef?.tryRefresh() ?? null,
      shouldSkipRefresh: url =>
        sessionManagerRef?.shouldSkipRefresh?.(url) ?? false,
    },
    logger: createNetworkLoggerAdapter(options.logger),
  });

  axiosClient = managedHttpClient.client;
  const authClient = setMobileAuthClient(
    createMobileAuthClient({ client: axiosClient }),
  );
  setMobileUserClient(createMobileUserClient({ client: axiosClient }));
  setMobileWorkspaceClient(
    createMobileWorkspaceClient({ client: axiosClient }),
  );
  sessionManagerRef = createMobileSessionManager({
    authClient,
    logger: options.logger,
  });

  return axiosClient;
}

export function getMobileHttpClient(): AxiosInstance {
  if (!managedHttpClient) {
    throw new Error('Mobile HTTP client has not been initialized.');
  }
  return managedHttpClient.client;
}

export function getMobileSession(): SessionManager {
  return getMobileSessionManager();
}

export function ejectHttpInterceptors(): void {
  managedHttpClient?.ejectInterceptors();
}

export function resetMobileHttpClientForTests(): void {
  if (managedHttpClient) {
    managedHttpClient.ejectInterceptors();
  }
  managedHttpClient = null;
  sessionManagerRef = null;
  axiosClient = undefined as unknown as AxiosInstance;
  resetMobileAuthClientForTests();
  resetMobileUserClientForTests();
  resetMobileWorkspaceClientForTests();
  resetMobileSessionManagerForTests();
}
