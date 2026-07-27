import type { AuthClient, Logger } from "@nexus/shared-types";
import { createSessionManager, type SessionManager } from "@nexus/shared-utils";

import { createWebTokenStorage } from "./createWebTokenStorage";

let sessionManager: SessionManager | null = null;

export interface CreateWebSessionManagerOptions {
  readonly authClient: AuthClient;
  readonly logger?: Logger;
}

export function createWebSessionManager(
  options: CreateWebSessionManagerOptions
): SessionManager {
  if (sessionManager) {
    return sessionManager;
  }

  sessionManager = createSessionManager({
    authClient: options.authClient,
    tokenStorage: createWebTokenStorage(),
    logger: options.logger,
  });

  return sessionManager;
}

export function getWebSessionManager(): SessionManager {
  if (!sessionManager) {
    throw new Error("Web session manager has not been initialized.");
  }
  return sessionManager;
}

export function resetWebSessionManagerForTests(): void {
  sessionManager = null;
}
