import type { TokenStorageAdapter } from "@nexus/shared-utils";

import { STORAGE_KEYS } from "../../config/constants";

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export function createWebTokenStorage(): TokenStorageAdapter {
  return {
    async getAccessToken() {
      return getStorage()?.getItem(STORAGE_KEYS.ACCESS_TOKEN) ?? null;
    },

    async getRefreshToken() {
      return getStorage()?.getItem(STORAGE_KEYS.REFRESH_TOKEN) ?? null;
    },

    async setTokens(accessToken, refreshToken) {
      getStorage()?.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      getStorage()?.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    },

    async clearTokens() {
      const storage = getStorage();
      storage?.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      storage?.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    },
  };
}
