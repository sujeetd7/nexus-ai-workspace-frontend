# Level 1 & Level 2 Components

Production primitives (Batch 2.4) and composites (Batch 2.5) in `@nexus/shared-ui`.

```ts
import {
  // Level 1
  View,
  Text,
  Stack,
  XStack,
  YStack,
  Button,
  Input,
  Label,
  Divider,
  Loader,
  // Level 2
  FormField,
  HelperText,
  ErrorText,
  Badge,
  Chip,
  Card,
  Surface,
  Section,
} from "@nexus/shared-ui";
```

All components require `SharedUIProvider` (already used by web/mobile apps).

**Not exported in Batch 2.5:** `Tooltip` (deferred — see Tamagui full-kit evaluation below).

**Storybook (Batch 2.6):** Web stories under `apps/web/src/stories` — see `STORYBOOK.md` / ADR-0013. React Native Storybook remains deferred (TD-057).

---

# Level 1 — Primitives

Maturity: **Level 1 — Primitive**.

## View

**Purpose:** Cross-platform container foundation.

| Prop                        | Notes                                      |
| --------------------------- | ------------------------------------------ |
| `background`                | `background` \| `surface` \| `transparent` |
| `padding` / `margin` (+H/V) | Spacing tokens                             |
| `borderRadius`              | Radius tokens                              |
| `flex` / size               | Layout subset                              |
| `testID`, a11y props        | Cross-platform                             |

Unsupported: page shells, cards, unrestricted Tamagui prop passthrough. Prefer `Stack` for directional layouts.

---

## Text

**Purpose:** Typography + semantic color text.

| Prop                                           | Notes                                                    |
| ---------------------------------------------- | -------------------------------------------------------- |
| `variant`                                      | `display` \| `h1`–`h3` \| `body` \| `caption` \| `label` |
| Legacy                                         | `title` → `h2`, `heading` → `h3` (unused stub aliases)   |
| `color`                                        | Semantic text colors                                     |
| `weight`, `align`, `truncate`, `numberOfLines` | Token / platform-supported                               |
| `id`                                           | Web `id` / RN `nativeID` for describedby associations    |

RN font scaling remains enabled (default TextInput/Text behavior).

---

## Stack

**Purpose:** Minimal flex layout for children.

| Prop                       | Notes                                            |
| -------------------------- | ------------------------------------------------ |
| `direction`                | `vertical` (default) \| `horizontal`             |
| `gap`                      | Spacing token (default `md`)                     |
| `align`, `justify`, `wrap` | Flex alignment                                   |
| `media`                    | Optional `$sm`–`$xl` overrides via Tamagui media |

Aliases: `XStack`, `YStack` (direction-locked wrappers). Not a grid/page system.

---

## Button

**Purpose:** Accessible action control.

**Maturity:** Level 1 — native platform semantics (Batch 2.4 correction).

| Prop                               | Notes                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------- |
| `variant`                          | `primary` \| `secondary` \| `ghost` \| `destructive`                      |
| `size`                             | `sm` \| `md` \| `lg` (min 44×44 touch target)                             |
| `loading`, `disabled`, `fullWidth` | States                                                                    |
| `type`                             | `"button"` (default) \| `"submit"` \| `"reset"` — web only; ignored on RN |
| `onPress`                          | Cross-platform press                                                      |
| `leftIcon` / `rightIcon`           | Generic slots (no icon system)                                            |

### Platform implementations

| Platform     | Implementation                            |
| ------------ | ----------------------------------------- |
| Web          | Native HTML `<button>` (`Button.web.tsx`) |
| React Native | `Pressable` (`Button.native.tsx`)         |

**Resolution:** Metro prefers `Button.native.tsx`. Vite/Vitest prefer `Button.web.tsx` via resolve extensions. `Button.tsx` re-exports the native module for TypeScript default resolution (no DOM types on mobile typecheck).

### Disabled vs loading

| State                    | Web                                                                  | React Native                                                       |
| ------------------------ | -------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `disabled`               | Native `disabled` attribute                                          | `Pressable` `disabled` + `accessibilityState.disabled`             |
| `loading` (not disabled) | `aria-busy`; **not** HTML-disabled (focus preserved); clicks ignored | `accessibilityState.busy`; presses ignored; not Pressable-disabled |
| both                     | Native disabled wins; busy may still be exposed                      | Disabled + busy                                                    |

