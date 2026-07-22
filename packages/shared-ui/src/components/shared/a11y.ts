import { ACCESSIBILITY_ROLES, REACT_NATIVE_ACCESSIBILITY_ROLES } from "../../accessibility/roles";
import type { NexusAccessibilityRole } from "./types";

type RoleValue = (typeof ACCESSIBILITY_ROLES)[NexusAccessibilityRole];
type NativeRoleValue =
  (typeof REACT_NATIVE_ACCESSIBILITY_ROLES)[NexusAccessibilityRole];

export function resolveWebRole(
  role: NexusAccessibilityRole | undefined,
): RoleValue | undefined {
  if (!role) {
    return undefined;
  }
  return ACCESSIBILITY_ROLES[role];
}

export function resolveNativeAccessibilityRole(
  role: NexusAccessibilityRole | undefined,
): NativeRoleValue | undefined {
  if (!role) {
    return undefined;
  }
  return REACT_NATIVE_ACCESSIBILITY_ROLES[role];
}

/** Shared test id props for web (`data-testid`) and RN (`testID`). */
export function testProps(testID: string | undefined): {
  testID?: string;
  "data-testid"?: string;
} {
  if (!testID) {
    return {};
  }
  return { testID, "data-testid": testID };
}
