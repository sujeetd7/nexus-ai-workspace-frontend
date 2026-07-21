import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it } from "vitest";

import {
  defaultRetryPolicy,
  defaultShouldRetry,
  isRetryAllowed,
  retryDelay,
} from "./retryPolicy";

describe("retryPolicy", () => {
  it("allows only idempotent methods by default", () => {
    expect(isRetryAllowed({ method: "get" }, defaultRetryPolicy)).toBe(true);
    expect(isRetryAllowed({ method: "HEAD" }, defaultRetryPolicy)).toBe(true);
    expect(isRetryAllowed({ method: "post" }, defaultRetryPolicy)).toBe(false);
    expect(isRetryAllowed({ method: "DELETE" }, defaultRetryPolicy)).toBe(
      false,
    );
  });

  it("applies exponential backoff with deterministic jitter", () => {
    expect(retryDelay(0, 250, 0.2, () => 0)).toBe(250);
    expect(retryDelay(1, 250, 0.2, () => 0)).toBe(500);
    expect(retryDelay(0, 250, 0.2, () => 1)).toBe(300);
  });

  it("does not retry 401/403 by default", () => {
    const unauthorized = new AxiosError(
      "Unauthorized",
      "ERR_BAD_REQUEST",
      undefined,
      undefined,
      {
        status: 401,
        statusText: "Unauthorized",
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() },
        data: {},
      },
    );

    expect(defaultShouldRetry(unauthorized)).toBe(false);
    expect(
      defaultShouldRetry(
        new AxiosError(
          "Network Error",
          "ERR_NETWORK",
          undefined,
          undefined,
          undefined,
        ),
      ),
    ).toBe(true);
  });
});
