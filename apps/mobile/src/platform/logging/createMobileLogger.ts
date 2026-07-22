import type { Logger, PublicClientConfig } from '@nexus/shared-types';
import {
  createConsoleLogger,
  createNoopLogger,
  resolveAllowedLogLevels,
  type ConsoleLike,
} from '@nexus/shared-utils';

import { env } from '../../config/env';

export interface CreateMobileLoggerOptions {
  /**
   * Inject validated configuration (tests). Defaults to the mobile env adapter.
   */
  readonly config?: PublicClientConfig;
  /**
   * Inject a console-compatible sink (tests). When omitted in `test` build
   * mode, returns a noop logger to keep suites quiet.
   */
  readonly sink?: ConsoleLike;
}

/**
 * Mobile Logger adapter. Reuses shared level policy and console logger.
 * No native logging libraries, remote sinks, or global console patches.
 */
export function createMobileLogger(
  options: CreateMobileLoggerOptions = {},
): Logger {
  const config = options.config ?? env;

  if (config.buildMode === 'test' && options.sink === undefined) {
    return createNoopLogger();
  }

  return createConsoleLogger({
    sink: options.sink,
    allowedLevels: resolveAllowedLogLevels(config.isDevelopment),
  });
}
