import { ERROR_CODES, type AppError } from "@nexus/shared-types";
import { describe, expect, it, vi } from "vitest";

import { createAppError } from "../errors/appError";
import { createConsoleLogger, type ConsoleLike } from "./createConsoleLogger";
import { createMemoryLogger } from "./createMemoryLogger";
import { createNoopLogger } from "./createNoopLogger";
import { createScopedLogger } from "./createScopedLogger";
import { logAppError } from "./logAppError";
import {
  ALL_LOG_LEVELS,
  PRODUCTION_LOG_LEVELS,
  resolveAllowedLogLevels,
} from "./logLevels";
import {
  LOG_METADATA_MAX_DEPTH,
  sanitizeLogMetadata,
} from "./sanitizeLogMetadata";

function createSink(): ConsoleLike & {
  debug: ReturnType<typeof vi.fn>;
  info: ReturnType<typeof vi.fn>;
  warn: ReturnType<typeof vi.fn>;
  error: ReturnType<typeof vi.fn>;
} {
  return {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };
}

describe("resolveAllowedLogLevels", () => {
  it("allows all levels in development", () => {
    expect(resolveAllowedLogLevels(true)).toEqual(ALL_LOG_LEVELS);
  });

  it("allows only warn and error outside development", () => {
    expect(resolveAllowedLogLevels(false)).toEqual(PRODUCTION_LOG_LEVELS);
  });
});

describe("createConsoleLogger", () => {
  it("routes each level to the matching console method", () => {
    const sink = createSink();
    const logger = createConsoleLogger({ sink });

    logger.debug("d", { a: 1 });
    logger.info("i");
    logger.warn("w");
    logger.error("e", { b: 2 });

    expect(sink.debug).toHaveBeenCalledWith("d", { a: 1 });
    expect(sink.info).toHaveBeenCalledWith("i");
    expect(sink.warn).toHaveBeenCalledWith("w");
    expect(sink.error).toHaveBeenCalledWith("e", { b: 2 });
  });

  it("applies development and production level policies", () => {
    const sink = createSink();
    const development = createConsoleLogger({
      sink,
      allowedLevels: resolveAllowedLogLevels(true),
    });
    const production = createConsoleLogger({
      sink,
      allowedLevels: resolveAllowedLogLevels(false),
    });

    development.debug("dev-debug");
    production.debug("prod-debug");
    production.info("prod-info");
    production.warn("prod-warn");

    expect(sink.debug).toHaveBeenCalledWith("dev-debug");
    expect(sink.debug).not.toHaveBeenCalledWith("prod-debug");
    expect(sink.info).not.toHaveBeenCalledWith("prod-info");
    expect(sink.warn).toHaveBeenCalledWith("prod-warn");
  });

  it("prefixes optional scope and sanitizes metadata", () => {
    const sink = createSink();
    const logger = createConsoleLogger({ sink, scope: "auth" });

    logger.info("login", { password: "secret", ok: true });

    expect(sink.info).toHaveBeenCalledWith("[auth] login", {
      password: "[REDACTED]",
      ok: true,
    });
  });

  it("never throws when the sink throws", () => {
    const sink: ConsoleLike = {
      error() {
        throw new Error("sink failure");
      },
    };
    const logger = createConsoleLogger({ sink });

    expect(() => logger.error("boom", { token: "x" })).not.toThrow();
  });
});

describe("createNoopLogger", () => {
  it("implements Logger with no console access and never throws", () => {
    const logger = createNoopLogger();
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});

    expect(() => {
      logger.debug("a");
      logger.info("b");
      logger.warn("c");
      logger.error("d", { password: "x" });
    }).not.toThrow();

    expect(debugSpy).not.toHaveBeenCalled();
    debugSpy.mockRestore();
  });
});

describe("createMemoryLogger", () => {
  it("captures sanitized entries and supports reset", () => {
    const logger = createMemoryLogger({ scope: "test" });
    logger.info("hello", { apiKey: "secret", n: 1 });

    const snapshot = logger.getEntries();
    expect(snapshot).toHaveLength(1);
    expect(snapshot[0]).toEqual({
      level: "info",
      message: "[test] hello",
      scope: "test",
      metadata: { apiKey: "[REDACTED]", n: 1 },
    });

    expect(() => {
      (snapshot[0] as { message: string }).message = "mutated";
    }).toThrow();
    expect(logger.getEntries()[0]?.message).toBe("[test] hello");

    logger.reset();
    expect(logger.getEntries()).toEqual([]);
  });

  it("evicts oldest entries when bounded", () => {
    const logger = createMemoryLogger({ maxEntries: 2 });
    logger.debug("1");
    logger.debug("2");
    logger.debug("3");

    expect(logger.getEntries().map((entry) => entry.message)).toEqual([
      "2",
      "3",
    ]);
  });
});

