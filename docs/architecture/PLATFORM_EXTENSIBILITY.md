# Platform Extensibility

Sprint 3 Batch 3.4 — typed registration and extension contracts for future Sprint 4 AI / MCP / Tool / Agent work.

## Purpose

Provide a **deterministic, fully typed** registration foundation without IoC containers, reflection, decorators, runtime plugin discovery, or Module Federation.

## Ownership

| Concern                                                                                          | Owner                     |
| ------------------------------------------------------------------------------------------------ | ------------------------- |
| Service keys, feature manifests, lifecycle stages, extension contracts, registration error codes | `@nexus/shared-types`     |
| Typed dependency registry + feature graph validation pipeline                                    | `@nexus/shared-utils`     |
| Platform service registration + static feature lists + bootstrap wiring                          | `apps/web`, `apps/mobile` |

**Not created:** `@nexus/app-platform`, IoC container, service locator, dynamic module loading.

## Bootstrap order (Batch 3.4)

```text
Bootstrap
  → Config / Logger / Storage (web) / HTTP / Store
  → Dependency Registry + Feature Registration + Extension Registry (seal)
  → SharedUI
  → Redux
  → Router / Navigation
  → Application Shell
```

Registration runs inside the existing bootstrap orchestrators **before** providers mount. Provider composition and depths are unchanged (web 5, mobile 6).

## Dependency registry

- Generic `createDependencyRegistry<TMap>()`
- `register` / `resolve` / `tryResolve` / `has`
- Duplicate key rejection
- Missing key rejection on `resolve`
- Explicit `seal()` — read-only registration afterward; resolution remains available
- Registration order retained via `getRegistrationOrder()`

## Feature manifests

Static `FeatureManifest` arrays per application (`WEB_FEATURE_MANIFESTS` / `MOBILE_FEATURE_MANIFESTS`).

Batch 3.4 lists are **empty** — framework + validation only. No product features.

Pipeline: validate graph → `register` → `initialize` → `onReady` (dependency order).  
`onDispose` is contracted for future shutdown work (not invoked at bootstrap).

## Platform extension slots

Typed placeholders only:

- AI Provider
- MCP Provider
- Tool Registry
- Agent Registry

Empty extension registries are sealed at bootstrap. No implementations.

## Forbidden

- Authentication / RBAC registration
- AI / MCP / agent / tool execution
- Runtime discovery / marketplace plugins
- Decorators / reflection / IoC
- New React providers for the registry

See also: `APPLICATION_BOOTSTRAP.md`, `SHARED_SERVICES.md` (TD-045: no DI container).
