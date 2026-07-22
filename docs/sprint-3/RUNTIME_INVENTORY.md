# Sprint 3 — Runtime Inventory

Capability inventory for Sprint 3. Batch 3.1 established the baseline; Batch 3.2 updated bootstrap/providers; **Batch 3.3 updated navigation and application shells**.

Classifications: **Ready** | **Partially implemented** | **Missing** | **Duplicate** | **Application-owned** | **Deferred**.

---

## Capability matrix (Batch 3.3)

| Capability                  | Classification        | Owner / location                       | Notes                                       |
| --------------------------- | --------------------- | -------------------------------------- | ------------------------------------------- |
| Bootstrap (web)             | Ready                 | `apps/web` bootstrap orchestrator      | Unchanged from 3.2                          |
| Bootstrap (mobile)          | Ready                 | `apps/mobile` bootstrap orchestrator   | Unchanged from 3.2                          |
| Configuration               | Ready                 | shared-types/validation + app adapters |                                             |
| Logging                     | Ready                 | shared-utils + app adapters            |                                             |
| Storage (web theme)         | Ready                 | web platform storage                   |                                             |
| Storage (mobile durable)    | Deferred              | —                                      | TD-032 / TD-051                             |
| Networking (web/mobile)     | Ready                 | shared-network + app factories         |                                             |
| Redux / Saga / RTK (web)    | Ready                 | `createAppStore`                       | No feature reducers added                   |
| Redux / Saga / RTK (mobile) | Ready                 | `createAppStore`                       | `api` only                                  |
| GraphQL transport           | Ready                 | shared-network + web client            |                                             |
| GraphQL React provider      | Deferred              | —                                      | No approved consumer                        |
| Routing (web)               | Ready                 | `apps/web` router + shell              | Infrastructure routes only                  |
| Navigation (mobile)         | Ready                 | `apps/mobile` navigation + shell       | Native stack; one NavigationContainer       |
| Shared route contracts      | Ready                 | `@nexus/shared-types` navigation       | IDs / kind / guard decision                 |
| Shell / layouts             | Ready                 | app-owned shells                       | Neutral chrome; no product UI               |
| ErrorBoundary               | Ready                 | web + mobile                           |                                             |
| Startup loading/failure     | Ready                 | both apps                              | Distinct from route loading                 |
| Route loading / errors      | Ready                 | web (+ mobile screen fallbacks)        | RR `errorElement`; NotFound distinct        |
| Deep-link readiness         | Partially implemented | web history + mobile linking config    | Mobile prefixes empty until approved scheme |
| SharedUI / SafeArea         | Ready                 | shared-ui / mobile                     | Depth ≤ 8                                   |
| Feature registration        | Partially implemented | injectEndpoints                        | Unchanged                                   |
| DI registry                 | Deferred              | factories only                         | Batch 3.4                                   |

Provider depths: **Web 5**, **Mobile 6** (limit ≤ 8).

See also `docs/architecture/NAVIGATION_ARCHITECTURE.md`, `APPLICATION_SHELL.md`, `PROVIDER_COMPOSITION.md`.

---

## Batch 3.2 historical notes

The Batch 3.2 matrix and Batch 3.1 narrative remain below for reference.

---

## Capability matrix (Batch 3.2)

| Capability                  | Classification        | Owner / location                       | Notes                               |
| --------------------------- | --------------------- | -------------------------------------- | ----------------------------------- |
| Bootstrap (web)             | Ready                 | `apps/web` bootstrap orchestrator      | Idempotent `bootstrapWebApp`        |
| Bootstrap (mobile)          | Ready                 | `apps/mobile` bootstrap orchestrator   | Parity; no navigation               |
| Configuration               | Ready                 | shared-types/validation + app adapters | Web lazy env getters                |
| Logging                     | Ready                 | shared-utils + app adapters            | Wired into bootstrap                |
| Storage (web theme)         | Ready                 | web platform storage                   | Optional failure tolerated          |
| Storage (mobile durable)    | Deferred              | —                                      | TD-032 / TD-051                     |
| Networking (web/mobile)     | Ready                 | shared-network + app factories         | Created once at bootstrap           |
| Redux / Saga / RTK (web)    | Ready                 | `createAppStore`                       | Preserves pre-existing auth reducer |
| Redux / Saga / RTK (mobile) | Ready                 | `createAppStore`                       | `api` only — no auth                |
| GraphQL transport           | Ready                 | shared-network + web client            |                                     |
| GraphQL React provider      | Deferred              | —                                      | No approved consumer                |
| Routing (web)               | Partially implemented | BrowserRouter catch-all                | Batch 3.3                           |
| Navigation (mobile)         | Missing               | —                                      | Batch 3.3                           |
| ErrorBoundary               | Ready                 | web + mobile                           |                                     |
| Startup loading/failure     | Ready                 | both apps                              | shared-ui primitives                |
| SharedUI / SafeArea         | Ready                 | shared-ui / mobile                     | Depth ≤ 8                           |
| Feature registration        | Partially implemented | injectEndpoints                        | Unchanged                           |
| DI registry                 | Deferred              | factories only                         | Batch 3.4                           |

