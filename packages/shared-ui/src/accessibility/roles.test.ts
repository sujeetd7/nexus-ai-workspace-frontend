import { describe, expect, it } from "vitest";

import {
  ACCESSIBILITY_ROLES,
  REACT_NATIVE_ACCESSIBILITY_ROLES,
} from "./roles";
import {
  MIN_TOUCH_TARGET_SIZE,
  meetsMinimumTouchTarget,
} from "./touchTargets";

describe("accessibility roles", () => {
  it("keeps the approved role set stable", () => {
    expect(Object.keys(ACCESSIBILITY_ROLES).sort()).toEqual(
      [
        "alert",
        "button",
        "checkbox",
        "dialog",
        "heading",
        "input",
        "link",
        "list",
        "listitem",
        "navigation",
        "progress",
        "radio",
        "switch",
        "text",
      ].sort(),
    );
  });

  it("maps every approved role to a React Native accessibilityRole value", () => {
    for (const key of Object.keys(ACCESSIBILITY_ROLES) as Array<
      keyof typeof ACCESSIBILITY_ROLES
    >) {
      expect(REACT_NATIVE_ACCESSIBILITY_ROLES[key]).toEqual(expect.any(String));
    }
  });
});

describe("touch targets", () => {
  it("requires 44×44 logical points", () => {
    expect(MIN_TOUCH_TARGET_SIZE).toBe(44);
    expect(meetsMinimumTouchTarget(44, 44)).toBe(true);
    expect(meetsMinimumTouchTarget(43, 44)).toBe(false);
    expect(meetsMinimumTouchTarget(44, 43)).toBe(false);
  });
});
