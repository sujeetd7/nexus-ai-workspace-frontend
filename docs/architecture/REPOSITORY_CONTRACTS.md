# Repository Contracts

Canonical guidance for Sprint 1 Batch 1.8 repository contract governance.

Shared repository capability contracts are **deferred** until the repository demonstrates concrete reusable consumers across platforms or approved platform layers. This document defines eligibility, ownership, reuse of existing foundations, and anti-patterns so feature work does not invent premature shared data-access abstractions.

## Audit outcome (Batch 1.8)

```text
Governance complete; implementation deferred because no concrete reusable consumer exists.
```

Evidence at closeout:

- No `Repository`, `IRepository`, `BaseRepository`, `RepositoryResult`, or `RepositoryError` types exist
- No feature-local repository modules exist under Web or Mobile
- Web data access today is RTK Query (`baseApi`, `authApi`) plus feature session helpers — not repositories
- Mobile has no feature data-access layer
- Shared pagination, `Result`, `AppError`, and `EntityId` already exist and must be reused when access layers appear
- Shared domain entity models remain deferred (Batch 1.5 / `DOMAIN_MODELS.md`)

## Canonical foundations (already approved)

Reuse these contracts from `@nexus/shared-types`. Do not recreate parallel aliases.

| Concern        | Symbols                                                                  |
| -------------- | ------------------------------------------------------------------------ |
| Identity       | `Brand`, `Opaque`, `EntityId`                                            |
| Result / error | `Result`, `AppError`, `ERROR_CODES`                                      |
| Pagination     | `PageRequest`, `PageResponse`, `CursorPageRequest`, `CursorPageResponse` |
| Async helpers  | `Awaitable`, `MaybePromise`                                              |

Related platform contracts (not repositories):

| Concern          | Owner / symbols                                                                 |
| ---------------- | ------------------------------------------------------------------------------- |
| KV persistence   | `StorageAdapter` (`@nexus/shared-types`) + helpers in `@nexus/shared-utils`     |
| HTTP / GraphQL   | `@nexus/shared-network` (`ApiError`, `apiErrorToAppError`, clients, base query) |
| Server-state API | ADR-0005 RTK Query + app `api/` adapters                                        |

## What a repository contract is

A repository contract describes **data-access capabilities** for a domain entity or aggregate.

It:

- Declares what can be read or written
- Remains independent of HTTP, GraphQL, Axios, storage backends, databases, Redux, and UI state
- Does **not** implement data access

It is not:

- An RTK Query API slice
- A network client or gateway
- A `StorageAdapter` wrapper
- A Redux slice or Saga
- A feature business service

## Eligibility for shared repository contracts

A contract may enter `@nexus/shared-types` only when **all** of the following are true:

1. **Demonstrated consumers** — at least two real call sites across Web and React Native, **or** across multiple approved platform layers
2. **Shared semantics** — method meaning is identical (not merely similar CRUD names)
3. **No deferred domain dependency** — does not require inventing shared domain entities that Batch 1.5 deferred
4. **Transport-free** — no Axios, HTTP status, GraphQL documents, REST envelopes, ORM, or storage-key types in the contract surface
5. **Capability-based** — prefer small read/list/write capabilities over a universal `BaseRepository`

Similarity of `findById` / `create` / `update` / `remove` names alone is not eligibility.

## Package decision (Batch 1.8)

| Option                                         | Decision                                                                              |
| ---------------------------------------------- | ------------------------------------------------------------------------------------- |
| A — Minimal contracts in `@nexus/shared-types` | Rejected — no multi-consumer evidence                                                 |
| B — Feature-owned repositories                 | **Accepted default** — when repositories appear, keep them with feature owners        |
| C — Shared operation context only              | Rejected — no shared cancellation/context consumer beyond network `AbortSignal`       |
| D — New `@nexus/shared-repository` package     | Forbidden without ADR                                                                 |
| E — Raise ADR Request                          | Not required for governance deferral; required before universal CRUD or a new package |

## Ownership

| Concern                                                       | Owner                                                     |
| ------------------------------------------------------------- | --------------------------------------------------------- |
| Universal type-only capability contracts (if justified later) | Frontend Platform Team (`@nexus/shared-types`)            |
| Feature repository contracts and implementations              | Feature teams                                             |
| RTK Query endpoints / Axios / GraphQL adapters                | App `api/` + `@nexus/shared-network` (existing ownership) |
| Persistence keys / `StorageAdapter` usage                     | Platform storage docs — not repository contracts          |
| Shared domain models required by repositories                 | Deferred per `DOMAIN_MODELS.md`                           |

Applications own composition roots and concrete wiring. Shared packages must not own feature repository implementations.

## Result, error, and async policy

When feature or shared repository contracts are later justified:

- Prefer `Promise<Result<T, AppError>>` for expected operational failures
- Convert transport failures with `apiErrorToAppError` at the repository/service boundary
- Do not invent `RepositoryError` or `RepositoryResult`
- Reuse existing `ERROR_CODES` (`NOT_FOUND`, `CONFLICT`, `VALIDATION`, …)
- Treat operations as asynchronous by default
- Forward `AbortSignal` only when the toolchain/cross-platform support is already approved for that call path (network already supports it; do not invent a shared repository signal DSL)

