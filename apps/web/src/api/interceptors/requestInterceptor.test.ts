import { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { describe, expect, it } from "vitest";

import { requestInterceptor } from "./requestInterceptor";

function createConfig(): InternalAxiosRequestConfig {
  return {
    headers: new AxiosHeaders(),
  } as InternalAxiosRequestConfig;
}

describe("requestInterceptor", () => {
  it("adds a request ID when one is missing", () => {
    const config = requestInterceptor(createConfig());

    expect(config.headers.get("X-Request-Id")).toEqual(expect.any(String));
  });

  it("preserves an existing request ID", () => {
    const config = createConfig();

    config.headers.set("X-Request-Id", "existing-request-id");

    const result = requestInterceptor(config);

    expect(result.headers.get("X-Request-Id")).toBe("existing-request-id");
  });
});
