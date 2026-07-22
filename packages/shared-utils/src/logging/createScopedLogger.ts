import type { Logger } from "@nexus/shared-types";

const scopeByLogger = new WeakMap<Logger, string>();
const rootByLogger = new WeakMap<Logger, Logger>();

/**
 * Normalizes a scope segment: trim, collapse separators, drop empties.
 * Returns undefined for empty / whitespace-only input (never throws).
 */
export function normalizeLogScope(scope: string): string | undefined {
  try {
    if (typeof scope !== "string") {
      return undefined;
    }

    const normalized = scope
      .trim()
      .replace(/\\/g, "/")
      .split("/")
      .map((part) => part.trim())
      .filter((part) => part.length > 0)
      .join("/");

    return normalized.length > 0 ? normalized : undefined;
  } catch {
    return undefined;
  }
}

function joinScopes(
  parent: string | undefined,
  child: string | undefined,
): string | undefined {
  if (!parent) {
    return child;
  }
  if (!child) {
    return parent;
  }
  return `${parent}/${child}`;
}

/**
 * Creates a scoped logger that prefixes messages with `[scope]`.
 * Nested scopes compose with `/` (e.g. `auth/session`).
 * Never throws.
 */
export function createScopedLogger(logger: Logger, scope: string): Logger {
  try {
    const normalized = normalizeLogScope(scope);
    if (!normalized) {
      return logger;
    }

    const parentScope = scopeByLogger.get(logger);
    const fullScope = joinScopes(parentScope, normalized) ?? normalized;
    const root = rootByLogger.get(logger) ?? logger;

    const scoped: Logger = {
      debug(message, metadata) {
        try {
          root.debug(`[${fullScope}] ${message}`, metadata);
        } catch {
          // Never throw.
        }
      },
      info(message, metadata) {
        try {
          root.info(`[${fullScope}] ${message}`, metadata);
        } catch {
          // Never throw.
        }
      },
      warn(message, metadata) {
        try {
          root.warn(`[${fullScope}] ${message}`, metadata);
        } catch {
          // Never throw.
        }
      },
      error(message, metadata) {
        try {
          root.error(`[${fullScope}] ${message}`, metadata);
        } catch {
          // Never throw.
        }
      },
    };

    scopeByLogger.set(scoped, fullScope);
    rootByLogger.set(scoped, root);
    return scoped;
  } catch {
    return logger;
  }
}
