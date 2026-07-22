# Dependencies

Approved dependency policy notes for the Nexus AI Workspace frontend monorepo.

## Package manager

- pnpm `9.15.9` with `engine-strict`
- Install with `pnpm install --frozen-lockfile` in CI
- Syncpack enforces version consistency (`pnpm deps:check`)

## Shared UI / Tamagui (Batch 2.1)

| Package                | Where                                                                | Version policy           |
| ---------------------- | -------------------------------------------------------------------- | ------------------------ |
| `@tamagui/core`        | `@nexus/shared-ui` (runtime) and `apps/web` (Vite config resolution) | Pinned `2.4.6`           |
| `@tamagui/vite-plugin` | `apps/web` (dev)                                                     | Pinned `2.4.6`           |
| `react-native-web`     | `apps/web`                                                           | `^0.21.0`                |
| `tamagui` (full kit)   | Not added until functionality beyond `@tamagui/core` is required     | Same pin when introduced |

`apps/web` lists `@tamagui/core` so the Vite Tamagui plugin can resolve and bundle the shared-ui config. Application source must still use `SharedUIProvider` only — not `TamaguiProvider`.

All `@tamagui/*` packages and `tamagui` must share one pinned version (Syncpack version group).

## Do not add without ADR / explicit approval

- Alternative UI frameworks (Tailwind-as-foundation, Radix-as-foundation, NativeWind, etc.)
- Animation drivers / portal / toast native modules for Tamagui until a consumer batch justifies them
- Storybook packages (ADR-0010)
- Native storage / env injectors (see technical debt + prior ADRs)

## Application import rules

Allowed:

```ts
import { SharedUIProvider } from "@nexus/shared-ui";
```

Forbidden:

```ts
import { TamaguiProvider } from "@tamagui/core";
import { anything } from "@nexus/shared-ui/src/...";
```

## Related

- ADR-0012, `docs/architecture/DESIGN_SYSTEM.md`
- `docs/architecture/dependency-rules.md`
- `.syncpackrc.json`
