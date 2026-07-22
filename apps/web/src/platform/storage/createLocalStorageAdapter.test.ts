/**
 * @vitest-environment jsdom
 */

import { ERROR_CODES, type AppError } from "@nexus/shared-types";
import { beforeEach, describe, expect, it } from "vitest";
import { createLocalStorageAdapter } from "./createLocalStorageAdapter";

function isStorageAppError(value: unknown): value is AppError {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    (value as { code?: unknown }).code === ERROR_CODES.STORAGE
  );
}

function createMemoryDomStorage(): Storage {
  const store = new Map<string, string>();

  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.has(key) ? (store.get(key) as string) : null;
    },
    key(index: number) {
      return [...store.keys()][index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, String(value));
    },
  };
}

describe("createLocalStorageAdapter", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe("contract with injected storage", () => {
    const createAdapter = () =>
      createLocalStorageAdapter({ storage: createMemoryDomStorage() });

    it("returns null for a missing key", async () => {
      const adapter = createAdapter();
      expect(await adapter.getItem("missing")).toBeNull();
    });

    it("sets and gets a value", async () => {
      const adapter = createAdapter();
      await adapter.setItem("alpha", "one");
      expect(await adapter.getItem("alpha")).toBe("one");
    });

    it("overwrites an existing value", async () => {
      const adapter = createAdapter();
      await adapter.setItem("alpha", "one");
      await adapter.setItem("alpha", "two");
      expect(await adapter.getItem("alpha")).toBe("two");
    });

    it("stores an empty string", async () => {
      const adapter = createAdapter();
      await adapter.setItem("empty", "");
      expect(await adapter.getItem("empty")).toBe("");
    });

    it("removes keys and supports clear", async () => {
      const adapter = createAdapter();
      await adapter.setItem("a", "1");
      await adapter.setItem("b", "2");
      await adapter.removeItem("a");
      expect(await adapter.getItem("a")).toBeNull();
      await adapter.clear?.();
      expect(await adapter.getItem("b")).toBeNull();
    });

    it("removeItem is idempotent for missing keys", async () => {
      const adapter = createAdapter();
      await adapter.removeItem("missing");
      expect(await adapter.getItem("missing")).toBeNull();
    });
  });

  it("uses browser localStorage when no storage is injected", async () => {
    const adapter = createLocalStorageAdapter();
    await adapter.setItem("browser-key", "value");
    expect(window.localStorage.getItem("browser-key")).toBe("value");
    expect(await adapter.getItem("browser-key")).toBe("value");
  });

  it("maps unavailable browser storage to STORAGE errors", () => {
    const adapter = createLocalStorageAdapter();
    const original = Object.getOwnPropertyDescriptor(window, "localStorage");

    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        return undefined;
      },
    });

    try {
      expect(() => adapter.getItem("x")).toThrow();
      try {
        adapter.getItem("x");
      } catch (error) {
        expect(isStorageAppError(error)).toBe(true);
        if (isStorageAppError(error)) {
          expect(error.code).toBe(ERROR_CODES.STORAGE);
          expect(error.metadata?.failure).toBe("unavailable");
          expect(error.metadata?.adapter).toBe("browser");
        }
      }
    } finally {
      if (original) {
        Object.defineProperty(window, "localStorage", original);
      }
    }
  });

  it("maps quota failures safely", () => {
    const storage = createMemoryDomStorage();
    storage.setItem = () => {
      const error = new Error("quota");
      error.name = "QuotaExceededError";
      throw error;
    };

    const adapter = createLocalStorageAdapter({ storage });

    try {
      adapter.setItem("k", "secret-token-value");
      expect.unreachable();
    } catch (error) {
      expect(isStorageAppError(error)).toBe(true);
      if (isStorageAppError(error)) {
        expect(error.code).toBe(ERROR_CODES.STORAGE);
        expect(error.metadata?.failure).toBe("quota");
      }
      expect(JSON.stringify(error)).not.toContain("secret-token-value");
    }
  });

  it("maps security failures safely", () => {
    const storage = createMemoryDomStorage();
    storage.getItem = () => {
      const error = new Error("blocked");
      error.name = "SecurityError";
      throw error;
    };

    const adapter = createLocalStorageAdapter({ storage });

    try {
      adapter.getItem("accessToken");
      expect.unreachable();
    } catch (error) {
      expect(isStorageAppError(error)).toBe(true);
      if (isStorageAppError(error)) {
        expect(error.metadata?.failure).toBe("access");
      }
      expect(JSON.stringify(error)).not.toContain("accessToken");
    }
  });

  it("maps remove and clear failures", () => {
    const storage = createMemoryDomStorage();
    storage.removeItem = () => {
      throw new Error("remove failed");
    };
    storage.clear = () => {
      throw new Error("clear failed");
    };

    const adapter = createLocalStorageAdapter({ storage });

    expect(() => adapter.removeItem("k")).toThrow();
    expect(() => adapter.clear?.()).toThrow();
  });

  it("maps access getter throws on resolve", () => {
    const adapter = createLocalStorageAdapter();
    const original = Object.getOwnPropertyDescriptor(window, "localStorage");

    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        const error = new Error("denied");
        error.name = "SecurityError";
        throw error;
      },
    });

    try {
      expect(() => adapter.getItem("k")).toThrow();
      try {
        adapter.getItem("k");
      } catch (error) {
        expect(isStorageAppError(error)).toBe(true);
        if (isStorageAppError(error)) {
          expect(error.metadata?.failure).toBe("unavailable");
        }
      }
    } finally {
      if (original) {
        Object.defineProperty(window, "localStorage", original);
      }
    }
  });
});
