import type {
  BootstrapOutcome,
  Logger,
  PublicClientConfig,
} from "@nexus/shared-types";

import type { createMobileHttpClient } from "../api/client/axios";
import type {
  MobileDependencyRegistry,
  PlatformExtensionRegistry,
} from "../platform/registry";
import type { AppStore } from "../store/createAppStore";

export type MobileHttpClient = ReturnType<typeof createMobileHttpClient>;

export interface MobileRuntime {
  readonly config: PublicClientConfig;
  readonly logger: Logger;
  readonly httpClient: MobileHttpClient;
  readonly store: AppStore;
  readonly registry: MobileDependencyRegistry;
  readonly extensions: PlatformExtensionRegistry;
  readonly featureOrder: readonly string[];
}

export type MobileBootstrapOutcome = BootstrapOutcome<MobileRuntime>;
