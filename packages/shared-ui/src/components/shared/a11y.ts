import { isWeb, View as TamaguiView } from "@tamagui/core";
import type { ComponentProps } from "react";
import type { AccessibilityRole, AccessibilityState } from "react-native";

import {
  ACCESSIBILITY_ROLES,
  REACT_NATIVE_ACCESSIBILITY_ROLES,
} from "../../accessibility/roles";
import type { NexusAccessibilityRole } from "./types";

type RoleValue = (typeof ACCESSIBILITY_ROLES)[NexusAccessibilityRole];

/** Exact `role` union accepted by Tamagui View / Text hosts. */
export type TamaguiRole = NonNullable<ComponentProps<typeof TamaguiView>["role"]>;

/**
 * Cross-platform accessibility state bits.
 * Compatible with React Native `AccessibilityState`.
 */
export type AccessibilityStateInput = Pick<
  AccessibilityState,
  "disabled" | "selected" | "checked" | "busy" | "expanded"
>;

/**
 * Common cross-platform a11y / identity inputs.
 * Public APIs keep RN-style names; the **calling component** chooses the mapper
 * for the rendered target (raw DOM vs RN/RNW vs Tamagui).
 */
export type PlatformA11yInput = {
  testID?: string;
  nativeID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: NexusAccessibilityRole;
  accessibilityState?: AccessibilityStateInput;
};

export type MapPlatformA11yOptions = {
  /** Raw DOM only: omit explicit `role` when native HTML semantics apply. */
  omitWebRole?: boolean;
  /** Tamagui / DOM `role` override (typed for Tamagui hosts). */
  webRole?: TamaguiRole;
  /** React Native `accessibilityRole` override. */
  nativeAccessibilityRole?: AccessibilityRole;
  /**
   * Decorative hide.
   * Native/Tamagui: `accessible={false}` + related flags (+ `aria-hidden` on web Tamagui).
   * Raw DOM: `aria-hidden`.
   */
  hidden?: boolean;
};

/** Raw HTML element props (`<button>`, `<a>`, `<label>`, …). */
export type WebDomA11yProps = {
  "data-testid"?: string;
  id?: string;
  "aria-label"?: string;
  role?: string;
  "aria-hidden"?: true;
  "aria-disabled"?: true;
  "aria-busy"?: true;
  "aria-checked"?: boolean | "mixed";
  "aria-expanded"?: boolean;
  "aria-selected"?: boolean;
};

/**
 * React Native / React Native Web host props.
 * Typed for Pressable, TextInput, etc. Never includes `data-testid` or DOM ARIA.
 */
export type NativeA11yProps = {
  testID?: string;
  nativeID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityState?: AccessibilityState;
  accessible?: boolean;
  accessibilityElementsHidden?: boolean;
  importantForAccessibility?: "yes" | "no";
};

/**
 * Tamagui host props.
 * Native: RN-typed a11y props.
 * Web: Tamagui-accepted identity + ARIA (`testID`, `id`, typed `role`, `aria-*`) —
 * never RN prop names that leak to the DOM, never `role?: string`.
 */
export type TamaguiA11yProps = {
  testID?: string;
  nativeID?: string;
  id?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityState?: AccessibilityState;
  accessible?: boolean;
  accessibilityElementsHidden?: boolean;
  importantForAccessibility?: "yes" | "no";
  role?: TamaguiRole;
  "aria-hidden"?: true;
  "aria-label"?: string;
  "aria-disabled"?: true;
  "aria-busy"?: true;
  "aria-checked"?: boolean | "mixed";
  "aria-expanded"?: boolean;
  "aria-selected"?: boolean;
};

/** Nexus → Tamagui role values used by this package. */
function resolveTamaguiRole(
  role: NexusAccessibilityRole | undefined,
): TamaguiRole | undefined {
  if (!role) {
    return undefined;
  }
  switch (role) {
    case "button":
      return "button";
    case "link":
      return "link";
    case "heading":
      return "heading";
    case "checkbox":
      return "checkbox";
    case "radio":
      return "radio";
    case "switch":
      return "switch";
    case "alert":
      return "alert";
    case "progress":
      return "progressbar";
    case "dialog":
      return "dialog";
    case "list":
      return "list";
    case "listitem":
      return "listitem";
    // RN-only / no Tamagui ARIA role — omit explicit `role` on web hosts.
    case "text":
    case "input":
    case "navigation":
      return undefined;
    default: {
      const _exhaustive: never = role;
      return _exhaustive;
    }
  }
}

export function resolveWebRole(
  role: NexusAccessibilityRole | undefined,
): RoleValue | undefined {
  if (!role) {
    return undefined;
  }
  // RN-only role — not valid ARIA; omit on raw DOM hosts.
  if (role === "text") {
    return undefined;
  }
  return ACCESSIBILITY_ROLES[role];
}

export function resolveNativeAccessibilityRole(
  role: NexusAccessibilityRole | undefined,
): AccessibilityRole | undefined {
  if (!role) {
    return undefined;
  }
  return REACT_NATIVE_ACCESSIBILITY_ROLES[role];
}

/**
 * Raw DOM test id helper. Do not use on RN/RNW/Tamagui hosts.
 */
export function mapTestProps(
  testID: string | undefined,
): { "data-testid": string } | { testID: string } | Record<string, never> {
  if (!testID) {
    return {};
  }
  if (isWeb) {
    return { "data-testid": testID };
  }
  return { testID };
}