Web keyboard activation relies on native `<button>` behavior (no custom Enter/Space handlers).

**Compatibility:** Stub `variant` (`solid`/`outline`/…) and `colorScheme` had no consumers (only `App.tsx` used children + `onPress`). Replaced with the variants above.

jsdom + React Native Web tests validate the shared module shape and DOM/RNW behavior — not a physical device.

---

## Input

**Purpose:** Single-line text field (not a form composite).

Supports value/defaultValue, placeholder, disabled, readOnly, invalid, required, secureTextEntry, normalized `inputMode`, labels via `accessibilityLabel` + optional `id` for web `Label htmlFor`.

Additive Batch 2.5: optional `describedBy` → web `aria-describedby` (FormField helper/error association). On RN, prefer `accessibilityHint`.

Do not use placeholder as the only label.

---

## Label

**Purpose:** Accessible label for inputs.

| Platform | Behavior                                                             |
| -------- | -------------------------------------------------------------------- |
| Web      | `<label>` via `styledHtml`, supports `htmlFor`                       |
| RN       | Text + a11y props; pair with Input `accessibilityLabel` (no htmlFor) |

`required` appends a visual ` *` marker (no separate required-color token).

---

## Divider

**Purpose:** Separator.

| Prop          | Notes                                     |
| ------------- | ----------------------------------------- |
| `orientation` | `horizontal` \| `vertical`                |
| `decorative`  | default `true` → `aria-hidden`            |
| `vertical`    | Deprecated alias for vertical orientation |

Hairline thickness is a platform separator convention; color is `$borderColor`.

---

## Loader

**Purpose:** Indeterminate progress indicator.

| Prop                 | Notes                                      |
| -------------------- | ------------------------------------------ |
| `size`               | `sm` \| `md` \| `lg` (from spacing tokens) |
| `color`              | Semantic spinner color                     |
| `accessibilityLabel` | Required for non-motion communication      |

Uses `ActivityIndicator`; when `prefersReducedMotion()`, renders static labeled text instead.

---

# Level 2 — Composites

Maturity: **Level 2 — Composite** (Batch 2.5).

Built from Level 1 primitives (and the same platform pressable pattern as Button for Chip). No business logic. Package-root imports only.

## FormField

**Purpose:** Label + Input + HelperText / ErrorText composition.

| Prop                   | Notes                                                                                                     |
| ---------------------- | --------------------------------------------------------------------------------------------------------- |
| `label`                | Required visible label                                                                                    |
| `helperText`           | Shown when no error                                                                                       |
| `errorText`            | When set → invalid input; hides helper                                                                    |
| `required`, `disabled` | Forwarded to Label + Input                                                                                |
| Input passthrough      | `value`, `defaultValue`, `placeholder`, `readOnly`, `secureTextEntry`, `inputMode`, change/focus handlers |
| `id`                   | Stable field id (defaults to `useId`)                                                                     |

**Accessibility:** Web Label `htmlFor` ↔ Input `id`; `aria-describedby` to helper/error; RN uses `accessibilityLabel` + `accessibilityHint`. ErrorText uses `alert` role.

**Out of scope:** React Hook Form / any form library.

---

## HelperText

**Purpose:** Non-error field guidance (`caption` + `textSecondary`).

Optional `id` for Input `describedBy`.

---

## ErrorText

**Purpose:** Field error message (`caption` + `danger`, `alert` role).

Optional `id` for Input `describedBy`.

---

## Badge

**Purpose:** Compact status/meta label. No icons.

| Prop      | Notes                                                                                 |
| --------- | ------------------------------------------------------------------------------------- |
| `variant` | `neutral` \| `primary` \| `secondary` \| `success` \| `warning` \| `danger` \| `info` |
| `size`    | `sm` \| `md`                                                                          |

**Theme / contrast:** Soft outline on `surface` with semantic **border** accent. Label text always uses semantic `text` (AA). Status colors are not used as body text (avoids TD-053 status-as-text gaps). Theme-aware via Tamagui semantic tokens.

---

## Chip

**Purpose:** Selectable filter/tag control (not removable).

