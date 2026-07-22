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

## Batch 3.3 — Planned (Navigation Foundation)

NavigationContainer / React Router route tables only — **not started**.

---

## Stop conditions (all Sprint 3 batches)

- Do not expand into product features
- Do not create new shared runtime packages
- Do not introduce IoC / reflection / decorators / plugin discovery / Module Federation
- Overlay kit (TD-056) and native storage (TD-032) require architecture approval before implementation