## Pagination, filter, and sort policy

- Reuse existing `PageRequest` / `PageResponse` / `CursorPageRequest` / `CursorPageResponse`
- Do not add parallel `PaginatedResult` / `ListResponse` aliases
- Do **not** add a generic filter DSL or sorting DSL to shared-types without multi-domain evidence
- Feature-specific filters stay feature-owned
- Transport-specific query strings, GraphQL `where` clauses, and ORM predicates must not enter shared contracts

## Capability composition (preferred shape when justified)

If eligibility is later met, prefer composing small contracts over a large base type:

```ts
// Illustrative only — not implemented in Sprint 1.
interface ReadRepository<TEntity, TId> {
  findById(id: TId): Promise<Result<TEntity | null, AppError>>;
}

interface ListRepository<TEntity, TQuery, TResult> {
  list(query: TQuery): Promise<Result<TResult, AppError>>;
}

interface WriteRepository<TEntity, TCreate, TUpdate, TId> {
  create(input: TCreate): Promise<Result<TEntity, AppError>>;
  update(id: TId, input: TUpdate): Promise<Result<TEntity, AppError>>;
  remove(id: TId): Promise<Result<void, AppError>>;
}
```

Reject a universal CRUD repository when shared semantics are not proven.

## Anti-patterns

- `BaseRepository` inheritance hierarchies without demonstrated reuse
- Generic query specifications / Unit of Work / transaction contracts without ADR approval
- Cache decorators, offline repositories, or repository implementations in shared packages in Sprint 1
- Exposing Axios types, HTTP status codes, GraphQL documents, REST DTO envelopes, Prisma/ORM types, storage keys, Redux state, or UI loading state on repository contracts
- Calling RTK Query API modules “repositories” without a real data-access contract
- Inventing shared domain entities solely to support a generic repository
- Creating `@nexus/shared-repository` for organization alone
- `gen:repository` before repeated approved repository bundles exist

## Generator decision

No `gen:repository` in Batch 1.8.

A repository generator is rejected until the repository repeatedly creates a standardized, feature-owned repository bundle (contract + implementation + tests + exports + docs) with proven path security and ownership controls. Do not add CLI placeholders.

## Relationship to RTK Query and network

| Layer                   | Responsibility                                       |
| ----------------------- | ---------------------------------------------------- |
| RTK Query (ADR-0005)    | Server-state cache, invalidation, cancellation       |
| `@nexus/shared-network` | Transport, `ApiError`, retry, redaction              |
| Repository contracts    | Domain-facing data-access capabilities (when needed) |

Do not introduce a parallel shared repository layer that duplicates RTK Query endpoint modules without a demonstrated domain boundary need.

## ADR triggers

Stop and raise an ADR Request before:

- Creating `@nexus/shared-repository` or any new repository package
- Mandating universal CRUD contracts in `@nexus/shared-types`
- Changing dependency direction so shared contracts import network or apps
- Requiring a DI container, Unit of Work, or transaction abstraction
- Placing transport or persistence types on shared repository surfaces
- Implementing repository implementations inside shared packages in Sprint 1

Governance-only deferral does not require a new ADR.

## Future extension rules

- Prefer additive, capability-based contracts when eligibility is met
- Keep implementations feature- or application-owned
- Prefer composition over `BaseRepository`
- Un-defer shared repository contracts only with demonstrated consumers and an updated ownership note
- Do not begin speculative Batch 1.10 work from this document

## Deferred candidates

Deferred until eligibility is proven:

- Shared `ReadRepository` / `ListRepository` / `WriteRepository` capability interfaces
- Shared repository operation context beyond existing network `AbortSignal` usage
- Generic filter / sort / query specification contracts
- Optimistic concurrency repository semantics (see TD-027 / domain deferrals)
- Offline / cached repository decorators
- `gen:repository`

## Examples of current non-repository code

These must **not** be reclassified as shared repositories solely for neatness:

| Example                      | Location                                    | Classification                                    |
| ---------------------------- | ------------------------------------------- | ------------------------------------------------- |
| `baseApi`                    | `apps/web/src/api/services/baseApi.ts`      | RTK Query shell                                   |
| `authApi`                    | `apps/web/src/features/auth/api/authApi.ts` | Feature RTK endpoints                             |
| `persistAuthSession` helpers | `apps/web/src/features/auth/services/`      | Feature session helpers                           |
| `authStorage`                | `apps/web/src/api/auth/authStorage.ts`      | Feature token storage                             |
| `StorageAdapter`             | `@nexus/shared-types`                       | KV persistence contract — not a domain repository |
| `createHttpClient`           | `@nexus/shared-network`                     | Transport client                                  |

## Related documents

- Domain models: `docs/architecture/DOMAIN_MODELS.md`
- Result and errors: `docs/architecture/RESULT_AND_ERRORS.md`
- Storage platform: `docs/architecture/STORAGE_PLATFORM.md`
- Dependency rules: `docs/architecture/dependency-rules.md`
- Package ownership: `docs/sprint-0/package-ownership-matrix.md`
- RTK Query: `docs/adr/ADR-0005-rtk-query.md`
- Shared services: `docs/architecture/SHARED_SERVICES.md`
