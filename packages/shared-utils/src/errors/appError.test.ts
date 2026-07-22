import { describe, expect, it } from "vitest";

import {
  createAppError,
  getErrorMessage,
  isAppError,
  normalizeError,
  sanitizeErrorMetadata,
  serializeAppError,
  toAppError,
  validationError,
} from "./appError";
import { ERROR_CODES } from "@nexus/shared-types";

describe("error normalization", () => {
  it("passes through existing AppError and fills default code", () => {
    const existing = {
      message: "Already normalized",
      code: ERROR_CODES.VALIDATION,
      metadata: { field: "email" },
    };

    const normalized = normalizeError(existing);

    expect(isAppError(normalized)).toBe(true);
    expect(normalized).toMatchObject({
      message: "Already normalized",
      code: ERROR_CODES.VALIDATION,
      metadata: { field: "email" },
    });
  });

  it("normalizes native Error including cause", () => {
    const root = new Error("root");
    const error = new Error("boom", { cause: root });

    const normalized = toAppError(error);

    expect(normalized.message).toBe("boom");
    expect(normalized.code).toBe(ERROR_CODES.UNKNOWN);
    expect(normalized.cause).toBe(error);
    expect(normalized.name).toBe("Error");
  });

  it("normalizes string, null, undefined, and primitives safely", () => {
    expect(toAppError("fail").message).toBe("fail");
    expect(toAppError(null).metadata).toEqual({ valueType: "null" });
    expect(toAppError(undefined).metadata).toEqual({ valueType: "undefined" });
    expect(toAppError(42).metadata).toEqual({ valueType: "number" });
    expect(toAppError(true).metadata).toEqual({ valueType: "boolean" });
  });

  it("does not leak arbitrary object fields into metadata", () => {
    const normalized = toAppError({
      token: "secret-token",
      nested: { password: "x" },
      message: "ignored",
    });

    expect(normalized.message).toBe("An unexpected error occurred.");
    expect(normalized.metadata).toEqual({ valueType: "object" });
    expect(normalized.metadata).not.toHaveProperty("token");
  });

  it("supports fallback message and code", () => {
    const normalized = toAppError(null, "Fallback", ERROR_CODES.INTERNAL);

    expect(normalized.message).toBe("Fallback");
    expect(normalized.code).toBe(ERROR_CODES.INTERNAL);
  });

  it("rejects unsafe metadata in isAppError", () => {
    expect(
      isAppError({
        message: "bad",
        metadata: { nested: { a: 1 } },
      }),
    ).toBe(false);
  });
});

describe("error serialization", () => {
  it("serializes code, message, retryability, and safe metadata", () => {
    const error = createAppError({
      code: ERROR_CODES.NETWORK,
      message: "offline",
      retryable: true,
      metadata: { attempt: 2 },
      cause: new Error("hidden"),
      name: "AppError",
    });

    const serialized = serializeAppError(error);

    expect(serialized).toEqual({
      code: ERROR_CODES.NETWORK,
      message: "offline",
      retryable: true,
      metadata: { attempt: 2 },
      name: "AppError",
    });
    expect(serialized).not.toHaveProperty("cause");
    expect(serialized).not.toHaveProperty("stack");
  });

  it("drops unsafe metadata during sanitize and serialize", () => {
    expect(
      sanitizeErrorMetadata({
        ok: 1,
        nested: { x: 1 },
        list: [1],
      }),
    ).toEqual({ ok: 1 });

    const serialized = serializeAppError({
      message: "x",
      code: ERROR_CODES.UNKNOWN,
      metadata: { ok: true, bad: { secret: "nope" } as unknown as string },
    });

    // create path sanitizes; direct AppError may carry bad metadata typed loosely —
    // serializeAppError must still sanitize.
    expect(serialized.metadata).toEqual({ ok: true });
  });
});

describe("error factories and messages", () => {
  it("creates validation errors and extracts messages", () => {
    const error = validationError("Required", { field: "name" });

    expect(error.code).toBe(ERROR_CODES.VALIDATION);
    expect(getErrorMessage(error)).toBe("Required");
    expect(getErrorMessage(new Error("e"))).toBe("e");
    expect(getErrorMessage(123)).toBe("An unexpected error occurred.");
  });
});
