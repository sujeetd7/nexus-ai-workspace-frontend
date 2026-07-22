# Dependency Rules

Canonical import-boundary policy for the Nexus AI Workspace frontend monorepo.

Enforced by:

- ESLint `no-restricted-imports` (`configs/eslint/boundaries.mjs`)
- `pnpm boundaries:check` (`scripts/check-import-boundaries.mjs`)

## Package ↔ app direction

| From         | To                    | Allowed                   |
| ------------ | --------------------- | ------------------------- |
| `apps/*`     | `@nexus/*` public API | Yes                       |
| `apps/*`     | other `apps/*`        | No                        |
| `packages/*` | `apps/*`              | No                        |
| `packages/*` | `@nexus/*` public API | Yes (see networking rule) |

## Public API only

- Import packages as `@nexus/<package-name>` only.
- Deep imports such as `@nexus/shared-ui/src/...` are forbidden.
- Each package must expose its contract through `package.json` `exports` / `src/index.ts`.

## Axios / networking

| Location                                  | Axios allowed |
| ----------------------------------------- | ------------- |
| `packages/shared-network/**`              | Yes           |
| `apps/web/src/api/**` (platform adapters) | Yes           |
| All other packages and app modules        | No            |

Non-network shared packages (`shared-ui`, `shared-utils`, `shared-types`, `shared-validation`) must not depend on `@nexus/shared-network`.

## Feature boundaries (web)

- Code under `apps/web/src/features/<feature>/` may import within the same feature.
- Features must not import other features (relative or absolute).
- Shared orchestration belongs in `api/`, `store/`, `components/`, `pages/`, or `providers/`.

## Dependency direction (shared packages)

```text
apps/web, apps/mobile
        │
        ▼
@nexus/shared-ui ──────────► @nexus/shared-types
@nexus/shared-validation ──► @nexus/shared-types
@nexus/shared-utils ───────► @nexus/shared-types
@nexus/shared-network ─────► @nexus/shared-types
        │
        └── Axios / HTTP / GraphQL helpers only in shared-network
```

Batch 1.3: `@nexus/shared-validation` validates plain objects with Zod and returns `Result` / `AppError` shapes from `@nexus/shared-types` without importing `@nexus/shared-utils` (avoids pulling utils sources into app `tsc -b` graphs). It must not read environment globals or depend on apps / `@nexus/shared-network`.

Batch 1.4: shared-validation may export reusable primitives and `parseWithSchema` while remaining dependent only on `zod` and `@nexus/shared-types`. Do not add `@nexus/shared-utils` to shared-validation.

Batch 1.5: justified shared domain contracts (when any exist) live only in `@nexus/shared-types`. Feature entities, API envelopes, and GraphQL-generated types must not be placed in shared-types to “centralize” them. Runtime schemas for approved shared contracts stay in `@nexus/shared-validation` → `@nexus/shared-types`. See `docs/architecture/DOMAIN_MODELS.md`.

Batch 1.6: `@nexus/shared-utils` may own framework-independent storage helpers and an in-memory `StorageAdapter`. Browser `localStorage` adapters live in `apps/web`. Shared packages must not import `window` / `localStorage` / native storage modules. Auth token persistence remains feature-owned. See `docs/architecture/STORAGE_PLATFORM.md`.

Batch 1.7: `@nexus/shared-utils` may own framework-independent logging helpers (`createConsoleLogger`, noop/memory/scoped, `logAppError`, metadata sanitization, level policy). Web/Mobile adapters live under `apps/*/src/platform/logging`. `NetworkLogger` and `redactSensitive` remain in `@nexus/shared-network`. Do not add `@nexus/shared-utils` to `@nexus/shared-network`. `Logger → NetworkLogger` adapters are application-local. See `docs/architecture/LOGGING_PLATFORM.md`.

Do not reverse boundaries (`shared-types` must not import validation or utils; `shared-utils` must not import validation).

## Verification

```powershell
pnpm boundaries:check
pnpm --filter web lint
pnpm --filter @nexus/shared-network lint
```
