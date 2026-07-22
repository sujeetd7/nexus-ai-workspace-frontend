/**
 * @vitest-environment node
 */

import { describe, expect, it, vi } from "vitest";

import { logger } from "./logger";
import { webLogger } from "../../platform/logging";

describe("observability logger compatibility wrapper", () => {
  it("re-exports the platform web logger", () => {
    expect(logger).toBe(webLogger);
    expect(typeof logger.debug).toBe("function");
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.error).toBe("function");
  });

  it("does not bypass the shared Logger contract with raw console.debug in test mode", () => {
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});

    // Vitest MODE is typically `test` → platform logger is noop without sink.
    logger.debug("hello", { password: "secret" });
    expect(debugSpy).not.toHaveBeenCalled();

    debugSpy.mockRestore();
  });
});