describe("createScopedLogger", () => {
  it("prefixes messages and composes nested scopes", () => {
    const memory = createMemoryLogger();
    const auth = createScopedLogger(memory, "auth");
    const session = createScopedLogger(auth, "session");

    session.warn("refresh");

    expect(memory.getEntries()[0]?.message).toBe("[auth/session] refresh");
  });

  it("handles empty scope without throwing", () => {
    const memory = createMemoryLogger();
    const scoped = createScopedLogger(memory, "   ");
    scoped.info("plain");
    expect(memory.getEntries()[0]?.message).toBe("plain");
  });

  it("normalizes repeated separators", () => {
    const memory = createMemoryLogger();
    createScopedLogger(memory, "auth//session").info("x");
    expect(memory.getEntries()[0]?.message).toBe("[auth/session] x");
  });
});

describe("sanitizeLogMetadata", () => {
  it("redacts sensitive keys case-insensitively across nesting and arrays", () => {
    expect(
      sanitizeLogMetadata({
        Authorization: "Bearer x",
        nested: { RefreshToken: "r", safe: "ok" },
        list: [{ password: "p" }, { name: "n" }],
      }),
    ).toEqual({
      Authorization: "[REDACTED]",
      nested: { RefreshToken: "[REDACTED]", safe: "ok" },
      list: [{ password: "[REDACTED]" }, { name: "n" }],
    });
  });

  it("handles circular references, functions, symbols, bigint, and errors", () => {
    const circular: Record<string, unknown> = { a: 1 };
    circular.self = circular;

    const sanitized = sanitizeLogMetadata({
      circular,
      fn: () => undefined,
      sym: Symbol("s"),
      big: BigInt(1),
      err: Object.assign(new Error("boom"), {
        stack: "STACK",
        cause: { token: "secret" },
      }),
      nan: Number.NaN,
      inf: Number.POSITIVE_INFINITY,
    }) as Record<string, unknown>;

    expect(sanitized.circular).toEqual({ a: 1, self: "[Circular]" });
    expect(sanitized.fn).toBe("[Function]");
    expect(sanitized.sym).toBe("[Symbol]");
    expect(sanitized.big).toBe("[BigInt]");
    expect(sanitized.err).toEqual({ name: "Error", message: "boom" });
    expect(JSON.stringify(sanitized)).not.toContain("STACK");
    expect(JSON.stringify(sanitized)).not.toContain("secret");
    expect(sanitized.nan).toBe("[NaN]");
    expect(sanitized.inf).toBe("[Infinity]");
  });

  it("handles throwing getters and respects max depth", () => {
    const withGetter = {};
    Object.defineProperty(withGetter, "bad", {
      enumerable: true,
      get() {
        throw new Error("nope");
      },
    });

    expect(sanitizeLogMetadata(withGetter)).toEqual({ bad: "[GetterError]" });

    let nested: unknown = "leaf";
    for (let i = 0; i <= LOG_METADATA_MAX_DEPTH + 2; i += 1) {
      nested = { nested };
    }
    const deep = sanitizeLogMetadata(nested) as Record<string, unknown>;
    let cursor: unknown = deep;
    let sawMaxDepth = false;
    for (let i = 0; i < LOG_METADATA_MAX_DEPTH + 3; i += 1) {
      if (cursor === "[MaxDepth]") {
        sawMaxDepth = true;
        break;
      }
      if (!cursor || typeof cursor !== "object") {
        break;
      }
      cursor = (cursor as { nested: unknown }).nested;
    }
    expect(sawMaxDepth).toBe(true);
  });

  it("never throws for unsupported host-like objects", () => {
    expect(() => sanitizeLogMetadata(new Map([["a", 1]]))).not.toThrow();
    expect(sanitizeLogMetadata(new Map())).toBe("[Unsupported]");
  });
});

describe("logAppError", () => {
  it("logs serialized AppError without cause or stack", () => {
    const memory = createMemoryLogger();
    const error: AppError = createAppError({
      code: ERROR_CODES.INTERNAL,
      message: "failed",
      retryable: false,
      cause: new Error("root"),
      metadata: { field: "email" },
    });

    logAppError(memory, error, "UI failure");

    const entry = memory.getEntries()[0];
    expect(entry?.level).toBe("error");
    expect(entry?.message).toBe("UI failure");
    expect(entry?.metadata).toEqual({
      code: ERROR_CODES.INTERNAL,
      message: "failed",
      retryable: false,
      metadata: { field: "email" },
    });
    expect(JSON.stringify(entry)).not.toContain("root");
    expect(JSON.stringify(entry)).not.toContain("stack");
  });

  it("normalizes unknown values before logging", () => {
    const memory = createMemoryLogger();
    logAppError(memory, "boom");
    expect(memory.getEntries()[0]?.metadata).toMatchObject({
      message: "boom",
    });
  });
});
