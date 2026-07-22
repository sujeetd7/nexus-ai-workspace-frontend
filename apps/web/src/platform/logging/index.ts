import { createWebLogger } from "./createWebLogger";

export { createWebLogger, type CreateWebLoggerOptions } from "./createWebLogger";
export {
  createGraphQLNetworkLoggerAdapter,
  createNetworkLoggerAdapter,
  stripGraphQLLogMetadata,
} from "./createNetworkLoggerAdapter";

/**
 * Shared Web logger instance for application modules.
 * Prefer `createWebLogger` when injecting sinks or config in tests.
 */
export const webLogger = createWebLogger();
