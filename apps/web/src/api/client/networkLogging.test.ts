/**
 * @vitest-environment node
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import { createHttpClient, redactSensitive } from "@nexus/shared-network";
import { createMemoryLogger } from "@nexus/shared-utils";

import {
  createGraphQLNetworkLoggerAdapter,
  createNetworkLoggerAdapter,
} from "../../platform/logging";

describe("REST client network logger wiring", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("wires a NetworkLogger and keeps authorization redacted", async () => {
    const memory = createMemoryLogger();
    const adapter = createNetworkLoggerAdapter(memory);

    const managed = createHttpClient({
      baseURL: "https://api.example.test",
      tokenProvider: {
        getAccessToken: () => "super-secret-token",
      },
      logger: adapter,
    });

    managed.client.defaults.adapter = async (config) => ({
      data: { ok: true },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    });

    await managed.client.get("/health");

    const debugEntry = memory
      .getEntries()
      .find((entry) => entry.message === "network.request");
    expect(debugEntry).toBeDefined();

    const serialized = JSON.stringify(debugEntry);
    expect(serialized).not.toContain("super-secret-token");
    expect(serialized).toContain("[REDACTED]");

    managed.ejectInterceptors();
  });

  it("does not break requests when the network logger throws", async () => {
    const managed = createHttpClient({
      baseURL: "https://api.example.test",
      logger: createNetworkLoggerAdapter({
        debug() {
          throw new Error("logger down");
        },
        info() {
          throw new Error("logger down");
        },
        warn() {
          throw new Error("logger down");
        },
        error() {
          throw new Error("logger down");
        },
      }),
    });

    managed.client.defaults.adapter = async (config) => ({
      data: { ok: true },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    });

    await expect(managed.client.get("/health")).resolves.toMatchObject({
      status: 200,
    });
    managed.ejectInterceptors();
  });
});

describe("GraphQL client network logger wiring", () => {
  it("omits GraphQL query text and variables from logged metadata", async () => {
    const memory = createMemoryLogger();
    const managed = createHttpClient({
      baseURL: "https://api.example.test/graphql",
      logger: createGraphQLNetworkLoggerAdapter(memory),
    });

    managed.client.defaults.adapter = async (config) => ({
      data: { data: { me: { id: "1" } } },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    });

    await managed.client.post("", {
      query: "query SecretOp { me { email } }",
      variables: { accessToken: "secret" },
      operationName: "SecretOp",
    });

    const debugEntry = memory
      .getEntries()
      .find((entry) => entry.message === "network.request");
    expect(debugEntry).toBeDefined();
    const serialized = JSON.stringify(debugEntry);
    expect(serialized).not.toContain("query SecretOp");
    expect(serialized).not.toContain("me { email }");
    expect(serialized).not.toContain("accessToken");
    expect(serialized).toContain("SecretOp");

    managed.ejectInterceptors();
  });

  it("keeps shared-network redaction for authorization headers", () => {
    expect(
      redactSensitive({
        Authorization: "Bearer secret",
        cookie: "session=1",
      }),
    ).toEqual({
      Authorization: "[REDACTED]",
      cookie: "[REDACTED]",
    });
  });
});
