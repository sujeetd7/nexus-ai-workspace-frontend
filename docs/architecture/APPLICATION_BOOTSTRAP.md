# Application Bootstrap

Sprint 3 Batch 3.2 (+ Batch 3.4 registration) — deterministic application bootstrap for Web and React Native.

## Purpose

Establish a single, idempotent startup sequence that:

1. validates public configuration;
2. creates logging;
3. prepares optional storage (web theme);
4. creates the HTTP client once;
5. creates the Redux store once and starts the root Saga once;
6. registers platform dependencies and static feature manifests (Batch 3.4);
7. renders providers only after critical initialization succeeds.

## Ownership

| Concern                                                                         | Owner                                     |
| ------------------------------------------------------------------------------- | ----------------------------------------- |
| Bootstrap contracts (`BootstrapStatus`, `BootstrapFailure`, `BootstrapOutcome`) | `@nexus/shared-types`                     |
| Registry / feature / extension contracts                                        | `@nexus/shared-types`                     |
| Typed registry + feature graph helpers                                          | `@nexus/shared-utils`                     |
| Orchestration                                                                   | `apps/web`, `apps/mobile`                 |
| Env adapters                                                                    | App `config/`                             |
| Logger / storage / HTTP factories                                               | App `platform/` + `@nexus/shared-network` |
| Store factories                                                                 | App `store/`                              |
| Platform registration                                                           | App `platform/registry/`                  |

No `@nexus/app-platform` package. No IoC container.

## Sequence

```text
1. Read and validate environment / public config   (critical)
2. Create logger from validated config               (critical)
3. Prepare theme storage (web)                       (optional)
4. Create HTTP client once                           (critical)
5. Create store + start root Saga once               (critical)
6. Register platform services + features; seal       (critical — Batch 3.4)
7. Resolve BootstrapOutcome
8. Render provider composition when ready
```

## Critical vs optional

| Task                               | Class    | Failure behaviour                           |
| ---------------------------------- | -------- | ------------------------------------------- |
| Invalid public config              | Critical | `status: "failed"`, safe message, retryable |
| Logger / HTTP / store construction | Critical | Structured failure; no provider tree        |
| Platform registration              | Critical | `REGISTRATION_FAILED`; no provider tree     |
| Theme `localStorage` adapter (web) | Optional | Warn and continue with no-op storage        |
| Network round-trip at startup      | N/A      | Not performed                               |

## Idempotency

`bootstrapWebApp` / `bootstrapMobileApp` cache a successful runtime. Retry clears the cache and HTTP singleton only after failure (or via test reset helpers).

## GraphQL

Transport clients remain available (web). No GraphQL React provider — deferred until an approved consumer requires one (ADR-0006). GraphQL is listed as a future registry key but is not registered until an approved bootstrap-owned client exists.

## Lifecycle

Batch 3.2 implements one-time startup, ready/failed outcomes, and test/reset cleanup only. AppState / visibility listeners are deferred until a runtime consumer exists.

Batch 3.4 adds feature lifecycle hooks (`register` → `initialize` → `ready`) for statically declared manifests. See `PLATFORM_EXTENSIBILITY.md`.
