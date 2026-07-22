import { describe, expect, it, vi } from "vitest";
import type { StorageAdapter } from "@nexus/shared-types";

import {
  readThemePreference,
  writeThemePreference,
} from "./themePersistence";
import { THEME_PREFERENCE_STORAGE_KEY } from "./themeStorageKey";

function createMemoryAdapter(
  initial: Record<string, string> = {},
): StorageAdapter & { store: Record<string, string> } {
  const store = { ...initial };
  return {
    store,
    getItem(key) {
      return key in store ? store[key]! : null;
    },
    setItem(key, value) {
      store[key] = value;
    },
    removeItem(key) {
      delete store[key];
    },
  };
}

describe("themePersistence", () => {
  it("reads valid preferences", async () => {
    const storage = createMemoryAdapter({
      [THEME_PREFERENCE_STORAGE_KEY]: "dark",
    });
    await expect(
      readThemePreference(storage, THEME_PREFERENCE_STORAGE_KEY),
    ).resolves.toBe("dark");
  });

  it("rejects unknown or corrupted values", async () => {
    const storage = createMemoryAdapter({
      [THEME_PREFERENCE_STORAGE_KEY]: "purple",
    });
    await expect(
      readThemePreference(storage, THEME_PREFERENCE_STORAGE_KEY),
    ).resolves.toBeNull();
  });

  it("returns null when missing", async () => {
    const storage = createMemoryAdapter();
    await expect(
      readThemePreference(storage, THEME_PREFERENCE_STORAGE_KEY),
    ).resolves.toBeNull();
  });

  it("swallows read failures", async () => {
    const storage: StorageAdapter = {
      getItem() {
        throw new Error("boom");
      },
      setItem() {
        return undefined;
      },
      removeItem() {
        return undefined;
      },
    };
    await expect(
      readThemePreference(storage, THEME_PREFERENCE_STORAGE_KEY),
    ).resolves.toBeNull();
  });

  it("writes preferences and swallows write failures", async () => {
    const storage = createMemoryAdapter();
    await writeThemePreference(
      storage,
      THEME_PREFERENCE_STORAGE_KEY,
      "system",
    );
    expect(storage.store[THEME_PREFERENCE_STORAGE_KEY]).toBe("system");

    const failing: StorageAdapter = {
      getItem: () => null,
      setItem() {
        throw new Error("quota");
      },
      removeItem() {
        return undefined;
      },
    };
    await expect(
      writeThemePreference(failing, THEME_PREFERENCE_STORAGE_KEY, "light"),
    ).resolves.toBeUndefined();
  });

  it("owns the canonical storage key identity", () => {
    expect(THEME_PREFERENCE_STORAGE_KEY).toBe("nexus:prefs:theme");
  });
});

describe("themePersistence async adapters", () => {
  it("supports MaybePromise storage reads", async () => {
    const storage: StorageAdapter = {
      async getItem() {
        return "system";
      },
      async setItem() {
        return undefined;
      },
      async removeItem() {
        return undefined;
      },
    };
    await expect(
      readThemePreference(storage, THEME_PREFERENCE_STORAGE_KEY),
    ).resolves.toBe("system");
  });
});

describe("writeThemePreference side effects", () => {
  it("does not call setItem when using a spy that verifies call args", async () => {
    const setItem = vi.fn();
    const storage: StorageAdapter = {
      getItem: () => null,
      setItem,
      removeItem: () => undefined,
    };
    await writeThemePreference(storage, THEME_PREFERENCE_STORAGE_KEY, "light");
    expect(setItem).toHaveBeenCalledWith(
      THEME_PREFERENCE_STORAGE_KEY,
      "light",
    );
  });
});
