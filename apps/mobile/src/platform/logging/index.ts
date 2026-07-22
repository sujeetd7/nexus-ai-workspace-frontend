import { createMobileLogger } from './createMobileLogger';

export {
  createMobileLogger,
  type CreateMobileLoggerOptions,
} from './createMobileLogger';
export { createNetworkLoggerAdapter } from './createNetworkLoggerAdapter';

/**
 * Shared Mobile logger instance for application modules.
 * Prefer `createMobileLogger` when injecting sinks or config in tests.
 */
export const mobileLogger = createMobileLogger();
