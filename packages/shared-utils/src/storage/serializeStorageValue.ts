import { storageError } from "../errors/appError";

/**
 * JSON-safe values allowed for storage serialization.
 * Callers must convert Dates and other domain types before serializing.
 */
export type JsonStorageValue =
  | null
  | boolean
  | number
  | string
  | readonly JsonStorageValue[]
  | { readonly [key: string]: JsonStorageValue };

function isPlainObject(value: object): boolean {
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function assertJsonStorageValue(
  value: unknown,
  seen: WeakSet<object>,
): asserts value is JsonStorageValue {
  if (value === null) {
    return;
  }

  const valueType = typeof value;

  if (valueType === "boolean" || valueType === "string") {
    return;
  }

  if (valueType === "number") {
    if (!Number.isFinite(value)) {
      throw storageError("Storage serialization failed.", {
        operation: "serialize",
        failure: "non_finite_number",
      });
    }
    return;
  }

  if (valueType === "undefined") {
    throw storageError("Storage serialization failed.", {
      operation: "serialize",
      failure: "undefined",
    });
  }

  if (
    valueType === "function" ||
    valueType === "symbol" ||
    valueType === "bigint"
  ) {
    throw storageError("Storage serialization failed.", {
      operation: "serialize",
      failure: "unsupported_type",
    });
  }

  if (valueType !== "object") {
    throw storageError("Storage serialization failed.", {
      operation: "serialize",
      failure: "unsupported_type",
    });
  }

  // After typeof === "object" and earlier null return, value is a non-null object.
  const objectValue = value as object;

  if (seen.has(objectValue)) {
    throw storageError("Storage serialization failed.", {
      operation: "serialize",
      failure: "circular",
    });
  }

  if (Array.isArray(objectValue)) {
    seen.add(objectValue);
    for (const item of objectValue) {
      assertJsonStorageValue(item, seen);
    }
    seen.delete(objectValue);
    return;
  }

  if (
    objectValue instanceof Date ||
    objectValue instanceof Error ||
    !isPlainObject(objectValue)
  ) {
    throw storageError("Storage serialization failed.", {
      operation: "serialize",
      failure: "unsupported_object",
    });
  }

  seen.add(objectValue);
  for (const entry of Object.values(objectValue as Record<string, unknown>)) {
    assertJsonStorageValue(entry, seen);
  }
  seen.delete(objectValue);
}

/**
 * Serializes a safe JSON value for string-only `StorageAdapter` storage.
 * Fails closed; never embeds the raw value in the thrown error.
 */
export function serializeStorageValue(value: JsonStorageValue): string {
  assertJsonStorageValue(value, new WeakSet<object>());

  try {
    return JSON.stringify(value);
  } catch {
    throw storageError("Storage serialization failed.", {
      operation: "serialize",
      failure: "stringify",
    });
  }
}
