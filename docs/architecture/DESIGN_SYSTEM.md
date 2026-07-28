# Design System Architecture

Canonical design-system rules for the Nexus AI Workspace frontend monorepo (Sprint 2+).

## Ownership

| Concern                                 | Owner                                                     |
| --------------------------------------- | --------------------------------------------------------- |
| Design tokens (source of truth)         | `@nexus/shared-ui` → `src/theme/*`                        |
| Breakpoints                             | `@nexus/shared-ui` → `src/responsive/*`                   |
| Accessibility conventions / utilities   | `@nexus/shared-ui` → `src/accessibility/*` + docs         |
| Tamagui configuration and token mapping | `@nexus/shared-ui` → `src/tamagui/*`                      |
| Theme engine / preference lifecycle     | `@nexus/shared-ui` → `ThemeProvider` + `SharedUIProvider` |
| Centralized UI providers                | `@nexus/shared-ui` → `SharedUIProvider`                   |
| App composition roots                   | `apps/web`, `apps/mobile`                                 |
| Product / feature UI                    | Feature owners (out of shared-ui)                         |

Do not create `shared-theme` or `ui-kit` packages. Tokens and themes stay in `shared-ui`.

## Token categories (Batch 2.2)

| Category           | Module                                            | Notes                                                       |
| ------------------ | ------------------------------------------------- | ----------------------------------------------------------- |
| Colors (palette)   | `theme/colors.ts`, `theme/dark.ts` (`darkColors`) | Hex SoT                                                     |
| Semantic colors    | `theme/semanticColors.ts`                         | Derived aliases — no new hex                                |
| Typography         | `theme/typography.ts`                             | Family, sizes, weights, line heights, letter spacing        |
| Spacing            | `theme/spacing.ts`                                |                                                             |
| Radius             | `theme/radius.ts`                                 | `circle` stays Nexus-only (`"50%"`)                         |
| Elevation          | `theme/elevation.ts`                              |                                                             |
| Shadows            | `theme/shadows.ts`                                |                                                             |
| Opacity            | `theme/opacity.ts`                                |                                                             |
| Z-index            | `theme/zIndex.ts`                                 |                                                             |
| Motion (durations) | `theme/animations.ts` (`motion` alias on themes)  | CSS helpers in `motion/*` (Batch 2.6); no animation drivers |

| Breakpoints | `responsive/breakpoints.ts` | Shared web/mobile media source (see RESPONSIVE_DESIGN.md) |

### Token rules

- Theme modules are the only source of design values.
- Tamagui mapping must import those modules — no duplicated literals.
- Do not add speculative tokens without a real consumer.
- Components must consume tokens/theme context (enforced as stubs migrate in later batches).

### Batch 5.DS.1 — semantic token gap remediation

Screenshot visual grammar (Sprint 5 temporary SoT) informed **additive** semantic aliases only. Nexus brand palette and `primary` (`#2563EB`) remain authoritative — not ChatGPT colors, names, or lavender accents.

| Candidate                    | Decision                           | Resolution                                                                                                   |
| ---------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Muted surface                | **ADD** `surfaceMuted`             | Light `gray.100`; dark `gray.800` — composer wells, bubbles, list grouping                                   |
| Elevated surface             | **REUSE** `background` / `surface` | White content on sidebar chrome needs no third fill                                                          |
| Tertiary text                | **DEFER**                          | No palette step more muted than `textSecondary` that meets WCAG AA on light `surfaceMuted` and dark surfaces |
| Subtle border                | **ADD** `borderSubtle`             | Light/dark alias of soft hairlines (`gray.100` / `gray.800`)                                                 |
| Strong border                | **DEFER**                          | `border` + `primary` composition covers outline/selected emphasis                                            |
| Selected surface/border/text | **REUSE**                          | Compose `surface`/`surfaceMuted` + `primary` border/badge (see workspace mapping)                            |
| Section-label type role      | **ADD** `typography.sectionLabel`  | Caption-size alias; use `fontWeight.medium` + `textSecondary` at call sites                                  |
| Sheet / modal radius         | **DEFER**                          | TD-056 overlays; no two non-overlay consumers yet                                                            |
| Neutral / inverse action     | **DEFER**                          | Insufficient multi-consumer evidence; must not replace Nexus primary                                         |
| Composer elevation           | **REUSE** `shadows.sm`             | Soft composer lift maps to existing shadow                                                                   |

