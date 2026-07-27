import axios from "axios";
import { describe, expect, it } from "vitest";

import { normalizeFrontendApiError } from "./normalizeFrontendApiError";

describe("normalizeFrontendApiError", () => {
  it("maps cancelled axios errors", async () => {
    const source = axios.CancelToken.source();
    source.cancel("done");

    try {
      await axios.get("/nope", { cancelToken: source.token });
    } catch (error) {
      const normalized = normalizeFrontendApiError(error);
      expect(normalized.causeType).toBe("cancelled");
      expect(normalized.retryable).toBe(false);
    }
  });

  it("preserves gateway correlation id", () => {
    const error = {
      isAxiosError: true,
      response: {
        status: 401,
        headers: { "x-correlation-id": "corr-1" },
        data: {
          error: { code: "UNAUTHORIZED", message: "Authentication required" },
        },
      },
      message: "Request failed",
    };

    const normalized = normalizeFrontendApiError(error);
    expect(normalized.correlationId).toBe("corr-1");
    expect(normalized.authAction).toBe("reauthenticate");
  });
});
