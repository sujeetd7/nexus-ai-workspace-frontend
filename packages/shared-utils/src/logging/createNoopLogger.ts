import type { Logger } from "@nexus/shared-types";

const noop = (): void => {};

const NOOP_LOGGER: Logger = {
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
};

/**
 * Immutable no-op Logger. Never throws. No console access.
 */
export function createNoopLogger(): Logger {
  return NOOP_LOGGER;
}
