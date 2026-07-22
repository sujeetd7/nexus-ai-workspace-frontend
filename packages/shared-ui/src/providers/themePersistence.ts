import type { StorageAdapter } from "@nexus/shared-types";

import {
  isThemePreference,
  type ThemePreference,
} from "../theme/resolveThemeMode";

export async function readThemePreference(
  storage: StorageAdapter,
  storageKey: string,
): Promise<ThemePreference | null> {
  try {
    const raw = await storage.getItem(storageKey);
    if (raw === null) {
      return null;
    }
    return isThemePreference(raw) ? raw : null;
  } catch {
    return null;
  }
}

export async function writeThemePreference(
  storage: StorageAdapter,
  storageKey: string,
  preference: ThemePreference,
): Promise<void> {
  try {
    await storage.setItem(storageKey, preference);
  } catch {
    // Persistence failures must not break theme switching.
  }
}
