import type { MaybePromise } from "../async";

/**
 * Platform-agnostic key/value storage contract.
 * Concrete adapters (localStorage, secure mobile storage) live in apps.
 */
export interface StorageAdapter {
  getItem(key: string): MaybePromise<string | null>;
  setItem(key: string, value: string): MaybePromise<void>;
  removeItem(key: string): MaybePromise<void>;
  clear?(): MaybePromise<void>;
}
