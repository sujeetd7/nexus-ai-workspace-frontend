/**
 * Approved accessibility role identifiers for future Level 1 / Level 2 components.
 *
 * Web: prefer native HTML semantics; use ARIA roles only when native elements are insufficient.
 * React Native: map to `accessibilityRole` (and related props) — values are not identical to ARIA.
 *
 * Conventions live in `docs/architecture/ACCESSIBILITY.md`. Do not invent components here.
 */
export const ACCESSIBILITY_ROLES = {
  button: "button",
  link: "link",
  heading: "heading",
  text: "text",
  input: "textbox",
  checkbox: "checkbox",
  radio: "radio",
  switch: "switch",
  alert: "alert",
  progress: "progressbar",
  dialog: "dialog",
  navigation: "navigation",
  list: "list",
  listitem: "listitem",
} as const;

export type AccessibilityRoleName = keyof typeof ACCESSIBILITY_ROLES;

export type AccessibilityRoleValue =
  (typeof ACCESSIBILITY_ROLES)[AccessibilityRoleName];

/**
 * React Native `accessibilityRole` values for the approved set.
 * `input` has no dedicated RN role — use TextInput semantics / `none` + labeled props.
 * Web ARIA uses `textbox` for the `input` role key.
 */
export const REACT_NATIVE_ACCESSIBILITY_ROLES = {
  button: "button",
  link: "link",
  heading: "header",
  text: "text",
  input: "none",
  checkbox: "checkbox",
  radio: "radio",
  switch: "switch",
  alert: "alert",
  progress: "progressbar",
  dialog: "none",
  navigation: "none",
  list: "list",
  listitem: "none",
} as const satisfies Record<AccessibilityRoleName, string>;
