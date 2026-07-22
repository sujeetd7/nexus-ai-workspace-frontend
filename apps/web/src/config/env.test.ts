/**
 * @vitest-environment node
 */

import { describe, expect, it } from "vitest";

import type { PublicClientConfig } from "@nexus/shared-types";

import { createWebEnv, type ViteEnvSource } from "./env";

const validViteEnv: ViteEnvSource = {
  VITE_API_URL: "http://localhost:3000/api",
  VITE_GRAPHQL_URL: "http://localhost:3000/graphql",
  VITE_APP_NAME: "Nexus Web",
  MODE: "development",
};

describe("createWebEnv", () => {
  it("maps Vite variables into the shared contract", () => {
    const config = createWebEnv(validViteEnv);

    expect(config).toEqual({
      buildMode: "development",
      apiBaseUrl: "http://localhost:3000/api",
      graphqlUrl: "http://localhost:3000/graphql",
      appName: "Nexus Web",
      isDevelopment: true,
      isProduction: false,
    } satisfies PublicClientConfig);
  });

  it("maps application name", () => {
    const config = createWebEnv({
      ...validViteEnv,
      VITE_APP_NAME: "Custom Name",
    });

    expect(config.appName).toBe("Custom Name");
  });

  it("maps MODE to buildMode", () => {
    expect(createWebEnv({ ...validViteEnv, MODE: "test" }).buildMode).toBe(
      "test",
    );
    expect(
      createWebEnv({ ...validViteEnv, MODE: "production" }).buildMode,
    ).toBe("production");
  });

  it("supports existing API compatibility mapping", () => {
    const config = createWebEnv(validViteEnv);
    const api = {
      baseUrl: config.apiBaseUrl,
      graphql: config.graphqlUrl,
    } as const;

    expect(api.baseUrl).toBe("http://localhost:3000/api");
    expect(api.graphql).toBe("http://localhost:3000/graphql");
  });

  it("returns a frozen configuration object", () => {
    const config = createWebEnv(validViteEnv);

    expect(Object.isFrozen(config)).toBe(true);
  });

  it("fails startup parsing when required values are missing", () => {
    expect(() =>
      createWebEnv({
        MODE: "development",
        VITE_GRAPHQL_URL: validViteEnv.VITE_GRAPHQL_URL,
      }),
    ).toThrow("Invalid public client configuration.");
  });

  it("does not expose raw import.meta.env on the configuration", () => {
    const config = createWebEnv(validViteEnv);
    const keys = Object.keys(config);

    expect(keys).not.toContain("VITE_API_URL");
    expect(keys).not.toContain("MODE");
    expect(keys).toEqual([
      "buildMode",
      "apiBaseUrl",
      "graphqlUrl",
      "appName",
      "isDevelopment",
      "isProduction",
    ]);
  });

  it("does not include secret-like fields on exported configuration", () => {
    const config = createWebEnv(validViteEnv) as unknown as Record<
      string,
      unknown
    >;

    expect(config).not.toHaveProperty("secret");
    expect(config).not.toHaveProperty("token");
    expect(config).not.toHaveProperty("apiKey");
    expect(config).not.toHaveProperty("password");
  });
});
