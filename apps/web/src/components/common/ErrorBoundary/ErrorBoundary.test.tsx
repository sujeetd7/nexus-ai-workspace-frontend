/**
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createMemoryLogger } from "@nexus/shared-utils";

import { ErrorBoundary } from "./ErrorBoundary";

function ThrowingChild(): never {
  throw new Error("render boom");
}

describe("ErrorBoundary", () => {
  it("renders the fallback UI unchanged", () => {
    const memory = createMemoryLogger();
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary logger={memory}>
        <ThrowingChild />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong.")).toBeTruthy();
    consoleError.mockRestore();
  });

  it("logs a safe AppError summary without component stack leakage", () => {
    const memory = createMemoryLogger();
    // React may still report caught errors to console; ErrorBoundary must not.
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary logger={memory}>
        <ThrowingChild />
      </ErrorBoundary>,
    );

    expect(memory.getEntries()).toHaveLength(1);
    const entry = memory.getEntries()[0]!;
    expect(entry.level).toBe("error");
    expect(entry.message).toBe("Unhandled UI rendering error.");
    expect(JSON.stringify(entry)).not.toContain("componentStack");
    expect(entry.metadata).toMatchObject({
      message: "render boom",
    });
    expect(entry.metadata).not.toHaveProperty("stack");
    expect(entry.metadata).not.toHaveProperty("cause");
    expect(entry.metadata).not.toHaveProperty("componentStack");
  });
});
