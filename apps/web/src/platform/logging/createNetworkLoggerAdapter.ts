import type { NetworkLogger } from "@nexus/shared-network";
import type { Logger } from "@nexus/shared-types";

/**
 * Application-local adapter from shared `Logger` to transport `NetworkLogger`.
 * Does not duplicate redaction — shared-network applies `redactSensitive`.
 * Never throws.
 */
export function createNetworkLoggerAdapter(logger: Logger): NetworkLogger {
  const invoke = (
    method: keyof Logger,
    message: string,
    metadata?: unknown,
  ): void => {
    try {
      logger[method](message, metadata);
    } catch {
      // Never throw into the network stack.
    }
  };

  return {
    debug(message, metadata) {
      invoke("debug", message, metadata);
    },
    info(message, metadata) {
      invoke("info", message, metadata);
    },
    warn(message, metadata) {
      invoke("warn", message, metadata);
    },
    error(message, metadata) {
      invoke("error", message, metadata);
    },
  };
}

/**
 * Strips GraphQL query text and variables from network log metadata.
 * Keeps safe fields such as operationName when present.
 */
export function stripGraphQLLogMetadata(metadata: unknown): unknown {
  try {
    if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
      return metadata;
    }

    const record = metadata as Record<string, unknown>;
    const data = record.data;

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return metadata;
    }

    const payload = data as Record<string, unknown>;
    const hasGraphQLShape =
      "query" in payload || "variables" in payload || "operationName" in payload;

    if (!hasGraphQLShape) {
      return metadata;
    }

    const safeData: Record<string, unknown> = {};
    if (typeof payload.operationName === "string") {
      safeData.operationName = payload.operationName;
    }
    if (typeof payload.operation === "string") {
      safeData.operation = payload.operation;
    }
    if (typeof payload.operationType === "string") {
      safeData.operationType = payload.operationType;
    }

    return {
      ...record,
      data: safeData,
    };
  } catch {
    return undefined;
  }
}

/**
 * NetworkLogger for GraphQL clients — filters query/variables from logged data.
 */
export function createGraphQLNetworkLoggerAdapter(
  logger: Logger,
): NetworkLogger {
  const base = createNetworkLoggerAdapter(logger);

  const wrap =
    (method: keyof NetworkLogger) =>
    (message: string, metadata?: unknown): void => {
      try {
        const fn = base[method];
        if (typeof fn !== "function") {
          return;
        }
        fn(message, stripGraphQLLogMetadata(metadata));
      } catch {
        // Never throw.
      }
    };

  return {
    debug: wrap("debug"),
    info: wrap("info"),
    warn: wrap("warn"),
    error: wrap("error"),
  };
}
