# Package Ownership Matrix

| Package             | Primary Responsibility                    | Allowed Contents                                                                                                                                                               | Must Not Contain                                                                         |
| ------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `shared-types`      | Shared TypeScript contracts               | Batch 1.1 primitives (`Brand`/`EntityId`/pagination/ISO); Batch 1.2 errors; Batch 1.3 config; justified shared domain contracts only (see `DOMAIN_MODELS.md`)                  | runtime logic, UI, feature entities, HTTP `ApiError`, env globals, Zod                   |
| `shared-utils`      | Platform-safe helpers                     | Batch 1.1 helpers; Batch 1.2 Result / AppError runtime helpers; Batch 1.6 storage helpers; Batch 1.7 logging helpers (console/noop/memory/scoped, `logAppError`, level policy) | browser-only or React-specific logic; environment readers; `localStorage`; remote sinks  |
| `shared-validation` | Shared validation contracts               | Zod primitives; `parseWithSchema`; Batch 1.3 `parsePublicClientConfig` for **plain objects**; returns `Result`/`AppError` from `shared-types`                                  | API transport, UI, feature schemas, RHF, `import.meta.env`, `process.env`, platform APIs |
| `shared-network`    | Platform-neutral HTTP/GraphQL transport   | Axios/RTK/GraphQL helpers; `ApiError`; explicit `apiErrorToAppError` conversion                                                                                                | UI, feature modules, app-specific storage, env globals                                   |
| `shared-ui`         | Cross-platform UI foundation              | components, tokens, themes, responsive helpers                                                                                                                                 | product features, application state, Axios                                               |
| `shared-theme`      | Candidate: theme-only package             | tokens and theme composition only                                                                                                                                              | duplicate UI components                                                                  |
| `ui-kit`            | Candidate: presentation component library | design-system components only                                                                                                                                                  | duplicate theme ownership                                                                |

## Environment platform ownership (Batch 1.3)

| Concern                           | Owner                                    |
| --------------------------------- | ---------------------------------------- |
| `BuildMode`, `PublicClientConfig` | `@nexus/shared-types`                    |
| Plain-object Zod parse / freeze   | `@nexus/shared-validation`               |
| Shared validation primitives      | `@nexus/shared-validation`               |
| Generic `parseWithSchema`         | `@nexus/shared-validation`               |
| Feature / form / auth schemas     | Feature or domain owners                 |
| Vite `import.meta.env` adapter    | `apps/web/src/config/env.ts` only        |
| React Native typed source         | `apps/mobile/src/config/publicConfig.ts` |
| React Native parse adapter        | `apps/mobile/src/config/env.ts`          |

Shared packages must not read environment globals. Do not create `@nexus/shared-environment` or `@nexus/config`.

## Domain model ownership (Batch 1.5)

| Concern                                                 | Owner                                                  |
| ------------------------------------------------------- | ------------------------------------------------------ |
| Identity / ISO / pagination foundations                 | `@nexus/shared-types` (already present)                |
| Shared domain eligibility policy                        | `docs/architecture/DOMAIN_MODELS.md`                   |
| New shared entity contracts                             | Deferred until multi-platform or multi-layer consumers |
| Feature entities (auth, workspace, documents, AI, …)    | Feature or domain owners                               |
| Transport envelopes / `ApiError` / GraphQL client types | `@nexus/shared-network` or app API adapters            |
| Runtime schemas for approved shared contracts           | `@nexus/shared-validation`                             |

Do not add speculative `BaseEntity`, `AuditMetadata`, `PaginatedResult`, feature IDs, or generated GraphQL copies to `shared-types`.

## Storage platform ownership (Batch 1.6)

| Concern                                         | Owner                                       |
| ----------------------------------------------- | ------------------------------------------- |
| `StorageAdapter` contract                       | `@nexus/shared-types` (unchanged)           |
| Namespaced keys / JSON helpers / memory adapter | `@nexus/shared-utils`                       |
| Web `localStorage` adapter                      | `apps/web/src/platform/storage`             |
| Auth token `localStorage` helpers               | Feature-owned (`apps/web` auth) — unchanged |
| Native durable / secure storage                 | Deferred — see technical debt               |

See `docs/architecture/STORAGE_PLATFORM.md`. Do not put browser or native storage APIs in shared packages.

## Logging platform ownership (Batch 1.7)

| Concern                                                                             | Owner                                                     |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `Logger` contract                                                                   | `@nexus/shared-types` (unchanged)                         |
| Console / noop / memory / scoped helpers, `logAppError`, sanitization, level policy | `@nexus/shared-utils`                                     |
| `NetworkLogger`, `redactSensitive`, transport logs                                  | `@nexus/shared-network`                                   |
| Web logger + NetworkLogger adapter + client wiring                                  | `apps/web/src/platform/logging` (+ `api` clients)         |
| Mobile logger                                                                       | `apps/mobile/src/platform/logging`                        |
| Observability compatibility re-export                                               | `apps/web/src/api/observability/logger.ts` (thin wrapper) |
| Remote sinks / telemetry / analytics                                                | Deferred                                                  |

See `docs/architecture/LOGGING_PLATFORM.md`. Do not create `@nexus/shared-logger`. Do not move network redaction into shared-utils.

## Repository contract ownership (Batch 1.8)

| Concern                                                         | Owner                                                  |
| --------------------------------------------------------------- | ------------------------------------------------------ |
| Shared repository eligibility policy                            | `docs/architecture/REPOSITORY_CONTRACTS.md`            |
| Universal type-only capability contracts (when justified later) | Frontend Platform Team via `@nexus/shared-types`       |
| Feature repository contracts and implementations                | Feature teams                                          |
| RTK Query / Axios / GraphQL transport                           | App `api/` + `@nexus/shared-network` (unchanged)       |
| `Result` / `AppError` / pagination foundations                  | `@nexus/shared-types` (already present)                |
| New shared repository interfaces                                | Deferred until multi-platform or multi-layer consumers |

Do not add speculative `IRepository`, `BaseRepository`, generic filter/sort DSLs, or repository implementations to shared packages. Do not create `@nexus/shared-repository` without an approved ADR.

## Overlap Decision

The preferred target is:

- `shared-ui` owns cross-platform UI components and consumes a single theme source.
- Only one package should own design tokens and theme construction.
- `ui-kit` should exist only if it has a distinct consumer contract and release boundary.
- `shared-theme` should exist only if theme assets are consumed independently by multiple UI implementations.

## Consolidation Recommendation

Unless repository evidence proves independent consumers:

1. consolidate tokens and themes into `shared-ui`;
2. remove duplicate `shared-theme` and `ui-kit` scaffolding;
3. preserve internal folders to keep future extraction possible;
4. avoid publishing three overlapping packages during Sprint 0.

## Required Evidence Before Keeping Separate Packages

- independent consumers
- distinct ownership
- separate release lifecycle
- measurable build or runtime boundary
- clear dependency direction
