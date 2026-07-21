import { describe, expect, it } from "vitest";

import { redactSensitive } from "./redact";

describe("redactSensitive", () => {
  it("redacts camelCase and snake_case sensitive keys", () => {
    expect(
      redactSensitive({
        Authorization: "Bearer secret",
        accessToken: "access",
        refresh_token: "refresh",
        apiKey: "key",
        nested: {
          password: "hunter2",
          reset_token: "reset",
          safe: "ok",
        },
      }),
    ).toEqual({
      Authorization: "[REDACTED]",
      accessToken: "[REDACTED]",
      refresh_token: "[REDACTED]",
      apiKey: "[REDACTED]",
      nested: {
        password: "[REDACTED]",
        reset_token: "[REDACTED]",
        safe: "ok",
      },
    });
  });

  it("redacts values inside arrays", () => {
    expect(
      redactSensitive([{ token: "secret" }, { name: "nexus" }]),
    ).toEqual([{ token: "[REDACTED]" }, { name: "nexus" }]);
  });
});
