# Sprint 3 Batch Map

Canonical scope map for Sprint 3 application runtime foundation. **Batch 3.1 is audit-only** — no production runtime implementation.

Reuse approved packages only. Do not introduce IoC containers, Module Federation, runtime plugin discovery, or new shared runtime packages.

---

## Batch 3.1 — Complete (Repository Audit & Runtime Baseline)

- Verified repository assessment (branch, commit, toolchain versions)
- Audited web/mobile bootstrap, providers, state, networking, navigation, shell
- Classified reusable infrastructure (Ready / Partial / Missing / Deferred / Application-owned)
- Confirmed package ownership and dependency rules unchanged
- Published runtime inventory
- **Out of scope:** any production runtime code, routes, shell UI, providers, features

See `docs/sprint-3/RUNTIME_INVENTORY.md` and `docs/sprint-3/BATCH_3_1_COMPLETION_REPORT.md`.

---

## Batch 3.2 — Complete (Bootstrap & Provider Foundation)

- Deterministic web/mobile bootstrap with structured outcomes
- Explicit HTTP client + store/Saga factories (idempotent)
- Provider parity: SharedUI + Redux (+ SafeArea mobile); depth ≤ 8
- Startup loading/failure UI; mobile ErrorBoundary
- Shared bootstrap contracts in `@nexus/shared-types`
- Syncpack Storybook script-order hygiene
- Docs: `APPLICATION_BOOTSTRAP.md`, `PROVIDER_COMPOSITION.md`
- **Out of scope:** navigation, shell layouts, feature state, auth UI, GraphQL React provider

See `docs/sprint-3/BATCH_3_2_COMPLETION_REPORT.md`.

---

## Batch 3.3 — Complete (Navigation & Application Shell)

- Web: React Router v7 `createBrowserRouter` + application shell + infrastructure routes
- Mobile: React Navigation native stack + `NavigationContainer` + application shell
- Shared navigation contracts in `@nexus/shared-types` (IDs, kind, guard decision)
- Route-level loading/error; deep-link readiness (mobile prefixes empty)
- Docs: `NAVIGATION_ARCHITECTURE.md`, `APPLICATION_SHELL.md`, provider composition update
- **Out of scope:** auth/RBAC, feature routes, dashboards, Batch 3.4 DI registry

See `docs/sprint-3/BATCH_3_3_COMPLETION_REPORT.md`.

---

## Batch 3.4 — Complete (Platform Extensibility Foundation)

- Typed dependency registry (`@nexus/shared-utils`) + contracts (`@nexus/shared-types`)
- Static feature manifest pipeline with duplicate/missing/cycle validation
- Platform extension placeholders (AI/MCP/Tool/Agent) — contracts only
- Bootstrap integration on web and mobile; registries sealed before providers
- Docs: `PLATFORM_EXTENSIBILITY.md`, bootstrap sequence update
- **Out of scope:** AI/MCP/agent/tool implementations, IoC, discovery, Batch 3.5

See `docs/sprint-3/BATCH_3_4_COMPLETION_REPORT.md`.

---

## Batch 3.5 — Complete (Sprint Validation & Closeout)

- Governance-only audit and validation of Batches 3.1–3.4
- Confirmed architecture freeze, provider depths, package ownership, and gate results
- Sprint 3 Completion Report published
- **Out of scope:** new runtime features, Sprint 4 product work

See `docs/sprint-3/BATCH_3_5_COMPLETION_REPORT.md` and `docs/sprint-3/SPRINT_3_COMPLETION_REPORT.md`.

---

## Stop conditions (all Sprint 3 batches)

- Do not expand into product features
- Do not create new shared runtime packages
- Do not introduce IoC / reflection / decorators / plugin discovery / Module Federation
- Overlay kit (TD-056) and native storage (TD-032) require architecture approval before implementation
