# Accessibility Architecture

Accessibility foundation for `@nexus/shared-ui` (Batch 2.3).

**Web target:** WCAG 2.2 Level AA  
**React Native:** Equivalent accessible interaction principles via platform APIs (WCAG techniques do not map 1:1).

See also: [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md), [`RESPONSIVE_DESIGN.md`](./RESPONSIVE_DESIGN.md), [`../sprint-2/BATCH_MAP.md`](../sprint-2/BATCH_MAP.md).

## What Batch 2.3 completed

- Conventions for keyboard, focus, screen readers, roles, contrast, reduced motion, and RN touch targets
- Minimal utilities: roles, touch-target constants, reduced-motion preference helpers
- Automated contrast validation for documented semantic text pairs
- Component maturity checklist updates (enforcement lands with Level 1 / Level 2 components)

## What remains for later batches

- Focus-trap / live-region services (with overlays and forms)
- React Native Storybook a11y (TD-057) — web Storybook includes `addon-a11y` (ADR-0013)
- ESLint `jsx-a11y` (not in toolchain yet — see Technical Debt)

Do not mark stub components mature merely because this policy exists.

---

## Keyboard conventions

Required for interactive Level 1 / Level 2 components (document; do not invent overlays here):

| Topic             | Rule                                                                                                                                                                             |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tab order         | Follow DOM / accessibility order; do not scramble with positive `tabIndex` without cause                                                                                         |
| Activation        | Buttons/links: **Enter** and **Space** where platform norms require. Shared `Button` uses native `<button>` on web (browser handles activation) and `Pressable` on React Native. |
| Escape            | Dismiss temporary layers (dialogs, menus, popovers) when introduced                                                                                                              |
| Arrow keys        | Composite widgets (menus, radios, tabs) only — document per pattern                                                                                                              |
| Disabled controls | Not focusable / not activatable; expose disabled state to AT                                                                                                                     |
| Modals / overlays | Focus trap + restore on close (implement with those components)                                                                                                                  |
| Keyboard traps    | Forbidden except intentional modal traps with an Escape exit                                                                                                                     |

---

## Focus conventions

| Topic               | Rule                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| Visible focus       | Always provide a visible focus indicator on interactive elements                               |
| Focus-visible       | Prefer `:focus-visible` (web) so pointer users are not forced rings                            |
| Programmatic focus  | Move focus when UI appears/disappears in ways that would lose context                          |
| Initial focus       | Dialogs: focus first meaningful control or dialog container                                    |
| Restore focus       | Return focus to the invoking control when a layer closes                                       |
| Focus trapping      | Required for modal dialogs; implement with dialog components                                   |
| After state changes | Do not drop focus into `document.body` without a destination                                   |
| Platform difference | Web uses DOM focus; RN uses accessibility focus (`accessibility*` props / `AccessibilityInfo`) |

No shared focus-manager framework in Batch 2.3 — none is required yet.

---

## Screen-reader conventions

| Concern            | Web                                        | React Native                                    |
| ------------------ | ------------------------------------------ | ----------------------------------------------- |
| Accessible name    | Visible label, `aria-label`, or labelledby | `accessibilityLabel`                            |
| Description / hint | `aria-describedby` when needed             | `accessibilityHint`                             |
| Roles              | Native HTML first; ARIA only if needed     | `accessibilityRole` / `accessibilityState`      |
| States             | Native + ARIA state                        | `accessibilityState` (`disabled`, `checked`, …) |
| Live announcements | `aria-live` regions when justified         | `AccessibilityInfo.announceForAccessibility`    |
| Form errors        | Associate error text with the field        | Label + state; announce on submit failure       |
| Loading / progress | `aria-busy` / progress semantics           | Progress role + busy state                      |
| Decorative content | Empty alt / `aria-hidden`                  | `accessible={false}` / no label                 |
| Grouping           | Fieldset / group roles when needed         | Grouping views with clear labels                |

Avoid duplicating native semantics with redundant ARIA.

### Label ↔ Input association

| Platform     | Association                                                                        |
| ------------ | ---------------------------------------------------------------------------------- |
| Web          | `Label` `htmlFor` + `Input` `id`                                                   |
| React Native | No `htmlFor`; set Input `accessibilityLabel` (and optional Label text for visuals) |

---

## Semantic roles

