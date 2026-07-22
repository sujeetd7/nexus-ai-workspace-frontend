const REDACTED = "[REDACTED]";

/** Maximum object/array nesting depth (root = 0). Deeper values become `[MaxDepth]`. */
export const LOG_METADATA_MAX_DEPTH = 6;

/** Maximum own enumerable keys copied from a plain object. */
export const LOG_METADATA_MAX_KEYS = 40;

/** Maximum array elements copied. */
export const LOG_METADATA_MAX_ARRAY_LENGTH = 40;

const SENSITIVE_KEY_PATTERN =
  /^(authorization|proxy-authorization|proxyauthorization|token|access[_-]?token|accesstoken|refresh[_-]?token|refreshtoken|id[_-]?token|idtoken|password|passcode|secret|api[_-]?key|apikey|client[_-]?secret|clientsecret|cookie|set-cookie|setcookie|session|session[_-]?id|sessionid|credential|credentials|private[_-]?key|privatekey)$/i;

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[-_\s]/g, "");
}

function isSensitiveKey(key: string): boolean {
  if (SENSITIVE_KEY_PATTERN.test(key)) {
    return true;
  }

  const compact = normalizeKey(key);
  return (
    compact === "authorization" ||
    compact === "proxyauthorization" ||
    compact === "token" ||
    compact === "accesstoken" ||
    compact === "refreshtoken" ||
    compact === "idtoken" ||
    compact === "password" ||
    compact === "passcode" ||
    compact === "secret" ||
    compact === "apikey" ||
    compact === "clientsecret" ||
    compact === "cookie" ||
    compact === "setcookie" ||
    compact === "session" ||
    compact === "sessionid" ||
    compact === "credential" ||
    compact === "credentials" ||
    compact === "privatekey"
  );
}

function isPlainObject(value: object): boolean {
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function sanitizeError(error: Error): Record<string, unknown> {
  return {
    name: typeof error.name === "string" ? error.name : "Error",
    message: typeof error.message === "string" ? error.message : "[Error]",
  };
}

/**
 * Recursively sanitizes log metadata for safe console / memory sinks.
 * Never throws. Does not traverse arbitrary class / host objects deeply.
 */
export function sanitizeLogMetadata(value: unknown): unknown {
  try {
    return sanitizeValue(value, 0, new WeakSet<object>());
  } catch {
    return "[Unsupported]";
  }
}

function sanitizeValue(
  value: unknown,
  depth: number,
  seen: WeakSet<object>,
): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  const valueType = typeof value;

  if (valueType === "string" || valueType === "boolean") {
    return value;
  }

  if (valueType === "number") {
    if (Number.isFinite(value)) {
      return value;
    }
    if (Number.isNaN(value)) {
      return "[NaN]";
    }
    return "[Infinity]";
  }

  if (valueType === "bigint") {
    return "[BigInt]";
  }

  if (valueType === "symbol") {
    return "[Symbol]";
  }

  if (valueType === "function") {
    return "[Function]";
  }

  if (valueType !== "object") {
    return "[Unsupported]";
  }

  if (depth > LOG_METADATA_MAX_DEPTH) {
    return "[MaxDepth]";
  }

  const objectValue = value as object;

  if (seen.has(objectValue)) {
    return "[Circular]";
  }

  if (value instanceof Error) {
    return sanitizeError(value);
  }

  if (value instanceof Date) {
    try {
      return Number.isNaN(value.getTime()) ? "[InvalidDate]" : value.toISOString();
    } catch {
      return "[Date]";
    }
  }

  if (typeof URL !== "undefined" && value instanceof URL) {
    try {
      return value.toString();
    } catch {
      return "[URL]";
    }
  }

  if (Array.isArray(value)) {
    seen.add(objectValue);
    const length = Math.min(value.length, LOG_METADATA_MAX_ARRAY_LENGTH);
    const result: unknown[] = [];
    for (let index = 0; index < length; index += 1) {
      result.push(sanitizeValue(value[index], depth + 1, seen));
    }
    if (value.length > LOG_METADATA_MAX_ARRAY_LENGTH) {
      result.push("[Truncated]");
    }
    return result;
  }

  if (!isPlainObject(objectValue)) {
    return "[Unsupported]";
  }

  seen.add(objectValue);

  const result: Record<string, unknown> = {};
  let keys: string[];
  try {
    keys = Object.keys(objectValue);
  } catch {
    return "[Unsupported]";
  }

  const limit = Math.min(keys.length, LOG_METADATA_MAX_KEYS);

  for (let index = 0; index < limit; index += 1) {
    const key = keys[index]!;

    if (isSensitiveKey(key)) {
      result[key] = REDACTED;
      continue;
    }

    try {
      const entry = (objectValue as Record<string, unknown>)[key];
      result[key] = sanitizeValue(entry, depth + 1, seen);
    } catch {
      result[key] = "[GetterError]";
    }
  }

  if (keys.length > LOG_METADATA_MAX_KEYS) {
    result["[Truncated]"] = true;
  }

  return result;
}