See also `docs/architecture/APPLICATION_BOOTSTRAP.md` and `PROVIDER_COMPOSITION.md`.

---

## Batch 3.1 historical notes

The remainder of this file retains the Batch 3.1 detailed audit narrative for reference.

---

## Capability matrix

| Capability                    | Classification                | Owner / location                                                       | Notes                                                                    |
| ----------------------------- | ----------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Bootstrap (web)               | Ready                         | `apps/web` `main.tsx` → `bootstrap/bootstrap.tsx`                      | StrictMode → ErrorBoundary → providers → Suspense → router               |
| Bootstrap (mobile)            | Partially implemented         | `apps/mobile` `index.js` → `App.tsx`                                   | RN template + SafeArea + SharedUI; no app bootstrap module               |
| Configuration                 | Ready                         | `@nexus/shared-types` + `@nexus/shared-validation` + app adapters      | Web Vite env; mobile typed `publicConfig` (TD-016)                       |
| Logging                       | Ready                         | `@nexus/shared-types` / `@nexus/shared-utils` + app `platform/logging` | Mobile logger Ready but not imported by `App.tsx`                        |
| Storage (contracts/helpers)   | Ready                         | `@nexus/shared-types` / `@nexus/shared-utils`                          | String KV helpers + memory adapter                                       |
| Storage (web adapter)         | Ready / Application-owned     | `apps/web/src/platform/storage`                                        | Theme uses adapter; auth tokens still feature `localStorage` (TD-031)    |
| Storage (mobile durable)      | Deferred                      | —                                                                      | TD-032 / TD-051 / TD-008                                                 |
| Networking (shared)           | Ready                         | `@nexus/shared-network`                                                | HTTP/GraphQL helpers, Axios, RTK base query, redaction                   |
| Networking (web clients)      | Ready                         | `apps/web/src/api/client`, `api/graphql`                               | Module-init REST client; GraphQL client exists, not in provider tree     |
| Networking (mobile)           | Missing / Deferred            | —                                                                      | No client; TD-039                                                        |
| Redux store (web)             | Partially implemented         | `apps/web/src/store`                                                   | Live: `auth` + `baseApi`; orphan slices `app`/`ui`/`workspace`           |
| Redux (mobile)                | Missing                       | —                                                                      | No store deps                                                            |
| Redux Saga (web)              | Partially implemented         | `apps/web/src/store`                                                   | Middleware + empty `networkSaga`; empty auth/app/workspace saga files    |
| Redux Saga (mobile)           | Missing                       | —                                                                      |                                                                          |
| RTK Query (web)               | Partially implemented         | `apps/web` `baseApi`                                                   | Empty endpoints shell; `authApi.injectEndpoints` exists but unwired      |
| RTK Query (mobile)            | Missing                       | —                                                                      |                                                                          |
| GraphQL transport             | Ready                         | `@nexus/shared-network` + web `api/graphql`                            | Shared helpers + web client                                              |
| GraphQL React provider        | Missing                       | —                                                                      | No Apollo/urql; ADR-0006 is transport-only                               |
| Routing (web)                 | Partially implemented         | `react-router-dom` ^7.18.1                                             | Catch-all NotFound; empty public/private `RouteConfig` arrays            |
| Navigation (mobile)           | Missing                       | —                                                                      | No `@react-navigation/*`                                                 |
| Shared route contracts        | Partially implemented         | `apps/web` `RouteConfig`                                               | Web-only type with lazy + auth/roles fields; unused by `AppRouter`       |
| Lifecycle (web)               | Missing                       | —                                                                      | No mount init / session restore                                          |
| Lifecycle / AppState (mobile) | Missing                       | —                                                                      |                                                                          |
| Loading                       | Partially implemented         | `apps/web` `pages/Loading`                                             | Suspense fallback only; `ui.globalLoader` unwired                        |
| ErrorBoundary                 | Application-owned / Partially | Web Ready; mobile Missing                                              | Web root class boundary                                                  |
| Suspense                      | Partially implemented         | Web only                                                               | No lazy route children yet                                               |
| SharedUI / theme              | Ready                         | `@nexus/shared-ui`                                                     | Matches approved provider hierarchy                                      |
| SafeArea                      | Application-owned / Ready     | `apps/mobile`                                                          | Outer `SafeAreaProvider`                                                 |
| Shell / layouts               | Partially implemented         | `apps/web` layouts                                                     | Pass-through stubs; not wired to router; mobile has no layouts           |
| Feature registration          | Partially implemented         | RTK `injectEndpoints` only                                             | No manifests/plugins; `authApi` inactive until imported                  |
| Dependency registry / DI      | Deferred / Missing            | Factories only                                                         | TD-045 — no IoC; future typed registry must use approved packages        |
| Testing helpers               | Ready                         | `@nexus/shared-ui/testing`, `@nexus/shared-utils` testing              | Plus app/platform tests                                                  |
| Generators                    | Partially implemented         | `scripts/generators`                                                   | component/hook/slice Ready; screen/feature/api/graphql/saga placeholders |
| Streaming                     | Deferred                      | `apps/web/src/api/streaming`                                           | Explicit stubs                                                           |
| Offline                       | Partially implemented         | `apps/web/src/api/offline`                                             | Stub; unused by bootstrap                                                |

