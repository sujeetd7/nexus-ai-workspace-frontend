import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("react-native", () => ({
  AccessibilityInfo: undefined,
}));

import { prefersReducedMotion, subscribeReducedMotion } from "./reducedMotion";

type Listener = (event: { matches: boolean }) => void;

function installMatchMediaMock(matches = false) {
  const listeners = new Set<Listener>();
  const media = {
    matches,
    addEventListener: vi.fn((type: string, listener: Listener) => {
      if (type === "change") {
        listeners.add(listener);
      }
    }),
    removeEventListener: vi.fn((type: string, listener: Listener) => {
      if (type === "change") {
        listeners.delete(listener);
      }
    }),
  };

  Object.defineProperty(globalThis, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn(() => media),
  });

  return { media, listeners };
}

afterEach(() => {
  Reflect.deleteProperty(globalThis, "matchMedia");
  vi.restoreAllMocks();
});

describe("prefersReducedMotion", () => {
  it("reads matchMedia when available", () => {
    installMatchMediaMock(true);
    expect(prefersReducedMotion()).toBe(true);
  });

  it("returns false safely when matchMedia is unavailable", () => {
    Reflect.deleteProperty(globalThis, "matchMedia");
    expect(prefersReducedMotion()).toBe(false);
  });
});

describe("subscribeReducedMotion", () => {
  it("registers and cleans up matchMedia listeners", () => {
    const { media, listeners } = installMatchMediaMock(false);
    const onChange = vi.fn();

    const unsubscribe = subscribeReducedMotion(onChange);
    expect(media.addEventListener).toHaveBeenCalledTimes(1);
    expect(listeners.size).toBe(1);

    for (const listener of listeners) {
      listener({ matches: true });
    }
    expect(onChange).toHaveBeenCalledWith(true);

    unsubscribe();
    expect(media.removeEventListener).toHaveBeenCalledTimes(1);
    expect(listeners.size).toBe(0);
  });

  it("is a no-op unsubscribe when matchMedia is unavailable", () => {
    Reflect.deleteProperty(globalThis, "matchMedia");
    const unsubscribe = subscribeReducedMotion(() => undefined);
    expect(() => unsubscribe()).not.toThrow();
  });
});
