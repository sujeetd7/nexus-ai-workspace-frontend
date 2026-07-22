import { createMobileLogger } from './createMobileLogger';

export {
  createMobileLogger,
  type CreateMobileLoggerOptions,
} from './createMobileLogger';

/**
 * Shared Mobile logger instance for application modules.
 * Prefer `createMobileLogger` when injecting sinks or config in tests.
 */
export const mobileLogger = createMobileLogger();
