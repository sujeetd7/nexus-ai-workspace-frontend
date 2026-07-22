/**
 * @vitest-environment node
 */

import { afterEach, describe, expect, it, vi } from "vitest";

describe("logger environment access", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("consumes validated configuration isDevelopment", async () => {
    vi.doMock("../../config/env", () => ({
      env: {
        buildMode: "development",
        apiBaseUrl: "http://localhost:3000/api",
        graphqlUrl: "http://localhost:3000/graphql",
        appName: "Nexus AI Workspace",
        isDevelopment: true,
        isProduction: false,
      },
    }));

    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    const { logger } = await import("./logger");

    logger.debug("hello");

    expect(debugSpy).toHaveBeenCalledWith("hello");
  });

  it("suppresses debug logs when not development", async () => {
    vi.doMock("../../config/env", () => ({
      env: {
        buildMode: "production",
        apiBaseUrl: "http://localhost:3000/api",
        graphqlUrl: "http://localhost:3000/graphql",
        appName: "Nexus AI Workspace",
        isDevelopment: false,
        isProduction: true,
      },
    }));

    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    const { logger } = await import("./logger");

    logger.debug("hello");

    expect(debugSpy).not.toHaveBeenCalled();
  });
});