| Prop       | Notes                                                   |
| ---------- | ------------------------------------------------------- |
| `selected` | Visual + `aria-pressed` / `accessibilityState.selected` |
| `disabled` | Blocks press                                            |
| `onPress`  | Cross-platform                                          |

**Platform:** Web native `<button>`; RN `Pressable` (same resolution pattern as Button). Min 44×44 touch target. Selected fill uses `primary` / `onPrimary`.

---

## Card

**Purpose:** Elevated content container with slots.

| Slot / prop | Notes        |
| ----------- | ------------ |
| `header`    | Optional     |
| `children`  | Body         |
| `footer`    | Optional     |
| `elevation` | Default `sm` |
| `padding`   | Default `lg` |

Decorative Dividers between present slots. No business layout.

---

## Surface

**Purpose:** Semantic elevation wrapper only.

| Prop                       | Notes                                                              |
| -------------------------- | ------------------------------------------------------------------ |
| `elevation`                | `none` \| `xs`–`xl` → web `boxShadow` / RN `elevation` from tokens |
| `padding*`, `borderRadius` | Token props                                                        |

Background is always `surface`.

---

## Section

**Purpose:** Consistent vertical spacing block with optional title.

| Prop             | Notes                 |
| ---------------- | --------------------- |
| `title`          | Optional `h3` heading |
| `gap`, `padding` | Spacing tokens        |

Not a page / app shell layout.

---

## Tooltip (not implemented)

See **Tamagui full-kit evaluation** below. Not exported.

---

# Tamagui full-kit evaluation (Batch 2.5)

| Component   | Choice                                         | Rationale                                                                                                                                                                                                                                                     | A11y impact                                                 | Bundle impact                                  | Native deps                                                               | Nexus owns API?            |
| ----------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------- | -------------------------- |
| **Tooltip** | **Defer** — do not ship; do not adopt full kit | Production tooltip needs portal/positioning, hover+focus+delay, escape dismiss, and RN modality. `@tamagui/core` alone is insufficient; Tamagui Tooltip typically pulls kit + portal; RN often needs gesture/reanimated peers not approved (DEPENDENCIES.md). | Shipping a partial tooltip would fail keyboard/SR maturity. | Full kit would be a large additive dependency. | Would likely need portal + possibly gesture handler — **stop condition**. | Yes, when introduced later |
| Popover     | Evaluation only — defer                        | Same overlay/portal/focus-restore requirements as Tooltip; belongs with overlay batch.                                                                                                                                                                        | Focus trap / restore required                               | High if kit                                    | Possible portal                                                           | Yes later                  |
| Dialog      | Evaluation only — defer                        | Modal focus trap, scroll lock, restore — out of Batch 2.5 scope                                                                                                                                                                                               | High a11y bar                                               | High if kit                                    | Possible                                                                  | Yes later                  |
| Sheet       | Evaluation only — defer                        | Gesture-driven sheet on native; needs approved gesture deps                                                                                                                                                                                                   | Strong native a11y needs                                    | High                                           | Likely gesture handler                                                    | Yes later                  |
| Select      | Evaluation only — defer                        | Listbox keyboard model + portal; not form-primitive scope                                                                                                                                                                                                     | Complex keyboard                                            | High if kit                                    | Possible                                                                  | Yes later                  |

**Decision:** Remain on `@tamagui/core` only. Introduce Tamagui full-kit only when an overlay batch can justify it **and** native peer dependencies are explicitly approved. Do not expose Tamagui components in the public API.

---

# Theme / responsive / a11y

- Colors and type come from semantic + typography tokens (light/dark via provider).
- Stack responsive overrides use approved Tamagui media names.
- Interactive controls meet RN 44×44 minimum (`MIN_TOUCH_TARGET_SIZE`).
- Contrast pairs for `onPrimary` / `onDanger` / `focusRing` are validated in `@nexus/shared-ui/testing`.
- Composites reuse Batch 2.3 helpers (`testProps`, role maps, touch targets, reduced motion on Loader only — no new motion in Batch 2.5).

## Extension rules

- Add variants only with token backing and tests.
- No business logic, networking, storage, or Redux.
- Overlay composites (Dialog, Sheet, Toast, Popover, Menu, Select, Tooltip) belong in later batches after dependency approval.
