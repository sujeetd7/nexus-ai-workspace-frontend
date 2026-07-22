import type {
  BootstrapOutcome,
  Logger,
  PublicClientConfig,
} from "@nexus/shared-types";

import type { createMobileHttpClient } from "../api/client/axios";
import type { AppStore } from "../store/createAppStore";

export type MobileHttpClient = ReturnType<typeof createMobileHttpClient>;

export interface MobileRuntime {
  readonly config: PublicClientConfig;
  readonly logger: Logger;
  readonly httpClient: MobileHttpClient;
  readonly store: AppStore;
}

export type MobileBootstrapOutcome = BootstrapOutcome<MobileRuntime>;
