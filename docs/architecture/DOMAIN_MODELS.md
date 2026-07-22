# Domain Models

Canonical guidance for Sprint 1 Batch 1.5 shared domain model governance.

New shared domain entity contracts are **deferred** until the repository demonstrates cross-platform or multi-layer consumers. This document defines eligibility, reuse of existing foundations, and anti-patterns so feature work does not invent premature shared abstractions.

## Canonical foundations (already approved)

Reuse these contracts from `@nexus/shared-types`. Do not recreate parallel aliases.

| Concern           | Symbols                                                                  |
| ----------------- | ------------------------------------------------------------------------ |
| Identity branding | `Brand`, `Opaque`, `EntityId`                                            |
| Timestamps        | `ISODateString`, `ISODateTimeString`                                     |
| Pagination        | `PageRequest`, `PageResponse`, `CursorPageRequest`, `CursorPageResponse` |

Matching runtime primitives for IDs, ISO strings, and page **requests** live in `@nexus/shared-validation` (Batch 1.4).

## Shared-domain eligibility criteria

A contract may enter `@nexus/shared-types` as a shared domain model only when **at least one** of the following is true:

1. **Multi-platform reuse** — used by both React Web and React Native, or
2. **Multi-layer reuse** — required by multiple approved platform layers (for example shared services and shared repositories), or
3. **Universal entity contract** — independent of any single feature owner and proven by real call sites

Similarity of shape alone is not eligibility.

Do not share models merely because two features use `id`, `createdAt`, or `status`.

## Transport / domain / persistence / UI separation

| Layer       | May contain                                                                    | Must not enter shared domain           |
| ----------- | ------------------------------------------------------------------------------ | -------------------------------------- |
| Domain      | Stable business meaning, branded IDs, ISO timestamps, pagination result shapes | —                                      |
| Transport   | HTTP status, Axios/GraphQL envelopes, headers, request IDs, `ApiError`         | API envelopes, GraphQL client metadata |
| Persistence | ORM types, table/column details, storage keys                                  | Prisma/DB models, Mongo/SQL internals  |
| UI          | Selection, loading, expanded, formatted labels, form/navigation state          | `isSelected`, `isLoading`, view models |

API envelopes and GraphQL transport types remain in `@nexus/shared-network` or app API adapters.

## Identifier policy

- Prefer `EntityId<"User">` (or equivalent `Brand<string, "UserId">`) at the **feature** boundary when needed.
- Do not preemptively add `UserId`, `WorkspaceId`, `DocumentId`, and similar aliases to shared-types.
- Do not assume every identifier is a UUID; runtime validation uses non-empty trimmed ID primitives unless a format is proven.

## Timestamp policy

- Domain timestamps use `ISODateString` / `ISODateTimeString`.
- Do not use loosely formatted date strings in new shared contracts.
- Do not convert shared contracts to platform `Date` objects unless a later approved batch requires it.
- Feature models that still use plain `string` dates (for example web `AuthUser`) remain feature-owned until they migrate locally.

## Pagination policy

- Canonical list contracts are `PageResponse<T>` and `CursorPageResponse<T>`.
- Canonical request contracts are `PageRequest` and `CursorPageRequest`.
- Do not introduce `PaginatedResult`, `PageInfo`, or `ListResponse` aliases that duplicate these shapes.
- Pagination **links**, HTTP envelopes, and GraphQL connection `Node`/`Edge` types are transport concerns.

## Schema ownership

```text
unknown boundary input
        ↓
@nexus/shared-validation schema (when justified)
        ↓
@nexus/shared-types domain contract
        ↓
Result<T, AppError>
```

Rules:

- Domain contracts live in `@nexus/shared-types` (types only; no Zod).
- Runtime schemas live in `@nexus/shared-validation`.
- Add schemas only for boundary-facing **approved** shared contracts.
- Reuse existing ID, ISO, and pagination request schemas.
- Feature validation stays with feature owners.
- Page/cursor **response** schemas remain deferred with API DTO validation until consumers exist.

## Anti-patterns

- `BaseEntity` inheritance hierarchies without demonstrated reuse
- Speculative `AuditMetadata` before multiple real consumers
- Parallel `PaginatedResult` / `PageInfo` types
- Generic status enums (`active` / `inactive` / `pending`) without shared semantics
- Unrestricted `Record<string, unknown>` entity metadata bags
- Promoting auth, workspace, document, prompt, chat, agent, or MCP models into shared-types without eligibility
- Copying GraphQL-generated or OpenAPI-generated types into shared domain
- Encoding HTTP, Axios, or GraphQL client fields into shared domain models
- Encoding Prisma/ORM or storage-key details into shared domain models
- Encoding UI state into shared domain models
- `gen:model` dumping feature models into shared packages

## Generator decision

No `gen:model` in Batch 1.5.

A model generator is rejected until the repository repeatedly creates a standardized, non-shared feature model bundle with proven path security and ownership controls. Shared packages must not become a dumping ground for generated feature entities.

## Future extension rules

- Prefer additive changes to shared-types.
- Breaking shared contract changes require review.
- Prefer composition over deep inheritance when audit or identity fields later become justified.
- Feature-specific models remain outside `@nexus/shared-types` and `@nexus/shared-validation`.
- Un-defer shared domain additions only with demonstrated consumers and an updated ownership note.

## Deferred candidates

Deferred until eligibility is proven:

- Shared audit metadata (`createdAt` / `updatedAt` / actors) when at least two real consumers exist
- Soft-delete (`deletedAt`) only after an approved cross-domain convention
- Optimistic concurrency `version` when a consumer needs it
- API-to-domain mapping and response validation schemas
- GraphQL generated-type isolation when code generation exists
- Feature-local branding of auth user IDs and timestamps

## Examples of feature-owned models

These remain with their feature/app owners and must **not** be moved into shared-types solely for neatness:

| Example                                | Location (illustrative)                   | Why feature-owned                                              |
| -------------------------------------- | ----------------------------------------- | -------------------------------------------------------------- |
| `AuthUser`, auth request/response DTOs | `apps/web/src/store/slices/auth/types.ts` | Web auth only; tokens and auth status are not universal domain |
| `AuthState` loading/status flags       | Same auth slice                           | UI/session state                                               |
| `WorkspaceState`                       | Web workspace slice scaffold              | App state, not a shared workspace entity                       |
| GraphQL request/response envelopes     | `@nexus/shared-network` / app API         | Transport                                                      |
| `ApiError`                             | `@nexus/shared-network`                   | Transport                                                      |

Product entities (workspace, document, prompt, chat, agent, MCP, billing) belong to their feature owners when introduced.

## Related documents

- Package ownership: `docs/sprint-0/package-ownership-matrix.md`
- Validation platform: `docs/architecture/VALIDATION_PLATFORM.md`
- Dependency rules: `docs/architecture/dependency-rules.md`
- Result and errors: `docs/architecture/RESULT_AND_ERRORS.md`
- Repository contracts: `docs/architecture/REPOSITORY_CONTRACTS.md`
- Shared services: `docs/architecture/SHARED_SERVICES.md`
