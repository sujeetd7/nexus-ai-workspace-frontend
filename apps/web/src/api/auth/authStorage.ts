import { STORAGE_KEYS } from "../../config/constants";

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export function getAccessToken(): string | null {
  return getStorage()?.getItem(STORAGE_KEYS.ACCESS_TOKEN) ?? null;
}

export function setAccessToken(token: string): void {
  getStorage()?.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
}

export function getRefreshToken(): string | null {
  return getStorage()?.getItem(STORAGE_KEYS.REFRESH_TOKEN) ?? null;
}

export function setRefreshToken(token: string): void {
  getStorage()?.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
}

export function setTokens(accessToken: string, refreshToken?: string): void {
  setAccessToken(accessToken);

  if (refreshToken) {
    setRefreshToken(refreshToken);
  }
}

export function clearTokens(): void {
  const storage = getStorage();

  storage?.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  storage?.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
}
