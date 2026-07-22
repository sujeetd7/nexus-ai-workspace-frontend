import type { NetworkLogger } from "@nexus/shared-network";
import type { Logger } from "@nexus/shared-types";

/**
 * Application-local adapter from shared `Logger` to transport `NetworkLogger`.
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