Approved identifiers: `ACCESSIBILITY_ROLES` and `REACT_NATIVE_ACCESSIBILITY_ROLES` in `@nexus/shared-ui`.

| Role            | Notes                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------- |
| button          | Actions that are not navigation                                                          |
| link            | Navigation to a location                                                                 |
| heading         | RN maps to `header`                                                                      |
| text            | Static text                                                                              |
| input           | Prefer native TextInput / `<input>`; web ARIA key maps to `textbox`; RN: `none` + labels |
| checkbox        |                                                                                          |
| radio           |                                                                                          |
| switch          |                                                                                          |
| alert           | Urgent messages                                                                          |
| progress        | Progress indicator (`progressbar`)                                                       |
| dialog          | Modal dialogs (web); RN often custom + labels                                            |
| navigation      | Landmark / nav regions                                                                   |
| list / listitem | Structured lists                                                                         |

---

## Color contrast

- Validate opaque semantic pairs with WCAG relative luminance (package tests).
- Import contrast helpers from **`@nexus/shared-ui/testing`** only (not the runtime barrel).
- Do not run contrast math on every render.

### Required pairs (Batch 2.3)

Primary / secondary text and interactive primary on background/surface for light and dark themes — see `REQUIRED_CONTRAST_PAIRS`.

### Intentional exclusions (token review later)

| Case                       | Reason                                                 |
| -------------------------- | ------------------------------------------------------ |
| Border on background       | No dedicated non-text contrast role; subtle separators |
| Status colors as body text | No `onSuccess` / status-text semantic roles yet        |

### Added in Batch 2.4 (validated)

| Token       | Use                                  |
| ----------- | ------------------------------------ |
| `onPrimary` | Filled primary Button label          |
| `onDanger`  | Filled destructive Button label      |
| `focusRing` | Focus-visible outline / input chrome |

Dark `onPrimary` / `onDanger` use `gray.900` (not white) so AA holds on dark accent fills.

If a **required** pair fails AA, stop and report — do not silently lower thresholds or change approved tokens without review.

---

## Reduced motion

| Platform | Mechanism                                                             |
| -------- | --------------------------------------------------------------------- |
| Web      | `prefers-reduced-motion: reduce` via `matchMedia`                     |
| RN       | `AccessibilityInfo` (`isReduceMotionEnabled` + `reduceMotionChanged`) |

Public helpers:

- `prefersReducedMotion()` — sync; web via matchMedia; safe `false` when unavailable (SSR / tests / sync RN gap)
- `subscribeReducedMotion(listener)` — always returns cleanup; prefers RN AccessibilityInfo when present

Policy for future motion:

- Disable or shorten non-essential animation when reduced motion is preferred
- Preserve essential state-change feedback (not motion-only communication)
- No animation drivers in Batch 2.3

---

## React Native touch targets

| Rule               | Detail                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| Minimum            | **44×44** logical points (`MIN_TOUCH_TARGET_SIZE` / `meetsMinimumTouchTarget`)                                |
| Visual vs hit area | Visual control may be smaller if `hitSlop` (or equivalent) expands the hit area without overlapping neighbors |
| Overlap            | Interactive targets must not overlap                                                                          |
| Text scaling       | Account for larger accessibility font sizes when measuring layout                                             |

---

## Quality gates

| Gate                          | Status in Batch 2.3                                            |
| ----------------------------- | -------------------------------------------------------------- |
| Contrast unit tests           | Enforced in `@nexus/shared-ui`                                 |
| Role / touch-target tests     | Enforced                                                       |
| Reduced-motion listener tests | Enforced                                                       |
| ESLint `jsx-a11y`             | Not present — deferred (TD-052)                                |
| Storybook a11y                | Web: `@storybook/addon-a11y` (Batch 2.6); RN deferred (TD-057) |

| Component keyboard/SR checks | Required by maturity checklist; enforced in later batches |

---

## Component maturity (accessibility)

Level 1 / Level 2 components are not complete without verification of:

- Keyboard (where applicable)
- Screen-reader labels
- Semantic roles
- Focus (visible + programmatic where needed)
- Contrast (semantic token pairs)
- Reduced motion (when motion exists)
- RN touch targets
- Web and mobile verification
- Tests and documentation

See `DESIGN_SYSTEM.md` for the full maturity checklist.
