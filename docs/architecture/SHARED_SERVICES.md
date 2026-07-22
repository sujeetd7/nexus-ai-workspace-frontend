# Shared Services

Canonical guidance for Sprint 1 Batch 1.9 shared application service governance.

Shared application services are **deferred** until the repository demonstrates reusable cross-platform orchestration that is not already owned by environment adapters, storage helpers, logging factories, network clients, RTK Query, or Redux Saga.

```text
Batch 1.9 — Governance complete; shared services deferred pending demonstrated cross-platform orchestration.
```

## Dependency on Batch 1.8

Batch 1.8 closed as governance-only (`docs/architecture/REPOSITORY_CONTRACTS.md`).

Batch 1.9 **must not** invent repository contracts to justify shared services. Shared services may depend on repository capability contracts only after Batch 1.8 (or a later approved change) actually adds them.

## Audit outcome (Batch 1.9)

Evidence at closeout:

- No `IService`, `BaseService`, `SharedService`, `ServiceResult`, or `@nexus/shared-services` package
- No `docs/architecture/SHARED_SERVICES.md` existed before this governance document
- Code named “service” today:
  - `apps/web/src/features/auth/services/authSession.ts` — feature session helpers
  - `apps/web/src/api/services/baseApi.ts` — RTK Query shell (not an application service)
- Mobile has no `services/` tree and no service-named symbols
- Platform concerns already exist as factories/adapters:
  - Env: `createWebEnv` / `createMobileEnv` + `parsePublicClientConfig`
  - Storage: `StorageAdapter` + `createMemoryStorageAdapter` / `createLocalStorageAdapter`
  - Logging: `Logger` + `createConsoleLogger` / app platform loggers
  - Network: `createHttpClient`, GraphQL helpers, `ApiError` / `apiErrorToAppError`
- No DI container, service locator, or use-case framework is present or approved
- `gen:service` is listed as a future generator only; not implemented

## What a shared service is

A shared service coordinates **existing platform capabilities** for reuse by Web and React Native.

It must be:

- Platform-independent and framework-independent
- Reusable by Web and React Native
- Stateless where possible
- Explicitly dependency-injected via factory/function parameters
- Based on approved platform contracts
- Testable without browser or native globals
- Free of UI, Redux, and feature-specific business rules

It is not:

- An RTK Query API module
- A network client or GraphQL gateway
- A storage adapter or logger factory wrapper for its own sake
- A Redux Saga or RTK Query replacement
- A feature authentication / workspace / document / AI business service

## Shared-service eligibility criteria

A shared service may be added to an **existing approved package** only when **all** of the following are true:

1. **Demonstrated cross-platform orchestration** — real Web and React Native (or multi-layer) consumers
2. **Not already owned** — does not duplicate env, storage, logging, network, RTK Query, or Saga responsibilities
3. **No invented dependencies** — does not require deferred shared domain models or deferred repository contracts
4. **Transport-free / UI-free** — does not import React, React Native, Redux Toolkit, Saga, RTK Query, Axios, GraphQL clients, browser APIs, native APIs, apps, or features
5. **Simple factories** — no service locator, IoC container, or `BaseService` hierarchy without ADR approval

Similarity of the word “service” in folder names is not eligibility.

## Package decision (Batch 1.9)

| Option                                               | Decision                                                                                          |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| A — Minimal factories/contracts in existing packages | Rejected — no concrete reusable orchestration to place                                            |
| B — Keep services application/feature-owned          | **Accepted default** for current helpers (`authSession`, feature APIs)                            |
| C — Governance-only closeout                         | **Accepted for Batch 1.9**                                                                        |
| D — Create `@nexus/shared-services`                  | Forbidden without approved ADR                                                                    |
| E — Raise ADR Request                                | Not required for governance deferral; required before a new package, DI container, or service bus |

## Ownership

| Concern                                              | Owner                                                   |
| ---------------------------------------------------- | ------------------------------------------------------- |
| Proven cross-platform orchestration (when justified) | Frontend Platform Team via an existing approved package |
| Feature business services                            | Feature teams                                           |
| App composition roots / dependency wiring            | Applications (`apps/web`, `apps/mobile`)                |
| Env / storage / logging / network platform           | Existing Batch 1.3–1.7 owners (unchanged)               |
| Long-running workflow orchestration                  | Redux Saga (ADR-0004)                                   |
| Server-state HTTP cache                              | RTK Query (ADR-0005)                                    |
| Transport                                            | `@nexus/shared-network` + app `api/` adapters           |

Do not create `@nexus/shared-services` for organization alone.

## Functions and factories over classes

Prefer:

```ts
// Illustrative only — not implemented in Sprint 1.
createPreferenceService({
  storage,
  logger,
  validate,
});
```

Rules:

- Use explicit factory/function parameters
- Inject approved contracts (`StorageAdapter`, `Logger`, validation parsers, platform-neutral config)
- Do not introduce a DI container, service locator, global registry, or singleton service container
- Do not add `BaseService` / `AbstractService` hierarchies without ADR approval
- Avoid wrapping existing utilities in service classes merely to satisfy this batch

## Result and error policy

When a shared service is later justified:

- Return `Result<T, AppError>` for expected operational failures
- Avoid throwing raw errors for expected failures
- Normalize unknown dependency failures into `AppError`
- Do not create `ServiceError`
- Reuse existing `ERROR_CODES`
- Avoid logging and returning the same error repeatedly unless an approved policy requires it
- Never expose dependency-specific error objects (`ApiError`, Zod issues, storage exceptions) beyond the service boundary

## Repository dependency policy

- Shared services must not invent repository contracts
- If Batch 1.8 remains deferred, feature services may use feature-owned access modules or RTK Query without a shared repository layer
- Only after shared repository capabilities exist may shared services depend on those type-only contracts

