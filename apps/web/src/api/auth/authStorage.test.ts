/**
 * @vitest-environment jsdom
 */

import { beforeEach, describe, expect, it } from "vitest";

import { STORAGE_KEYS } from "../../config/constants";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  setTokens,
} from "./authStorage";

describe("authStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("stores and reads the access token", () => {
    setAccessToken("access-token");

    expect(getAccessToken()).toBe("access-token");
    expect(window.localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)).toBe(
      "access-token",
    );
  });

  it("stores and reads the refresh token", () => {
    setRefreshToken("refresh-token");

    expect(getRefreshToken()).toBe("refresh-token");
  });

  it("stores both tokens", () => {
    setTokens("access-token", "refresh-token");

    expect(getAccessToken()).toBe("access-token");
    expect(getRefreshToken()).toBe("refresh-token");
  });

  it("does not remove an existing refresh token when omitted", () => {
    setRefreshToken("existing-refresh-token");

    setTokens("new-access-token");

    expect(getAccessToken()).toBe("new-access-token");
    expect(getRefreshToken()).toBe("existing-refresh-token");
  });

  it("clears both tokens", () => {
    setTokens("access-token", "refresh-token");

    clearTokens();

    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });
});
