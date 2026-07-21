import { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { attachAuthorizationHeader } from "./authHeaders";
import { getAccessToken } from "./authStorage";

vi.mock("./authStorage", () => ({
  getAccessToken: vi.fn(),
}));

function createConfig(): InternalAxiosRequestConfig {
  return {
    headers: new AxiosHeaders(),
  } as InternalAxiosRequestConfig;
}

describe("attachAuthorizationHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adds the bearer token when an access token exists", () => {
    vi.mocked(getAccessToken).mockReturnValue("access-token");

    const config = attachAuthorizationHeader(createConfig());

    expect(config.headers.get("Authorization")).toBe("Bearer access-token");
  });

  it("does not add the header when no token exists", () => {
    vi.mocked(getAccessToken).mockReturnValue(null);

    const config = attachAuthorizationHeader(createConfig());

    expect(config.headers.has("Authorization")).toBe(false);
  });
});