## Separation from existing layers

| Layer                    | Owns                                     | Shared service must not replace        |
| ------------------------ | ---------------------------------------- | -------------------------------------- |
| Env adapters (Batch 1.3) | Public client config parse/freeze        | Bootstrap/config “service” wrappers    |
| Storage (Batch 1.6)      | `StorageAdapter` + helpers               | Generic storage service without need   |
| Logging (Batch 1.7)      | `Logger` + factories                     | Logging facade that duplicates helpers |
| Network (shared-network) | HTTP/GraphQL transport, retry, redaction | Network “service” re-wrappers          |
| RTK Query (ADR-0005)     | Server cache, invalidation, cancellation | Endpoint orchestration duplicates      |
| Redux Saga (ADR-0004)    | Long-running workflows                   | Parallel saga abstractions             |
| Feature services         | Auth session, workspace, product rules   | Feature business logic in shared pkgs  |

## Default classification of candidate concerns

| Candidate                       | Classification                             |
| ------------------------------- | ------------------------------------------ |
| Environment bootstrap           | Already implemented by adapters            |
| Storage service                 | Premature / defer                          |
| Logging service                 | Already implemented by logger adapters     |
| Network service                 | Already implemented by shared-network      |
| Authentication service          | Feature-owned                              |
| Workspace / document / AI / MCP | Feature-owned or future product concern    |
| ID generation                   | Utility (`createId`), not a service        |
| Clock abstraction               | Only if tests demonstrate need             |
| Retry orchestration             | Network-owned                              |
| Request context                 | Defer unless consumers exist               |
| Preference / settings service   | Defer until cross-platform consumers exist |
| Health / status service         | Defer unless consumers exist               |

## Anti-patterns

- Service locator / IoC container / global service registry
- `BaseService` inheritance hierarchies without demonstrated reuse
- Command bus / query bus / event bus / use-case framework without ADR approval
- Wrapping `createHttpClient`, `StorageAdapter`, or `Logger` in a class only to name it a service
- Duplicating RTK Query endpoints or Saga workflows in shared packages
- Importing React, React Native, Redux, Axios, GraphQL clients, apps, or features into shared services
- Creating `@nexus/shared-services` without ADR evidence
- Inventing shared domain models or repository contracts to support speculative services
- `gen:service` before repeated approved service bundles exist

## Generator decision

No `gen:service` in Batch 1.9.

A service generator is justified only after repeated approved service bundles exist containing:

- Contract
- Factory
- Tests
- Barrel export
- Documentation

Do not add CLI placeholders.

## ADR triggers

Stop and raise an ADR Request before:

- Creating `@nexus/shared-services` or any new shared-services package
- Introducing a DI container, service locator, or service bus
- Changing package dependency direction to support a service layer
- Mandating that feature business logic move into shared packages
- Replacing Saga or RTK Query architecture with a shared service framework
- Depending on deferred repository contracts that Batch 1.8 did not add

Governance-only deferral does not require a new ADR.

## Future extension strategy

1. Prove a concrete cross-platform orchestration need with real call sites
2. Confirm it is not owned by env/storage/logging/network/RTK/Saga
3. Place a minimal factory in an existing approved package (prefer `@nexus/shared-utils` only when ownership is clear)
4. Inject approved contracts explicitly
5. Return `Result` / `AppError` for operational failures
6. Document ownership updates and technical-debt closure
7. Revisit `gen:service` only after repeated bundles exist

Do not begin Batch 1.10 from this document.

## Deferred service categories

Deferred unless repository evidence proves reuse:

- Authentication session service (shared)
- User / workspace / document / prompt / chat / AI / agent / MCP services
- Analytics / telemetry / feature-flag / remote-config services
- Offline synchronization service
- Platform health/status service
- Storage-backed preference service
- Request-context service
- Clock service
- Logging facade beyond existing helpers
- Retry orchestration beyond network policy

## Examples of current non-shared-service code

| Example                      | Location                                    | Classification                      |
| ---------------------------- | ------------------------------------------- | ----------------------------------- |
| `persistAuthSession` helpers | `apps/web/src/features/auth/services/`      | Feature-owned helpers               |
| `baseApi`                    | `apps/web/src/api/services/baseApi.ts`      | RTK Query shell                     |
| `authApi`                    | `apps/web/src/features/auth/api/authApi.ts` | Feature RTK endpoints               |
| `createHttpClient`           | `@nexus/shared-network`                     | Transport factory                   |
| `createWebLogger`            | `apps/web/src/platform/logging`             | App logging adapter                 |
| `createLocalStorageAdapter`  | `apps/web/src/platform/storage`             | App storage adapter                 |
| `createWebEnv` / `env`       | `apps/web/src/config/env.ts`                | Env adapter                         |
| `OfflineManager` (stub)      | `apps/web/src/api/offline/`                 | App stub — not shared orchestration |
| `StreamingManager` (stub)    | `apps/web/src/api/streaming/`               | App stub — not shared orchestration |

## Related documents

- Repository contracts: `docs/architecture/REPOSITORY_CONTRACTS.md`
- Domain models: `docs/architecture/DOMAIN_MODELS.md`
- Result and errors: `docs/architecture/RESULT_AND_ERRORS.md`
- Storage platform: `docs/architecture/STORAGE_PLATFORM.md`
- Logging platform: `docs/architecture/LOGGING_PLATFORM.md`
- Dependency rules: `docs/architecture/dependency-rules.md`
- Package ownership: `docs/sprint-0/package-ownership-matrix.md`
- Saga / state management: `docs/adr/ADR-0004-state-management.md`
- RTK Query: `docs/adr/ADR-0005-rtk-query.md`
