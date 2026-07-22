import { ERROR_CODES, type AppError, type StorageAdapter } from "@nexus/shared-types";

export interface CreateLocalStorageAdapterOptions {
  /**
   * Inject a Storage-compatible object for tests.
   * Defaults to browser `localStorage` when available.
   */
  readonly storage?: Storage;
}

function createStorageAppError(
  message: string,
  metadata: {
    readonly operation: string;
    readonly adapter: string;
    readonly failure: string;
  },
): AppError {
  return {
    code: ERROR_CODES.STORAGE,
    message,
    retryable: false,
    metadata,
  };
}

function isStorageAppError(value: unknown): value is AppError {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    (value as { code?: unknown }).code === ERROR_CODES.STORAGE &&
    "message" in value &&
    typeof (value as { message?: unknown }).message === "string"
  );
}

function resolveBrowserLocalStorage(): Storage {
  try {
    if (typeof globalThis === "undefined") {
      throw createStorageAppError("Browser storage is unavailable.", {
        operation: "read",
        adapter: "browser",
        failure: "unavailable",
      });
    }

    const storage = (globalThis as { localStorage?: Storage }).localStorage;

    if (!storage) {
      throw createStorageAppError("Browser storage is unavailable.", {
        operation: "read",
        adapter: "browser",
        failure: "unavailable",
      });
    }

    // Probe access — getters may throw SecurityError.
    void storage.length;

    return storage;
  } catch (error) {
    if (isStorageAppError(error)) {
      throw error;
    }

    throw createStorageAppError("Browser storage is unavailable.", {
      operation: "read",
      adapter: "browser",
      failure: "unavailable",
    });
  }
}

function mapBrowserFailure(
  operation: "read" | "write" | "remove" | "clear",
  error: unknown,
): never {
  const name =
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    typeof (error as { name?: unknown }).name === "string"
      ? (error as { name: string }).name
      : "";

  if (name === "QuotaExceededError" || name === "NS_ERROR_DOM_QUOTA_REACHED") {
    throw createStorageAppError("Browser storage quota exceeded.", {
      operation,
      adapter: "browser",
      failure: "quota",
    });
  }

  if (name === "SecurityError") {
    throw createStorageAppError("Browser storage access denied.", {
      operation,
      adapter: "browser",
      failure: "access",
    });
  }

  throw createStorageAppError("Browser storage operation failed.", {
    operation,
    adapter: "browser",
    failure: "unknown",
  });
}

/**
 * Application-local `StorageAdapter` over browser `localStorage`.
 * Not secure storage. Auth token persistence remains feature-owned.
 */
export function createLocalStorageAdapter(
  options: CreateLocalStorageAdapterOptions = {},
): StorageAdapter {
  const getStorage = (): Storage =>
    options.storage ?? resolveBrowserLocalStorage();

  return {
    getItem(key: string): string | null {
      try {
        return getStorage().getItem(key);
      } catch (error) {
        if (isStorageAppError(error)) {
          throw error;
        }
        mapBrowserFailure("read", error);
      }
    },
    setItem(key: string, value: string): void {
      try {
        getStorage().setItem(key, value);
      } catch (error) {
        if (isStorageAppError(error)) {
          throw error;
        }
        mapBrowserFailure("write", error);
      }
    },
    removeItem(key: string): void {
      try {
        getStorage().removeItem(key);
      } catch (error) {
        if (isStorageAppError(error)) {
          throw error;
        }
        mapBrowserFailure("remove", error);
      }
    },
    clear(): void {
      try {
        getStorage().clear();
      } catch (error) {
        if (isStorageAppError(error)) {
          throw error;
        }
        mapBrowserFailure("clear", error);
      }
    },
  };
}