---

## Provider composition (approved vs current)

### Approved target (`docs/architecture/DESIGN_SYSTEM.md`)

**Web**

```text
SharedUIProvider
  └── ReduxProvider
        └── application
```

**Mobile**

```text
SafeAreaProvider
  └── SharedUIProvider
        └── application
```

### Current (verified)

**Web** (application adds ErrorBoundary / Suspense / Router around/inside approved UI+Redux shell):

```text
StrictMode
  └── ErrorBoundary                    (application-owned)
        └── SharedUIProvider           (shared-ui; + localStorage theme)
              └── ReduxProvider        (application-owned store)
                    └── Suspense       (application-owned)
                          └── BrowserRouter / Routes
```

**Mobile:**

```text
SafeAreaProvider
  └── SharedUIProvider                 (no storage persistence)
        └── StatusBar + NewAppScreen
```

| Concern          | Ownership                   | Status                                      |
| ---------------- | --------------------------- | ------------------------------------------- |
| SharedUIProvider | `@nexus/shared-ui`          | Ready — both apps                           |
| Redux            | `apps/web`                  | Ready on web; Missing on mobile             |
| RTK Query        | Via Redux store / `baseApi` | Partially (web shell)                       |
| GraphQL provider | N/A (transport client only) | Missing as React provider (by design today) |
| Router           | `apps/web`                  | Partially                                   |
| SafeArea         | `apps/mobile`               | Ready                                       |
| ErrorBoundary    | Application                 | Web Ready; mobile Missing                   |
| Suspense         | Application                 | Web Partially; mobile Missing               |

**Provider depth:** Web ≈ 6 meaningful layers (StrictMode + EB + SharedUI internals + Redux + Suspense + Router). Mobile ≈ 4 UI providers (SafeArea → Tamagui → ThemeProvider → Theme). No duplicate SharedUI/Redux providers found.

---

## Startup order

### Web

1. Module load: `env` parse (throws on invalid public config)
2. Module load: `webLogger` singleton
3. Module load (via store import chain): REST `axiosClient`, `configureStore`, `sagaMiddleware.run(rootSaga)`
4. Module load: theme `createLocalStorageAdapter()` in `AppProviders`
5. Render: ErrorBoundary → SharedUI → Redux → Suspense → AppRouter

**Side effects / risks:** Eager env throw; store/network created at import time; GraphQL client only if its module is imported; duplicate interceptor modules under `api/interceptors` vs shared-network (TD-038); orphan `App.tsx`.

### Mobile

1. Native bootstrap → `AppRegistry` (`index.js`)
2. Render: SafeArea → SharedUI → template screen
3. Config/logger modules exist but are **not** on the App render path

---

## Application state (web)

| Piece            | Status                                                                                                                                          |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `configureStore` | Ready                                                                                                                                           |
| `rootReducer`    | `auth` + `api` only                                                                                                                             |
| Orphan slices    | `app`, `ui`, `workspace` — present, not registered                                                                                              |
| Saga middleware  | Ready; `networkSaga` empty                                                                                                                      |
| `baseApi`        | Empty endpoint shell — **Sprint 3 can bootstrap without feature reducers** if `auth` is removed later; today auth feature reducer is registered |
| Persistence      | No redux-persist                                                                                                                                |
| Test utilities   | Platform/API tests; no dedicated store harness                                                                                                  |

---

## Feature registration & DI

- **No** manifests, plugin discovery, Module Federation, or dynamic reducer registry.
- Existing pattern: RTK Query `baseApi.injectEndpoints` (feature-owned); inactive until imported.
- DI: factory functions + explicit options (`createHttpClient`, `createWebLogger`, `SharedUIProvider` storage). No container (TD-045).
- Future lightweight typed registry (if approved): place factories/contracts in existing packages (`shared-types` contracts, `shared-utils` factories, app composition roots) — **do not** add IoC packages.

---

## Package ownership (confirmed)

Unchanged from `docs/sprint-0/package-ownership-matrix.md`. Logging, storage, and configuration remain capabilities across approved packages + app adapters — **not** separate packages.
