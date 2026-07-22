# Design System Architecture

Canonical design-system rules for the Nexus AI Workspace frontend monorepo (Sprint 2+).

## Ownership

| Concern                                 | Owner                                                     |
| --------------------------------------- | --------------------------------------------------------- |
| Design tokens (source of truth)         | `@nexus/shared-ui` → `src/theme/*`                        |
| Breakpoints                             | `@nexus/shared-ui` → `src/responsive/*`                   |
| Tamagui configuration and token mapping | `@nexus/shared-ui` → `src/tamagui/*`                      |
| Theme engine / preference lifecycle     | `@nexus/shared-ui` → `ThemeProvider` + `SharedUIProvider` |
| Centralized UI providers                | `@nexus/shared-ui` → `SharedUIProvider`                   |
| App composition roots                   | `apps/web`, `apps/mobile`                                 |
| Product / feature UI                    | Feature owners (out of shared-ui)                         |

Do not create `shared-theme` or `ui-kit` packages. Tokens and themes stay in `shared-ui`.

## Token categories (Batch 2.2)

| Category           | Module                                            | Notes                                                |
| ------------------ | ------------------------------------------------- | ---------------------------------------------------- |
| Colors (palette)   | `theme/colors.ts`, `theme/dark.ts` (`darkColors`) | Hex SoT                                              |
| Semantic colors    | `theme/semanticColors.ts`                         | Derived aliases — no new hex                         |
| Typography         | `theme/typography.ts`                             | Family, sizes, weights, line heights, letter spacing |
| Spacing            | `theme/spacing.ts`                                |                                                      |
| Radius             | `theme/radius.ts`                                 | `circle` stays Nexus-only (`"50%"`)                  |
| Elevation          | `theme/elevation.ts`                              |                                                      |
| Shadows            | `theme/shadows.ts`                                |                                                      |
| Opacity            | `theme/opacity.ts`                                |                                                      |
| Z-index            | `theme/zIndex.ts`                                 |                                                      |
| Motion (durations) | `theme/animations.ts` (`motion` alias on themes)  | No animation drivers yet                             |
| Breakpoints        | `responsive/breakpoints.ts`                       | Shared web/mobile media source                       |

### Token rules

- Theme modules are the only source of design values.
- Tamagui mapping must import those modules — no duplicated literals.
- Do not add speculative tokens without a real consumer.
- Components must consume tokens/theme context (enforced as stubs migrate in later batches).

### Token governance (Batch 2.2 audit)

Stub components under `src/components/**` still contain non-token numeric defaults (Loader `size=24`, Divider hairline `1`). Tracked as TD-047 — migration is out of scope for Batch 2.2. No hard-coded hex/rgba found in components.

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
- Stub components (unchanged)

Build tooling may resolve Tamagui config via `@nexus/shared-ui/tamagui-config`.

## Sprint 2 component levels

- **Level 1** — primitives
- **Level 2** — composites

Batch 2.2 completed tokens + theme engine (including preference/persistence/Tamagui sync). That work must not be repeated in Batch 2.3.

Batch 2.3 focuses on responsive governance and accessibility foundations — not primitives. See `docs/sprint-2/BATCH_MAP.md`.

## Deferred

- Storybook (ADR-0010), including React Native Storybook
- Migration of existing stub components to Tamagui (TD-047)
- Animation drivers / motion implementation
- Native durable theme persistence (TD-032)
- Optimizing compiler extraction / Metro plugin (TD-048)

## Related ADRs

- ADR-0010 — Storybook deferred
- ADR-0012 — Tamagui foundation
