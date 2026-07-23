import { describe, expect, it } from "vitest";
import {
  REGISTRATION_FAILURE_CODES,
  type FeatureManifest,
} from "@nexus/shared-types";

import {
  createDependencyRegistry,
  createRegistrationError,
  isRegistrationError,
  resolveFeatureRegistrationOrder,
  runFeatureRegistrationPipeline,
} from "./createDependencyRegistry";

describe("createDependencyRegistry", () => {
  it("registers and resolves services in order", () => {
    const registry = createDependencyRegistry<{
      logger: { info: () => void };
      config: { name: string };
    }>();

    const logger = { info: () => undefined };
    registry.register("logger", logger);
    registry.register("config", { name: "nexus" });

    expect(registry.resolve("logger")).toBe(logger);
    expect(registry.resolve("config").name).toBe("nexus");
    expect(registry.getRegistrationOrder()).toEqual(["logger", "config"]);
    expect(registry.has("logger")).toBe(true);
  });

  it("rejects duplicate service keys", () => {
    const registry = createDependencyRegistry<{ a: number }>();
    registry.register("a", 1);
    expect(() => registry.register("a", 2)).toThrow(/already registered/);
  });

  it("rejects missing service resolution", () => {
    const registry = createDependencyRegistry<{ a: number }>();
    expect(() => registry.resolve("a")).toThrow(/not registered/);
  });

  it("seals against further registration while allowing resolve", () => {
    const registry = createDependencyRegistry<{ a: number }>();
    registry.register("a", 1);
    registry.seal();
    expect(registry.isSealed()).toBe(true);
    expect(registry.resolve("a")).toBe(1);
    expect(() => registry.register("a", 2)).toThrow(/sealed/);
  });
});

describe("feature registration graph", () => {
  it("returns topological order for dependencies", () => {
    const result = resolveFeatureRegistrationOrder([
      { id: "b", dependencies: ["a"] },
      { id: "a" },
      { id: "c", dependencies: ["b"] },
    ]);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual(["a", "b", "c"]);
    }
  });

  it("detects duplicate feature ids", () => {
    const result = resolveFeatureRegistrationOrder([
      { id: "a" },
      { id: "a" },
    ]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe(
        REGISTRATION_FAILURE_CODES.DUPLICATE_FEATURE_ID,
      );
    }
  });

  it("detects missing dependencies", () => {
    const result = resolveFeatureRegistrationOrder([
      { id: "a", dependencies: ["missing"] },
    ]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe(
        REGISTRATION_FAILURE_CODES.MISSING_FEATURE_DEPENDENCY,
      );
    }
  });

  it("detects circular dependencies", () => {
    const result = resolveFeatureRegistrationOrder([
      { id: "a", dependencies: ["b"] },
      { id: "b", dependencies: ["a"] },
    ]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe(
        REGISTRATION_FAILURE_CODES.CIRCULAR_FEATURE_DEPENDENCY,
      );
    }
  });

  it("runs lifecycle hooks in register → initialize → ready order", () => {
    const events: string[] = [];
    const features: FeatureManifest[] = [
      {
        id: "child",
        displayName: "Child",
        version: "1.0.0",
        dependencies: ["parent"],
        register: () => events.push("child:register"),
        initialize: () => events.push("child:initialize"),
        onReady: () => events.push("child:ready"),
      },
      {
        id: "parent",
        displayName: "Parent",
        version: "1.0.0",
        register: () => events.push("parent:register"),
        initialize: () => events.push("parent:initialize"),
        onReady: () => events.push("parent:ready"),
      },
    ];

    const result = runFeatureRegistrationPipeline(features);
    expect(result.ok).toBe(true);
    expect(events).toEqual([
      "parent:register",
      "child:register",
      "parent:initialize",
      "child:initialize",
      "parent:ready",
      "child:ready",
    ]);
  });
});

describe("registration errors", () => {
  it("identifies RegistrationError instances", () => {
    const error = createRegistrationError(
      REGISTRATION_FAILURE_CODES.REGISTRY_SEALED,
      "sealed",
    );
    expect(isRegistrationError(error)).toBe(true);
    expect(isRegistrationError(new Error("nope"))).toBe(false);
  });
});