/** @deprecated Prefer boundary-specific mappers. */
export function testProps(
  testID: string | undefined,
): { "data-testid": string } | { testID: string } | Record<string, never> {
  return mapTestProps(testID);
}

function mapWebState(
  state: AccessibilityStateInput | undefined,
): Pick<
  WebDomA11yProps,
  | "aria-disabled"
  | "aria-busy"
  | "aria-checked"
  | "aria-expanded"
  | "aria-selected"
> {
  if (!state) {
    return {};
  }
  const out: Pick<
    WebDomA11yProps,
    | "aria-disabled"
    | "aria-busy"
    | "aria-checked"
    | "aria-expanded"
    | "aria-selected"
  > = {};
  if (state.disabled) {
    out["aria-disabled"] = true;
  }
  if (state.busy) {
    out["aria-busy"] = true;
  }
  if (state.checked !== undefined) {
    out["aria-checked"] = state.checked;
  }
  if (state.expanded !== undefined) {
    out["aria-expanded"] = state.expanded;
  }
  if (state.selected !== undefined) {
    out["aria-selected"] = state.selected;
  }
  return out;
}

/**
 * Raw DOM element boundary only (`<button>`, `<a>`, `<label>`, …).
 */
export function getWebDomAccessibilityProps(
  input: PlatformA11yInput,
  options: MapPlatformA11yOptions = {},
): WebDomA11yProps {
  const props: WebDomA11yProps = {};

  if (input.testID) {
    props["data-testid"] = input.testID;
  }
  if (input.nativeID) {
    props.id = input.nativeID;
  }

  if (options.hidden) {
    props["aria-hidden"] = true;
    return props;
  }

  if (input.accessibilityLabel) {
    props["aria-label"] = input.accessibilityLabel;
  }
  if (!options.omitWebRole) {
    const role =
      options.webRole ?? resolveWebRole(input.accessibilityRole) ?? undefined;
    if (role) {
      props.role = role;
    }
  }
  Object.assign(props, mapWebState(input.accessibilityState));
  return props;
}

/** @deprecated Use `getWebDomAccessibilityProps`. */
export const mapWebDomProps = getWebDomAccessibilityProps;

/**
 * React Native / React Native Web component boundary.
 * Pass RN props; RNW maps `testID`→`data-testid`, `nativeID`→`id`, a11y→ARIA.
 */
export function getNativeAccessibilityProps(
  input: PlatformA11yInput,
  options: MapPlatformA11yOptions = {},
): NativeA11yProps {
  const props: NativeA11yProps = {};

  if (input.testID) {
    props.testID = input.testID;
  }
  if (input.nativeID) {
    props.nativeID = input.nativeID;
  }

  if (options.hidden) {
    props.accessible = false;
    props.accessibilityElementsHidden = true;
    props.importantForAccessibility = "no";
    return props;
  }

  if (input.accessibilityLabel) {
    props.accessibilityLabel = input.accessibilityLabel;
  }
  if (input.accessibilityHint) {
    props.accessibilityHint = input.accessibilityHint;
  }

  const nativeRole: AccessibilityRole | undefined =
    options.nativeAccessibilityRole ??
    resolveNativeAccessibilityRole(input.accessibilityRole);
  if (nativeRole !== undefined) {
    props.accessibilityRole = nativeRole;
  }

  if (input.accessibilityState) {
    props.accessibilityState = input.accessibilityState;
  }

  return props;
}

/** @deprecated Use `getNativeAccessibilityProps`. */
export const mapNativeA11yProps = getNativeAccessibilityProps;

/**
 * Tamagui component boundary.
 * Native: RN-typed props.
 * Web: Tamagui-typed `role` + `testID`/`id`/`aria-*` (no RN a11y name leakage).
 */
export function getTamaguiAccessibilityProps(
  input: PlatformA11yInput,
  options: MapPlatformA11yOptions = {},
): TamaguiA11yProps {
  if (!isWeb) {
    return getNativeAccessibilityProps(input, options);
  }

  const props: TamaguiA11yProps = {};

  if (input.testID) {
    // Tamagui maps `testID` → `data-testid` on web.
    props.testID = input.testID;
  }
  if (input.nativeID) {
    props.id = input.nativeID;
  }

  if (options.hidden) {
    props.accessible = false;
    props.accessibilityElementsHidden = true;
    props.importantForAccessibility = "no";
    props["aria-hidden"] = true;
    return props;
  }

  if (input.accessibilityLabel) {
    props["aria-label"] = input.accessibilityLabel;
  }

  if (!options.omitWebRole) {
    const role =
      options.webRole ?? resolveTamaguiRole(input.accessibilityRole) ?? undefined;
    if (role) {
      props.role = role;
    }
  }

  Object.assign(props, mapWebState(input.accessibilityState));
  return props;
}

/** @deprecated Use `getTamaguiAccessibilityProps`. */
export const mapTamaguiA11yProps = getTamaguiAccessibilityProps;

/**
 * @deprecated Prefer an explicit boundary mapper chosen by the calling component.
 */
export function mapPlatformA11yProps(
  input: PlatformA11yInput,
  options: MapPlatformA11yOptions = {},
): TamaguiA11yProps {
  return getTamaguiAccessibilityProps(input, options);
}
