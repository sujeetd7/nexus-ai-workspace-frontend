import type {
  BootstrapOutcome,
  Logger,
  PublicClientConfig,
  StorageAdapter,
} from "@nexus/shared-types";

import type { createWebHttpClient } from "../api/client/axios";
import type {
  PlatformExtensionRegistry,
  WebDependencyRegistry,
} from "../platform/registry";
import type { AppStore } from "../store/createAppStore";

export type WebHttpClient = ReturnType<typeof createWebHttpClient>;

export interface WebRuntime {
  readonly config: PublicClientConfig;
  readonly logger: Logger;
  readonly themeStorage: StorageAdapter;
  readonly httpClient: WebHttpClient;
  readonly store: AppStore;
  readonly registry: WebDependencyRegistry;
  readonly extensions: PlatformExtensionRegistry;
  readonly featureOrder: readonly string[];
}

export type WebBootstrapOutcome = BootstrapOutcome<WebRuntime>;
