# Tech Stack

Canonical technology choices for the Nexus AI Workspace frontend monorepo.

| Area                 | Choice                                                           |
| -------------------- | ---------------------------------------------------------------- |
| Language             | TypeScript 5.9 (strict)                                          |
| Package manager      | pnpm 9.15.9                                                      |
| Node                 | 22.22.2                                                          |
| Monorepo             | pnpm workspaces + TurboRepo                                      |
| Web framework        | React 19 + Vite 8                                                |
| Mobile framework     | React Native 0.85 (New Architecture)                             |
| Shared UI foundation | Tamagui via `@tamagui/core` inside `@nexus/shared-ui` (ADR-0012) |
| Web RN target        | `react-native-web`                                               |
| Application state    | Redux Toolkit + Redux Saga (ADR-0004)                            |
| Server state         | RTK Query (ADR-0005)                                             |
| HTTP / GraphQL       | Axios + shared-network helpers (ADR-0006)                        |
| Validation           | Zod in `@nexus/shared-validation`                                |

## Explicit exclusions (this repository)

- Tailwind CSS as the design-system foundation
- Radix UI as the shared component foundation
- A separate `@nexus/ui-kit` or `shared-theme` package

See `docs/adr/ADR-0012-tamagui.md` and `docs/architecture/DESIGN_SYSTEM.md`.
