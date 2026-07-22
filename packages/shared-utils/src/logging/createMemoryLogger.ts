import type { Logger } from "@nexus/shared-types";

import type { LogLevel } from "./logLevels";
import { sanitizeLogMetadata } from "./sanitizeLogMetadata";

/** Default bounded capture size for test memory loggers. */
export const DEFAULT_MEMORY_LOGGER_MAX_ENTRIES = 200;

export interface MemoryLogEntry {
  readonly level: LogLevel;
  readonly message: string;
  readonly metadata?: unknown;
  readonly scope?: string;
}

export interface MemoryLogger extends Logger {
  /** Clears captured entries. */
  reset(): void;
  /** Returns a shallow-copied snapshot; does not expose the internal buffer. */
  getEntries(): ReadonlyArray<MemoryLogEntry>;
}

export interface CreateMemoryLoggerOptions {
  /**
   * Maximum retained entries. Oldest entries are evicted when exceeded.
   * @default 200
   */
  readonly maxEntries?: number;
  /** Optional scope recorded on each entry and prefixed on the message. */
  readonly scope?: string;
}

/**
 * Test-only in-memory Logger. Non-persistent. Sanitizes metadata. Never throws.
 */
export function createMemoryLogger(
  options: CreateMemoryLoggerOptions = {},
): MemoryLogger {
  const maxEntries =
    typeof options.maxEntries === "number" &&
    Number.isFinite(options.maxEntries) &&
    options.maxEntries > 0
      ? Math.floor(options.maxEntries)
      : DEFAULT_MEMORY_LOGGER_MAX_ENTRIES;

  const scope = options.scope?.trim() || undefined;
  const entries: MemoryLogEntry[] = [];

  const capture = (
    level: LogLevel,
    message: string,
    metadata?: unknown,
  ): void => {
    try {
      const safeMessage =
        typeof message === "string" ? message : String(message);
      const formatted = scope ? `[${scope}] ${safeMessage}` : safeMessage;
      const sanitized =
        metadata === undefined ? undefined : sanitizeLogMetadata(metadata);

      const entry: MemoryLogEntry = {
        level,
        message: formatted,
        ...(sanitized !== undefined ? { metadata: sanitized } : {}),
        ...(scope !== undefined ? { scope } : {}),
      };

      entries.push(entry);

      while (entries.length > maxEntries) {
        entries.shift();
      }
    } catch {
      // Never throw from logging.
    }
  };

  return {
    debug(message, metadata) {
      capture("debug", message, metadata);
    },
    info(message, metadata) {
      capture("info", message, metadata);
    },
    warn(message, metadata) {
      capture("warn", message, metadata);
    },
    error(message, metadata) {
      capture("error", message, metadata);
    },
    reset() {
      try {
        entries.length = 0;
      } catch {
        // Never throw.
      }
    },
    getEntries() {
      try {
        return entries.map((entry) =>
          Object.freeze({
            level: entry.level,
            message: entry.message,
            ...(entry.metadata !== undefined
              ? { metadata: entry.metadata }
              : {}),
            ...(entry.scope !== undefined ? { scope: entry.scope } : {}),
          }),
        );
      } catch {
        return [];
      }
    },
  };
}
