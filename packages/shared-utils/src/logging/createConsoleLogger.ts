import type { Logger } from "@nexus/shared-types";

import {
  ALL_LOG_LEVELS,
  isLogLevelAllowed,
  type LogLevel,
} from "./logLevels";
import { sanitizeLogMetadata } from "./sanitizeLogMetadata";

export interface ConsoleLike {
  debug?(...args: unknown[]): void;
  info?(...args: unknown[]): void;
  warn?(...args: unknown[]): void;
  error?(...args: unknown[]): void;
}

export interface CreateConsoleLoggerOptions {
  /**
   * Injected console-compatible sink. Defaults to global `console` when present.
   */
  readonly sink?: ConsoleLike;
  /**
   * Allowed levels. Defaults to all levels (callers apply env policy).
   */
  readonly allowedLevels?: readonly LogLevel[];
  /**
   * Optional scope prefix rendered as `[scope] message`.
   */
  readonly scope?: string;
}

function formatMessage(scope: string | undefined, message: string): string {
  if (!scope) {
    return message;
  }
  return `[${scope}] ${message}`;
}

function resolveSink(sink: ConsoleLike | undefined): ConsoleLike | undefined {
  if (sink) {
    return sink;
  }

  try {
    if (typeof console !== "undefined") {
      return console;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function invokeSink(
  sink: ConsoleLike | undefined,
  level: LogLevel,
  message: string,
  metadata: unknown,
): void {
  if (!sink) {
    return;
  }

  const method = sink[level];
  if (typeof method !== "function") {
    return;
  }

  if (metadata === undefined) {
    method.call(sink, message);
    return;
  }

  method.call(sink, message, metadata);
}

/**
 * Creates a structured console logger that never throws.
 * Does not read environment globals — pass `allowedLevels` from app adapters.
 */
export function createConsoleLogger(
  options: CreateConsoleLoggerOptions = {},
): Logger {
  const allowedLevels = options.allowedLevels ?? ALL_LOG_LEVELS;
  const scope = options.scope?.trim() || undefined;
  const sink = resolveSink(options.sink);

  const log = (level: LogLevel, message: string, metadata?: unknown): void => {
    try {
      if (!isLogLevelAllowed(level, allowedLevels)) {
        return;
      }

      const safeMessage =
        typeof message === "string" ? message : String(message);
      const formatted = formatMessage(scope, safeMessage);
      const sanitized =
        metadata === undefined ? undefined : sanitizeLogMetadata(metadata);

      invokeSink(sink, level, formatted, sanitized);
    } catch {
      // Never throw from logging.
    }
  };

  return {
    debug(message, metadata) {
      log("debug", message, metadata);
    },
    info(message, metadata) {
      log("info", message, metadata);
    },
    warn(message, metadata) {
      log("warn", message, metadata);
    },
    error(message, metadata) {
      log("error", message, metadata);
    },
  };
}
