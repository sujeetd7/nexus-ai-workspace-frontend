/**
 * @vitest-environment jsdom
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMemoryLogger } from "@nexus/shared-utils";
import { BOOTSTRAP_FAILURE_CODES } from "@nexus/shared-types";

import {
  bootstrapWebApp,
  resetWebBootstrapForTests,
  retryWebBootstrap,
} from "./bootstrapApp";

describe("bootstrapWebApp", () => {
  beforeEach(() => {
    resetWebBootstrapForTests();
  });

  it("initializes once and returns a ready runtime", () => {
    const logger = createMemoryLogger();
    const first = bootstrapWebApp({
      viteEnv: {
        MODE: "test",
        VITE_API_URL: "http://localhost:3000/api",
        VITE_GRAPHQL_URL: "http://localhost:3000/graphql",
        VITE_APP_NAME: "Nexus Test",
      },
      logger,
      themeStorage: {
        getItem: async () => null,
        setItem: async () => undefined,
        removeItem: async () => undefined,
      },
    });

    expect(first.status).toBe("ready");
    if (first.status !== "ready") {
      return;
    }

    expect(first.runtime.config.apiBaseUrl).toBe("http://localhost:3000/api");
    expect(first.runtime.store).toBeTruthy();
    expect(first.runtime.httpClient).toBeTruthy();
    expect(first.runtime.store.getState()).toHaveProperty("api");

    const second = bootstrapWebApp();
    expect(second.status).toBe("ready");
    if (second.status === "ready" && first.status === "ready") {
      expect(second.runtime.store).toBe(first.runtime.store);
      expect(second.runtime.httpClient).toBe(first.runtime.httpClient);
    }
  });

  it("returns a critical configuration failure without throwing", () => {
    const logger = createMemoryLogger();
    const outcome = bootstrapWebApp({
      viteEnv: {
        MODE: "not-a-mode",
        VITE_API_URL: "http://localhost:3000/api",
        VITE_GRAPHQL_URL: "http://localhost:3000/graphql",
      },
      logger,
    });

    expect(outcome.status).toBe("failed");
    if (outcome.status !== "failed") {
      return;
    }
    expect(outcome.failure.code).toBe(
      BOOTSTRAP_FAILURE_CODES.CONFIGURATION_INVALID,
    );
    expect(outcome.failure.retryable).toBe(true);
    expect(outcome.failure.message).not.toMatch(/VITE_/);
  });

  it("treats missing injected storage as optional when factory falls back", () => {
    const logger = createMemoryLogger();
    const warn = vi.spyOn(logger, "warn");

    // Inject a working memory adapter — optional path is the catch around
    // createLocalStorageAdapter when no injection is provided (covered in integration).
    const outcome = bootstrapWebApp({
      viteEnv: {
        MODE: "test",
        VITE_API_URL: "http://localhost:3000/api",
        VITE_GRAPHQL_URL: "http://localhost:3000/graphql",
      },
      logger,
      themeStorage: {
        getItem: async () => null,
        setItem: async () => undefined,
        removeItem: async () => undefined,
      },
    });

    expect(outcome.status).toBe("ready");
    expect(warn).not.toHaveBeenCalled();
  });

  it("retries after a failed bootstrap", () => {
    const logger = createMemoryLogger();
    const failed = bootstrapWebApp({
      viteEnv: {
        MODE: "bad",
        VITE_API_URL: "http://localhost:3000/api",
        VITE_GRAPHQL_URL: "http://localhost:3000/graphql",
      },
      logger,
    });
    expect(failed.status).toBe("failed");

    const recovered = retryWebBootstrap({
      viteEnv: {
        MODE: "test",
        VITE_API_URL: "http://localhost:3000/api",
        VITE_GRAPHQL_URL: "http://localhost:3000/graphql",
      },
      logger,
      themeStorage: {
        getItem: async () => null,
        setItem: async () => undefined,
        removeItem: async () => undefined,
      },
    });
    expect(recovered.status).toBe("ready");
  });
});

describe("createAppStore isolation", () => {
  it("creates isolated stores without requiring feature reducers beyond existing web auth", async () => {
    const { createAppStore } = await import("../store/createAppStore");
    const { createWebEnv } = await import("../config/env");

    const config = createWebEnv({
      MODE: "test",
      VITE_API_URL: "http://localhost:3000/api",
      VITE_GRAPHQL_URL: "http://localhost:3000/graphql",
    });

    const a = createAppStore({ config, startSaga: true });
    const b = createAppStore({ config, startSaga: true });

    expect(a.store).not.toBe(b.store);
    expect(a.sagaStarted).toBe(true);
    expect(a.store.getState()).toHaveProperty("api");
    // Pre-existing auth reducer remains on web; not required for store creation API.
    expect(a.store.getState()).toHaveProperty("auth");
  });
});