**Component wiring** (Batch **5.DS.2**): View/Surface/Card expose `surfaceMuted`; Text exposes `sectionLabel`; Button adds additive `shape="pill"`; Chip adds additive `tone="muted"`. Inverse/neutral Button colors remain deferred.

Light / dark mappings live in `theme/semanticColors.ts` and Tamagui `themes` in `tamagui/mapTokens.ts`. Contrast pairs include `text` / `textSecondary` on `surfaceMuted`.

### Batch 5.DS.2 — existing component visual alignment

Screenshot grammar applied to **existing** components only (no new composites).

| Component                  | Decision                          | Change                                                                                |
| -------------------------- | --------------------------------- | ------------------------------------------------------------------------------------- |
| Button                     | **ADD NON-BREAKING VARIANT**      | `shape?: "default" \| "pill"` — default remains `radius.md`; primary stays Nexus blue |
| Card                       | **ADD NON-BREAKING TOKEN OPTION** | `background?`, `borderTone?` forwarded to Surface                                     |
| Chip                       | **ADD NON-BREAKING TOKEN OPTION** | `tone?: "default" \| "muted"`; pill radius already default (**REUSE**)                |
| View                       | **ADD NON-BREAKING TOKEN OPTION** | `SemanticBackground` includes `surfaceMuted`                                          |
| Surface                    | **ADD NON-BREAKING TOKEN OPTION** | `background?`, `borderTone?`                                                          |
| Text                       | **ADD NON-BREAKING VARIANT**      | `variant="sectionLabel"` (medium weight; color consumer-controlled)                   |
| Inverse / black CTA        | **DEFER**                         | Needs multi-consumer inverse tokens (5.DS.1 deferred)                                 |
| ActionPill / WorkspaceCard | **DO NOT IMPLEMENT**              | Duplicate of Chip / Card                                                              |

### Batch 5.DS.3 — shared UI foundation expansion

Level 2 composites added for multi-consumer gaps (no product widgets).

| Component      | Purpose                          | Key consumers                                     | Public API (summary)                                                     | Accessibility                                        |
| -------------- | -------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------- |
| **Avatar**     | Image / initials / icon fallback | Workspace cards, profile, user lists, future chat | `size` xs–xl, `src`, `initials`, `icon`, `alt`, `decorative`             | Decorative hide or labeled `img`; no presence badges |
| **Skeleton**   | Static loading bones             | Workspace/profile/dashboard loading               | `variant` text\|title\|avatar\|rectangle\|rounded\|card                  | `progress` + Loading label; no shimmer lib           |
| **Switch**     | Controlled on/off                | Preferences, settings, feature flags              | `checked`, `onCheckedChange`, `disabled`, required `accessibilityLabel`  | `role=switch`, keyboard Space/Enter, 44pt min        |
| **IconButton** | Icon-only actions                | Headers, toolbars, cards, settings                | Button variants + `shape` default\|pill\|circle; required label; loading | Focus-visible web; 44pt min                          |

Presence indicators and overlays remain deferred.

### Batch 5.DS.4 — shared UI composite completion

Level 2 composites for multi-consumer list / search / empty presentation (no product screens or business logic).

| Component       | Purpose                          | Key consumers                                               | Public API (summary)                                                                         | Accessibility                                                                                            |
| --------------- | -------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **SearchField** | Controlled search input chrome   | Workspace / user / member / future document & prompt search | `value`, `onChangeText`, `placeholder`, `leadingIcon`, clear, `loading`, `disabled`          | Required `accessibilityLabel`; clear is labeled IconButton; `inputMode=search`; no autocomplete/debounce |
| **ListRow**     | Presentation list row            | Workspace, members, documents, prompts, future agents/MCP   | `leading`, `title`, `subtitle`, `description`, `trailing`, `selected`, `disabled`, `onPress` | Pressable → `button`; static → `listitem`; selected/disabled state; 44pt min height                      |
| **SettingsRow** | ListRow settings composition     | Preferences, notifications, privacy, workspace settings     | `value`, `badge`, `showChevron`, controlled `switchChecked` / `onSwitchCheckedChange`        | Switch requires `switchAccessibilityLabel`; reuses ListRow a11y                                          |
| **EmptyState**  | Empty / zero-result presentation | Workspace, profile, documents, prompts, search, future chat | `illustration`, `icon`, `title`, `description`, `primaryAction`, `secondaryAction`           | Labeled region from title; action slots are consumer-controlled                                          |

Examples:

