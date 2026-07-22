import type { StorageAdapter } from "@nexus/shared-types";

/**
 * In-memory `StorageAdapter` for tests and non-durable development injection.
 * Not durable. Do not use as production mobile or browser persistence.
 */
export function createMemoryStorageAdapter(): StorageAdapter {
  const store = new Map<string, string>();

  return {
    getItem(key: string): string | null {
      return store.has(key) ? (store.get(key) as string) : null;
    },
    setItem(key: string, value: string): void {
      store.set(key, value);
    },
    removeItem(key: string): void {
      store.delete(key);
    },
    clear(): void {
      store.clear();
    },
  };
}
