const sensitiveKeys = new Set([
  "authorization",
  "cookie",
  "set-cookie",
  "access_token",
  "accesstoken",
  "refresh_token",
  "refreshtoken",
  "id_token",
  "idtoken",
  "api_key",
  "apikey",
  "client_secret",
  "clientsecret",
  "password",
  "token",
  "reset_token",
  "resettoken",
  "secret",
]);

/**
 * Redacts known sensitive keys from network log payloads.
 * Case-insensitive key match. Circular-safe. Network-owned — do not move.
 */
export function redactSensitive(
  value: unknown,
  seen: WeakSet<object> = new WeakSet<object>(),
): unknown {
  if (Array.isArray(value)) {
    if (seen.has(value)) {
      return "[Circular]";
    }
    seen.add(value);
    return value.map((entry) => redactSensitive(entry, seen));
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  if (seen.has(value)) {
    return "[Circular]";
  }
  seen.add(value);

  const source = value as Record<string, unknown>;
  const result: Record<string, unknown> = {};

  for (const [key, entry] of Object.entries(source)) {
    result[key] = sensitiveKeys.has(key.toLowerCase())
      ? "[REDACTED]"
      : redactSensitive(entry, seen);
  }

  return result;
}
