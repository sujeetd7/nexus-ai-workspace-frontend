# Design System Architecture

Canonical design-system rules for the Nexus AI Workspace frontend monorepo (Sprint 2+).

## Ownership

| Concern                                 | Owner                                   |
| --------------------------------------- | --------------------------------------- |
| Design tokens (source of truth)         | `@nexus/shared-ui` → `src/theme/*`      |
| Breakpoints                             | `@nexus/shared-ui` → `src/responsive/*` |
| Tamagui configuration and token mapping | `@nexus/shared-ui` → `src/tamagui/*`    |
| Centralized UI providers                | `@nexus/shared-ui` → `SharedUIProvider` |
| App composition roots                   | `apps/web`, `apps/mobile`               |
| Product / feature UI                    | Feature owners (out of shared-ui)       |

Do not create `shared-theme` or `ui-kit` packages. Tokens and themes stay in `shared-ui`.

## Token rules

- Existing theme modules are the only source of design values.
- Tamagui tokens/themes must import those modules — no duplicated hex, spacing, or radius literals.
- Do not add speculative tokens in foundation batches.
- Components must consume tokens/theme context; they must not hard-code independent design values (enforced as components are migrated in later batches).

## Provider hierarchy

```text
Application
  └── SharedUIProvider          // public API from @nexus/shared-ui
        └── TamaguiProvider     // internal to shared-ui
              └── ThemeProvider // existing Nexus theme lifecycle
                    └── children
```

Web composition:

```text
SharedUIProvider
  └── ReduxProvider
        └── application
```

Mobile composition:

```text
SafeAreaProvider          // app-owned platform provider
  └── SharedUIProvider
        └── application
```

Applications must import:

```ts
import { SharedUIProvider } from "@nexus/shared-ui";
```

Applications must not import `TamaguiProvider` from `@tamagui/core` / `tamagui`, and must not deep-import `@nexus/shared-ui/src/**`.

## Public API

Stable package-root exports include:

- Existing components, tokens, themes, `ThemeProvider`, `useTheme`
- `SharedUIProvider`, `SharedUIProviderProps`

Build tooling may resolve Tamagui config via the dedicated subpath `@nexus/shared-ui/tamagui-config` or a workspace-relative path. Application runtime code uses the package-root provider API only.

## Sprint 2 component levels

- **Level 1** — primitives
- **Level 2** — composites

Batch 2.1 establishes foundation only (config + provider). It does not add or migrate components.

## Deferred

- Storybook (ADR-0010), including React Native Storybook
- Migration of existing stub components to Tamagui
- Animation drivers, portals, toasts, icon system, motion system
- Optimizing compiler extraction / Metro plugin unless required for correctness

## Related ADRs

- ADR-0010 — Storybook deferred
- ADR-0012 — Tamagui foundation
