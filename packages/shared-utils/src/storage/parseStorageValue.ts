import { storageError } from "../errors/appError";

/**
 * Parses a JSON string previously produced for storage.
 * Missing keys remain the adapter caller's responsibility (`getItem` → `null`).
 * Does not apply schema validation — use `@nexus/shared-validation` when needed.
 */
export function parseStorageValue<T = unknown>(raw: string): T {
  if (typeof raw !== "string") {
    throw storageError("Storage parsing failed.", {
      operation: "parse",
      failure: "invalid_input",
    });
  }

  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    throw storageError("Storage parsing failed.", {
      operation: "parse",
      failure: "empty",
    });
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw storageError("Storage parsing failed.", {
      operation: "parse",
      failure: "malformed",
    });
  }
}
