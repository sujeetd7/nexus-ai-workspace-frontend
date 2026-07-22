/**
 * @vitest-environment node
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import type { PublicClientConfig } from "@nexus/shared-types";
import { createMemoryLogger } from "@nexus/shared-utils";

import {
  createGraphQLNetworkLoggerAdapter,
  createNetworkLoggerAdapter,
  createWebLogger,
  stripGraphQLLogMetadata,
} from "./index";

const developmentConfig: PublicClientConfig = {
  buildMode: "development",
  apiBaseUrl: "http://localhost:3000/api",
  graphqlUrl: "http://localhost:3000/graphql",
  appName: "Nexus AI Workspace",
  isDevelopment: true,
  isProduction: false,
};

const productionConfig: PublicClientConfig = {
  ...developmentConfig,
  buildMode: "production",
  isDevelopment: false,
  isProduction: true,
};

const testConfig: PublicClientConfig = {
  ...developmentConfig,
  buildMode: "test",
  isDevelopment: false,
  isProduction: false,
};

describe("createWebLogger", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("allows debug in development", () => {
    const sink = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
    const logger = createWebLogger({ config: developmentConfig, sink });
    logger.debug("hello", { ok: true });
    expect(sink.debug).toHaveBeenCalledWith("hello", { ok: true });
  });

  it("suppresses debug and info in production", () => {
    const sink = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
    const logger = createWebLogger({ config: productionConfig, sink });
    logger.debug("d");
    logger.info("i");
    logger.warn("w");
    expect(sink.debug).not.toHaveBeenCalled();
    expect(sink.info).not.toHaveBeenCalled();
    expect(sink.warn).toHaveBeenCalledWith("w");
  });

  it("defaults to noop in test mode without an injected sink", () => {
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    const logger = createWebLogger({ config: testConfig });
    logger.debug("quiet");
    expect(debugSpy).not.toHaveBeenCalled();
  });
});

describe("createNetworkLoggerAdapter", () => {
  it("maps Logger methods and never throws when the logger throws", () => {
    const memory = createMemoryLogger();
    const adapter = createNetworkLoggerAdapter(memory);
    adapter.debug?.("network.request", { url: "/x" });
    expect(memory.getEntries()[0]?.message).toBe("network.request");

    const throwing: Parameters<typeof createNetworkLoggerAdapter>[0] = {
      debug() {
        throw new Error("fail");
      },
      info() {
        throw new Error("fail");
      },
      warn() {
        throw new Error("fail");
      },
      error() {
        throw new Error("fail");
      },
    };

    const unsafe = createNetworkLoggerAdapter(throwing);
    expect(() => unsafe.error?.("network.error", { status: 500 })).not.toThrow();
  });
});

describe("GraphQL network logger adapter", () => {
  it("strips query text and variables from metadata", () => {
    expect(
      stripGraphQLLogMetadata({
        method: "post",
        url: "/",
        data: {
          query: "query Secret { me { email } }",
          variables: { password: "x" },
          operationName: "Secret",
        },
      }),
    ).toEqual({
      method: "post",
      url: "/",
      data: { operationName: "Secret" },
    });
  });

  it("does not forward GraphQL query or variables through the adapter", () => {
    const memory = createMemoryLogger();
    const adapter = createGraphQLNetworkLoggerAdapter(memory);

    adapter.debug?.("network.request", {
      method: "post",
      data: {
        query: "{ me { id } }",
        variables: { token: "secret" },
        operationName: "Me",
      },
      headers: { Authorization: "Bearer secret" },
    });

    const serialized = JSON.stringify(memory.getEntries());
    expect(serialized).not.toContain("{ me { id } }");
    expect(serialized).not.toContain("variables");
    expect(serialized).toContain("Me");
    // Adapter does not re-implement network redaction; Authorization may still
    // appear here. Production path relies on shared-network redactSensitive.
    expect(memory.getEntries()[0]?.metadata).toMatchObject({
      data: { operationName: "Me" },
    });
  });
});
