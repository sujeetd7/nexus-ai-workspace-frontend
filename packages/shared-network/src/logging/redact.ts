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

export function redactSensitive(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redactSensitive);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const source = value as Record<string, unknown>;
  const result: Record<string, unknown> = {};

  for (const [key, entry] of Object.entries(source)) {
    result[key] = sensitiveKeys.has(key.toLowerCase())
      ? "[REDACTED]"
      : redactSensitive(entry);
  }

  return result;
}
