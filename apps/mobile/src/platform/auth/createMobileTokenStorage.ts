/**
 * Mobile token storage — in-memory only (TD-008 secure storage deferred).
 * Refresh tokens are not persisted across app restarts on mobile in W5.
 */
import type { TokenStorageAdapter } from '@nexus/shared-utils';

let accessToken: string | null = null;
let refreshToken: string | null = null;

export function createMobileTokenStorage(): TokenStorageAdapter {
  return {
    async getAccessToken() {
      return accessToken;
    },
    async getRefreshToken() {
      return refreshToken;
    },
    async setTokens(nextAccessToken, nextRefreshToken) {
      accessToken = nextAccessToken;
      refreshToken = nextRefreshToken;
    },
    async clearTokens() {
      accessToken = null;
      refreshToken = null;
    },
  };
}

export function resetMobileTokenStorageForTests(): void {
  accessToken = null;
  refreshToken = null;
}
