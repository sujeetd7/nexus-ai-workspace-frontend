import { describe, expect, it } from "vitest";

import { assertNever } from "./assertNever";

describe("assertNever", () => {
  it("throws for unexpected runtime values", () => {
    expect(() =>
      assertNever("unexpected" as never, "Unhandled case"),
    ).toThrow("Unhandled case");
  });

  it("uses a default message when none is provided", () => {
    expect(() => assertNever(0 as never)).toThrow("Unexpected value: 0");
  });

  it("supports exhaustive switch checking at the type level", () => {
    type Status = "a" | "b";

    function label(status: Status): string {
      switch (status) {
        case "a":
          return "A";
        case "b":
          return "B";
        default:
          return assertNever(status);
      }
    }

    expect(label("a")).toBe("A");
    expect(label("b")).toBe("B");
  });
});