```tsx
<SearchField
  value={query}
  onChangeText={setQuery}
  placeholder="Search workspaces"
  accessibilityLabel="Search workspaces"
/>

<ListRow
  title="Acme"
  subtitle="Owner"
  leading={<Avatar initials="ac" alt="Acme" />}
  trailing={<Badge>Active</Badge>}
  selected
  onPress={onSelect}
/>

<SettingsRow
  title="Email notifications"
  switchChecked={enabled}
  onSwitchCheckedChange={setEnabled}
  switchAccessibilityLabel="Email notifications"
/>

<EmptyState
  title="No results"
  description="Try a different query."
  primaryAction={<Button>Clear filters</Button>}
/>
```

Dialogs, menus, sheets, toasts, selects, and product widgets remain out of scope.

### Token governance (Batch 2.2 audit)

Batch 2.2 recorded stub numeric defaults (Loader size, Divider hairline). Those stubs were migrated in Batch 2.4 (TD-047 closed). Components must consume tokens/theme context; no hard-coded hex/rgba in shared-ui components.

## Theme engine

### Themes

- `lightTheme` / `darkTheme` — full Nexus theme objects (`mode`, palette, `semantic`, foundations)
- `createTheme(mode)` — factory for resolved mode
- Tamagui `themes.light` / `themes.dark` — semantic roles mapped from `semanticColors`

### Preference model

| Preference | Meaning                          |
| ---------- | -------------------------------- |
| `light`    | Force light                      |
| `dark`     | Force dark                       |
| `system`   | Follow OS / browser color scheme |

Resolved `mode` is always `light` | `dark`.

### Lifecycle

```text
SharedUIProvider
  └── TamaguiProvider
        └── ThemeProvider (preference, persistence, system subscription)
              └── Tamagui <Theme name={mode}>
                    └── children
```

`useTheme()` returns:

```ts
{
  theme,          // resolved Nexus theme object
  mode,           // "light" | "dark"
  preference,     // "light" | "dark" | "system"
  setPreference,  // update preference
  setMode,        // convenience for light/dark
}
```

### Persistence

- Optional `storage: StorageAdapter` + `storageKey` on `SharedUIProvider` / `ThemeProvider`
- Applications inject adapters (web: `createLocalStorageAdapter` + `createNamespacedStorageKey`)
- Mobile durable persistence deferred until native `StorageAdapter` (TD-032)

### Extending themes

1. Add palette/semantic values in `src/theme/*` (SoT).
2. Map into Tamagui via `src/tamagui/mapTokens.ts` by import only.
3. Do not change application providers — `SharedUIProvider` already syncs Tamagui `<Theme>`.
4. New named themes beyond light/dark require an additive Tamagui theme entry + Nexus theme object; apps keep using preference APIs.

## Provider hierarchy

Applications must import:

```ts
import { SharedUIProvider, useTheme } from "@nexus/shared-ui";
```

Applications must not import `TamaguiProvider` / `Theme` from `@tamagui/core`, and must not deep-import `@nexus/shared-ui/src/**`.

Web:

```text
SharedUIProvider (system preference + localStorage)
  └── ReduxProvider
        └── application
```

Mobile:

```text
SafeAreaProvider
  └── SharedUIProvider (system preference; persistence deferred)
        └── application
```

## Public API

Stable package-root exports include:

- Tokens, themes, `createTheme`, semantic colors, resolve helpers
- `ThemeProvider`, `SharedUIProvider`, `useTheme`
- Responsive breakpoints and device-class helpers
- Accessibility roles, touch-target constants, reduced-motion helpers
- Motion transition helpers (`resolveTransitionDuration`, `createCssTransition`, …)
- Level 1 primitives: View, Text, Stack, Button, Input, Label, Divider, Loader
- Level 2 composites: FormField, HelperText, ErrorText, Badge, Chip, Card, Surface, Section,
  Avatar, Skeleton, Switch, IconButton, InlineAlert, SearchField, ListRow, SettingsRow, EmptyState
  (`Tooltip` deferred — see `COMPONENTS.md` Tamagui full-kit evaluation)

Approved export subpaths:

- `@nexus/shared-ui/tamagui-config` — build tooling
- `@nexus/shared-ui/testing` — contrast helpers and contrast-pair fixtures (tests/tooling only; not for runtime UI)

Build tooling may resolve Tamagui config via `@nexus/shared-ui/tamagui-config`.

## Sprint 2 component levels (Hybrid Enterprise Atomic)

