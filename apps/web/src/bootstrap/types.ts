import type {
  BootstrapOutcome,
  Logger,
  PublicClientConfig,
  StorageAdapter,
} from "@nexus/shared-types";

import type { createWebHttpClient } from "../api/client/axios";
import type { AppStore } from "../store/createAppStore";

export type WebHttpClient = ReturnType<typeof createWebHttpClient>;

export interface WebRuntime {
  readonly config: PublicClientConfig;
  readonly logger: Logger;
  readonly themeStorage: StorageAdapter;
  readonly httpClient: WebHttpClient;
  readonly store: AppStore;
}

export type WebBootstrapOutcome = BootstrapOutcome<WebRuntime>;
