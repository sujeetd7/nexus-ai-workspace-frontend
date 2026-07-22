import { ERROR_CODES } from "@nexus/shared-types";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { parseWithSchema } from "./parseWithSchema";

describe("parseWithSchema", () => {
  const schema = z
    .object({
      name: z.string().min(1),
    })
    .strict();

  it("returns Ok for valid input", () => {
    const result = parseWithSchema(schema, { name: "nexus" });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value).toEqual({ name: "nexus" });
  });

  it("returns Err for invalid input", () => {
    const result = parseWithSchema(schema, { name: "" });

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }

    expect(result.error.code).toBe(ERROR_CODES.VALIDATION);
    expect(result.error.message).toBe("Validation failed.");
    expect(result.error.retryable).toBe(false);
  });

  it("defaults to VALIDATION error code", () => {
    const result = parseWithSchema(schema, {});

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }

    expect(result.error.code).toBe(ERROR_CODES.VALIDATION);
  });

  it("allows caller-specified CONFIGURATION error code", () => {
    const result = parseWithSchema(schema, {}, {
      errorCode: ERROR_CODES.CONFIGURATION,
      message: "Invalid public client configuration.",
      fallbackField: "config",
    });

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }

    expect(result.error.code).toBe(ERROR_CODES.CONFIGURATION);
    expect(result.error.message).toBe("Invalid public client configuration.");
  });

  it("preserves safe field path heads", () => {
    const result = parseWithSchema(schema, { name: 1 });

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }

    expect(String(result.error.metadata?.fields)).toContain("name");
    expect(typeof result.error.metadata?.categories).toBe("string");
    expect(result.error.metadata?.issueCount).toBeGreaterThan(0);
  });

  it("does not expose raw values, raw input, stack, or Zod issue objects", () => {
    const secret = "super-secret-token";
    const result = parseWithSchema(schema, {
      name: secret,
      extra: "leak-me",
    });

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }

    const serialized = JSON.stringify(result.error);
    expect(serialized).not.toContain(secret);
    expect(serialized).not.toContain("leak-me");
    expect(serialized).not.toContain("stack");
    expect(result.error).not.toHaveProperty("input");
    expect(result.error).not.toHaveProperty("issues");
    expect(result.error).not.toHaveProperty("cause");
    expect(result.error.metadata).not.toHaveProperty("received");
    expect(result.error.metadata).not.toHaveProperty("value");
  });

  it("does not alter schema unknown-key policy", () => {
    const result = parseWithSchema(schema, {
      name: "ok",
      unexpected: true,
    });

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }

    expect(String(result.error.metadata?.categories)).toContain("unknown_field");
  });
});
