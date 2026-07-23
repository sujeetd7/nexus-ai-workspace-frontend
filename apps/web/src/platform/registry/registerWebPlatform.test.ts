/**
 * @vitest-environment jsdom
 */

import { describe, expect, it } from "vitest";
import { PLATFORM_SERVICE_KEYS } from "@nexus/shared-types";
import { createMemoryStorageAdapter } from "@nexus/shared-utils";

import { registerWebPlatform } from "./registerWebPlatform";
import type { createWebHttpClient } from "../../api/client/axios";

type WebHttpClient = ReturnType<typeof createWebHttpClient>;

describe("registerWebPlatform", () => {
  it("rejects duplicate feature manifests before sealing", () => {
    const logger = {
      debug: () => undefined,
      info: () => undefined,
      warn: () => undefined,
      error: () => undefined,
    };

    expect(() =>
      registerWebPlatform({
        config: {
          buildMode: "development",
          apiBaseUrl: "http://localhost:3000/api",
          graphqlUrl: "http://localhost:3000/graphql",
          appName: "test",
          isDevelopment: true,
          isProduction: false,
        },
        logger,
        themeStorage: createMemoryStorageAdapter(),
        httpClient: {} as WebHttpClient,
        features: [
          { id: "a", displayName: "A", version: "1.0.0" },
          { id: "a", displayName: "A2", version: "1.0.0" },
        ],
      }),
    ).toThrow(/more than once/);
  });

  it("exposes registration order for platform services", () => {
    const logger = {
      debug: () => undefined,
      info: () => undefined,
      warn: () => undefined,
      error: () => undefined,
    };
    const registration = registerWebPlatform({
      config: {
        buildMode: "development",
        apiBaseUrl: "http://localhost:3000/api",
        graphqlUrl: "http://localhost:3000/graphql",
        appName: "test",
        isDevelopment: true,
        isProduction: false,
      },
      logger,
      themeStorage: createMemoryStorageAdapter(),
      httpClient: {} as WebHttpClient,
    });

    expect(registration.registry.getRegistrationOrder()).toEqual([
      PLATFORM_SERVICE_KEYS.LOGGER,
      PLATFORM_SERVICE_KEYS.CONFIG,
      PLATFORM_SERVICE_KEYS.STORAGE,
      PLATFORM_SERVICE_KEYS.HTTP_CLIENT,
    ]);
  });
});
