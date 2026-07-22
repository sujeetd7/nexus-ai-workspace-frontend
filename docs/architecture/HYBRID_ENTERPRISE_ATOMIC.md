# Hybrid Enterprise Atomic Organization

**Status:** Adopted (Sprint 2 — Batch 2.7)  
**Scope:** Organizational classification only  
**ADR:** [ADR-0014](../adr/ADR-0014-hybrid-enterprise-atomic.md)

## Architecture confirmation

Hybrid Enterprise Atomic Design **does not** change:

| Concern                 | Unchanged owner / rule                     |
| ----------------------- | ------------------------------------------ |
| Package boundaries      | `@nexus/shared-ui` remains the UI package  |
| Dependency rules        | Existing `dependency-rules.md` / ADR-0009  |
| Provider ownership      | `SharedUIProvider` only                    |
| Token ownership         | `shared-ui` `src/theme/*`                  |
| Theme ownership         | Theme engine in `shared-ui`                |
| Tamagui ownership       | `@tamagui/core` via `shared-ui` (ADR-0012) |
| Responsive ownership    | `shared-ui` `src/responsive/*`             |
| Accessibility ownership | `shared-ui` `src/accessibility/*`          |
| Cross-platform strategy | Web + React Native via shared-ui           |

Do **not** rename packages, split `shared-ui`, or invent `shared-patterns` / `ui-kit` packages for this hierarchy.

---

## Hierarchy

```text
Level 1 — Primitives
Level 2 — Composites
Level 3 — Patterns
Level 4 — Screens
```

Avoid classical Atomic labels (atoms/molecules/organisms) in Nexus docs and Storybook titles. Use the names above.

| Level | Name           | Purpose                                                      | Lives in                                                                     | Allowed dependencies                                    |
| ----- | -------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------- | ------------------------------------------------------- |
| 1     | **Primitives** | Smallest reusable UI building blocks                         | `@nexus/shared-ui`                                                           | Tokens, theme, a11y/responsive helpers, `@tamagui/core` |
| 2     | **Composites** | Compositions of primitives with no product business logic    | `@nexus/shared-ui`                                                           | Primitives + same foundations                           |
| 3     | **Patterns**   | Recurring UX compositions (search, empty state, filter bars) | `@nexus/shared-ui` when ≥2 real consumers; else feature-owned until promoted | Primitives + Composites                                 |
| 4     | **Screens**    | Route/page-level compositions                                | `apps/web`, `apps/mobile` (feature-owned)                                    | Shared-ui public API + app state/features               |

---

## Responsibilities

### Level 1 — Primitives

- Token-backed styling; platform-correct semantics (e.g. native `<button>` / `Pressable`)
- No business rules, networking, or feature IDs
- Maturity: full Level 1 checklist in `DESIGN_SYSTEM.md` / `DESIGN_SYSTEM_GOVERNANCE.md`

### Level 2 — Composites

- Compose primitives; optional slots; still no business logic
- Accessible relationships (e.g. FormField label/input/error)
- Maturity: Level 2 checklist (includes composition + Storybook)

### Level 3 — Patterns

- Solve a repeated UX problem across features
- Still no feature-specific domain models or API calls inside shared-ui
- **Not implemented in Sprint 2** — examples only until promotion criteria are met

### Level 4 — Screens

- Own routing, data loading, feature state
- Consume shared-ui via package root only
- **Deferred** for shared cataloguing; screens stay in apps

---

## Ownership

| Layer                    | Product owner                        | Engineering owner                      |
| ------------------------ | ------------------------------------ | -------------------------------------- |
| Primitives / Composites  | Design System                        | Frontend platform (`@nexus/shared-ui`) |
| Patterns (shared)        | Design System + feature stakeholders | Frontend platform after promotion      |
| Patterns (feature-local) | Feature team                         | Feature team                           |
| Screens                  | Feature / product                    | App owners (`apps/web`, `apps/mobile`) |

Promotion of a feature pattern into `@nexus/shared-ui` requires demonstrated reuse (≥2 consumers), Design System review, and public-API export discipline — see `DESIGN_SYSTEM_GOVERNANCE.md`.

---

## Maturity expectations (summary)

| Level                 | Ready means                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------ |
| Primitive / Composite | Implementation + tests + docs + a11y + theme + responsive (as applicable) + Storybook + manager review |
| Pattern               | Same as Composite, plus documented composition contract and promotion evidence                         |
| Screen                | App quality gates; Storybook Screen category optional / deferred (TD-057 for RN)                       |

Full checklists: `DESIGN_SYSTEM_GOVERNANCE.md`.

---

## Related

- `DESIGN_SYSTEM.md` — architecture and ownership of foundations
- `COMPONENTS.md` — inventory and classification of shipped components
- `STORYBOOK.md` — story hierarchy `Primitives` / `Composites` / `Patterns` / `Screens`
- `GENERATOR_GOVERNANCE.md` — generators for levels (define only in Batch 2.7)
- `PUBLIC_API_GOVERNANCE.md` — export and versioning rules
