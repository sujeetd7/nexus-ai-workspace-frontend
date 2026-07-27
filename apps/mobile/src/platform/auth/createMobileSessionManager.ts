import type { AuthClient, Logger } from '@nexus/shared-types';
import { createSessionManager, type SessionManager } from '@nexus/shared-utils';

import { createMobileTokenStorage } from './createMobileTokenStorage';

let sessionManager: SessionManager | null = null;

export interface CreateMobileSessionManagerOptions {
  readonly authClient: AuthClient;
  readonly logger?: Logger;
}

export function createMobileSessionManager(
  options: CreateMobileSessionManagerOptions,
): SessionManager {
  if (sessionManager) {
    return sessionManager;
  }

  sessionManager = createSessionManager({
    authClient: options.authClient,
    tokenStorage: createMobileTokenStorage(),
    logger: options.logger,
  });

  return sessionManager;
}

export function getMobileSessionManager(): SessionManager {
  if (!sessionManager) {
    throw new Error('Mobile session manager has not been initialized.');
  }
  return sessionManager;
}

export function resetMobileSessionManagerForTests(): void {
  sessionManager = null;
}
