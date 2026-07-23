/**
 * @vitest-environment jsdom
 */

import { beforeEach, describe, expect, it } from "vitest";
import { PLATFORM_SERVICE_KEYS } from "@nexus/shared-types";

import {
  bootstrapWebApp,
  resetWebBootstrapForTests,
} from "./bootstrapApp";

describe("web bootstrap registry integration", () => {
  beforeEach(() => {
    resetWebBootstrapForTests();
  });

  it("registers platform services and seals the registry", () => {
    const outcome = bootstrapWebApp({ startSaga: false });
    expect(outcome.status).toBe("ready");
    if (outcome.status !== "ready") {
      return;
    }

    const { registry, extensions, featureOrder } = outcome.runtime;
    expect(registry.isSealed()).toBe(true);
    expect(extensions.isSealed()).toBe(true);
    expect(featureOrder).toEqual([]);
    expect(registry.resolve(PLATFORM_SERVICE_KEYS.LOGGER)).toBe(
      outcome.runtime.logger,
    );
    expect(registry.resolve(PLATFORM_SERVICE_KEYS.CONFIG)).toBe(
      outcome.runtime.config,
    );
    expect(registry.resolve(PLATFORM_SERVICE_KEYS.STORAGE)).toBe(
      outcome.runtime.themeStorage,
    );
    expect(registry.resolve(PLATFORM_SERVICE_KEYS.HTTP_CLIENT)).toBe(
      outcome.runtime.httpClient,
    );
    expect(() =>
      registry.register(PLATFORM_SERVICE_KEYS.LOGGER, outcome.runtime.logger),
    ).toThrow(/sealed/);
  });
});