Organizational classification only — see [`HYBRID_ENTERPRISE_ATOMIC.md`](./HYBRID_ENTERPRISE_ATOMIC.md) and [ADR-0014](../adr/ADR-0014-hybrid-enterprise-atomic.md).

| Level | Name       | Sprint 2 status                          |
| ----- | ---------- | ---------------------------------------- |
| 1     | Primitives | Shipped                                  |
| 2     | Composites | Shipped (Tooltip deferred)               |
| 3     | Patterns   | None implemented — examples in docs only |
| 4     | Screens    | Deferred — app-owned                     |

Process, lifecycle, and checklists: [`DESIGN_SYSTEM_GOVERNANCE.md`](./DESIGN_SYSTEM_GOVERNANCE.md).  
Public API: [`PUBLIC_API_GOVERNANCE.md`](./PUBLIC_API_GOVERNANCE.md).  
Generators (define only): [`GENERATOR_GOVERNANCE.md`](./GENERATOR_GOVERNANCE.md).

### Component maturity checklist

A Level 1 or Level 2 component is **not complete** until all applicable items are done:

- [ ] Keyboard verification (web, where interactive)
- [ ] Screen-reader label verification
- [ ] Semantic-role verification
- [ ] Focus verification (visible + programmatic where needed)
- [ ] Contrast verification against semantic tokens
- [ ] Reduced-motion verification when motion exists
- [ ] React Native touch-target verification (min 44×44 or documented hit-area expansion)
- [ ] Web verification
- [ ] Mobile verification
- [ ] Tests
- [ ] Documentation
- [ ] Storybook (web shared components)

Stub components must not be marked mature solely because this policy exists (TD-047 closed for L1).

Batch 2.2 completed tokens + theme engine (including preference/persistence/Tamagui sync). That work must not be repeated.

Batch 2.3 completed responsive governance + accessibility foundations — not primitives. See `docs/sprint-2/BATCH_MAP.md`, `RESPONSIVE_DESIGN.md`, and `ACCESSIBILITY.md`.

Batch 2.4 completed Level 1 primitives (`COMPONENTS.md`). Stub migration debt for those components is closed.

Batch 2.5 completed Level 2 composites (FormField, HelperText, ErrorText, Badge, Chip, Card, Surface, Section). Tooltip deferred pending overlay deps — see `COMPONENTS.md`.

Batch 2.6 completed motion helpers + Web Storybook + quality layer — see `MOTION.md`, `STORYBOOK.md`, ADR-0013.

Batch 2.7 completed Hybrid Enterprise Atomic governance + Design System / Storybook / generator / public-API docs — no production UI changes.

### Batch 5.DS.8 — web application shell (app-owned screen)

Production authenticated shell lives in `apps/web/src/screens/AppShell/` — **not** in `@nexus/shared-ui`.

| Area            | Decision                                                                                                                           |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Shell ownership | App screen module; `ApplicationShell` re-exports `AppShell`                                                                        |
| UI composition  | Reuse Level 2 composites only (Avatar, SearchField, ListRow, Badge, Divider, IconButton, Stack, Text, Surface, EmptyState, Loader) |
| Navigation      | Existing React Router paths only — no duplicate routing framework                                                                  |
| Workspace       | Reuse `WorkspaceBootstrap` + workspace slice + `useWorkspaceSwitch`                                                                |
| Search          | Visual SearchField placeholder — disabled; no backend                                                                              |
| Recent / Pinned | EmptyState until APIs exist — no mock data                                                                                         |
| Responsive      | Shared breakpoint scale (`md`/`lg`) — desktop sidebar, tablet collapse, mobile drawer                                              |
| Theme toggle    | Deferred — Storybook toolbar only                                                                                                  |

## Deferred

- Level 3 Patterns implementation (examples only until promotion)
- Level 4 shared Screen catalog
- React Native Storybook (TD-057)
- Overlay composites (Tooltip, Dialog, Sheet, Drawer, Toast, Popover, Menu, Select)
- Animation drivers (Framer Motion / Reanimated / Tamagui `createAnimations`)
- Native durable theme persistence (TD-032 / TD-051)
- Optimizing compiler extraction / Metro plugin (TD-048)
- ESLint `jsx-a11y` enforcement (TD-052)
- Design System generators implementation (specs only — `GENERATOR_GOVERNANCE.md`)

## Related ADRs

- ADR-0010 — Storybook deferred (superseded for web by ADR-0013)
- ADR-0012 — Tamagui foundation
- ADR-0013 — Web Storybook
- ADR-0014 — Hybrid Enterprise Atomic organization
