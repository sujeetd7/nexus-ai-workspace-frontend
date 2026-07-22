import type { Logger, PublicClientConfig } from "@nexus/shared-types";
import {
  createConsoleLogger,
  createNoopLogger,
  resolveAllowedLogLevels,
  type ConsoleLike,
} from "@nexus/shared-utils";

import { env } from "../../config/env";

export interface CreateWebLoggerOptions {
  /**
   * Inject validated configuration (tests). Defaults to the Web env adapter.
   */
  readonly config?: PublicClientConfig;
  /**
   * Inject a console-compatible sink (tests). When omitted in `test` build
   * mode, returns a noop logger to keep suites quiet.
   */
  readonly sink?: ConsoleLike;
}

/**
 * Web Logger adapter. Level policy lives in `@nexus/shared-utils`.
 * Reads only the validated environment adapter — never raw Vite globals.
 */
export function createWebLogger(
  options: CreateWebLoggerOptions = {},
): Logger {
  const config = options.config ?? env;

  if (config.buildMode === "test" && options.sink === undefined) {
    return createNoopLogger();
  }

  return createConsoleLogger({
    sink: options.sink,
    allowedLevels: resolveAllowedLogLevels(config.isDevelopment),
  });
}
