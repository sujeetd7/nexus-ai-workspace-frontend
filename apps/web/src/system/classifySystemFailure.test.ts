import { describe, expect, it } from "vitest";

import {
  classifySystemFailure,
  profileFailureCopy,
  workspaceFailureCopy,
} from "./classifySystemFailure";

describe("classifySystemFailure", () => {
  it("classifies authenticated 401 as session expired", () => {
    const result = classifySystemFailure({
      status: 401,
      authAction: "reauthenticate",
      context: "authenticated",
    });
    expect(result.kind).toBe("sessionExpired");
    expect(result.primaryAction).toBe("signIn");
    expect(result.requiresReauth).toBe(true);
    expect(result.blocksShell).toBe(true);
  });

  it("classifies anonymous 401 as unauthorized", () => {
    const result = classifySystemFailure({
      status: 401,
      context: "anonymous",
    });
    expect(result.kind).toBe("unauthorized");
    expect(result.title).toBe("Sign-in required");
    expect(result.primaryAction).toBe("signIn");
  });

  it("classifies 403 as forbidden without reauth", () => {
    const result = classifySystemFailure({
      status: 403,
      authorizationAction: "showForbidden",
      context: "authenticated",
    });
    expect(result.kind).toBe("forbidden");
    expect(result.requiresReauth).toBe(false);
    expect(result.primaryAction).toBe("none");
    expect(result.secondaryAction).toBe("signOut");
  });

  it("classifies network/service unavailable as retryable", () => {
    const network = classifySystemFailure({
      causeType: "network",
      code: "NETWORK_ERROR",
      retryable: true,
    });
    expect(network.kind).toBe("networkUnavailable");
    expect(network.primaryAction).toBe("retry");

    const unavailable = classifySystemFailure({
      status: 503,
      code: "HTTP_503",
      retryable: true,
    });
    expect(unavailable.kind).toBe("networkUnavailable");
    expect(unavailable.primaryAction).toBe("retry");
  });

  it("classifies retryable API failures", () => {
    const result = classifySystemFailure({
      status: 500,
      retryable: true,
      message: "boom",
    });
    expect(result.kind).toBe("retryableApi");
    expect(result.primaryAction).toBe("retry");
  });

  it("falls back to message heuristics only when status is absent", () => {
    const result = classifySystemFailure({
      message: "Your session has expired. Sign in again to continue.",
    });
    expect(result.kind).toBe("sessionExpired");
  });

  it("maps workspace copy for forbidden and session expired", () => {
    expect(workspaceFailureCopy("forbidden").title).toBe("Permission denied");
    expect(workspaceFailureCopy("sessionExpired").title).toBe("Session expired");
  });

  it("maps profile copy for unauthorized and retryable failures", () => {
    expect(profileFailureCopy("unauthorized").message).toContain("profile");
    expect(profileFailureCopy("retryableApi").title).toBe(
      "Unable to load profile",
    );
  });
});
