# Generator Governance (Design System)

**Batch 2.7:** Define generators only. **Do not implement** Design System generators in this batch.

Existing Sprint 0 CLI (`scripts/generators`) remains for generic `component` / `hook` / `slice`. Design System–aware generators below are **standards for future implementation**.

---

## Recommendations

| Generator | Recommendation        | Notes                                                                                        |
| --------- | --------------------- | -------------------------------------------------------------------------------------------- |
| Primitive | **Required** (future) | Level 1 scaffolding into `@nexus/shared-ui`                                                  |
| Composite | **Required** (future) | Level 2 scaffolding; compose primitives                                                      |
| Pattern   | **Required** (future) | Level 3; only after promotion rules documented                                               |
| Screen    | **Deferred**          | Screens stay app/feature-owned; existing `screen` CLI placeholder is not Design System Ready |

Also deferred (unchanged): `story`, `test`, repository/service/model generators — see `scripts/generators/README.md`.

---

## Shared requirements (all Design System generators)

When implemented, every generator **must** produce or update:

| Artifact                | Requirement                                                                                                                                                                                          |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Folder structure        | `packages/shared-ui/src/components/<Name>/` (Patterns may use `patterns/<Name>/` **only if** introduced without renaming packages — prefer flat `components/` until volume justifies a folder split) |
| Exports                 | Package-root export via `components/index.ts` — never deep-import paths                                                                                                                              |
| Tests                   | Colocated `Name.test.tsx` with behavior coverage stubs                                                                                                                                               |
| Storybook story         | `apps/web/src/stories/<level>/Name.stories.tsx` with correct title prefix                                                                                                                            |
| Documentation           | Patch points / checklist reminder for `COMPONENTS.md`                                                                                                                                                |
| Accessibility checklist | Comment block or docs stub listing a11y exit criteria                                                                                                                                                |
| Maturity checklist      | Reference `DESIGN_SYSTEM_GOVERNANCE.md` lifecycle                                                                                                                                                    |

Output must obey path security (`docs/sprint-0/generator-security-checklist.md`).

---

## Primitive generator (spec)

**Target level:** 1 — Primitives

**Suggested tree:**

```text
packages/shared-ui/src/components/<Name>/
  Name.tsx
  Name.types.ts          # optional
  Name.test.tsx
  index.ts
apps/web/src/stories/primitives/<Name>.stories.tsx
```

**Must include:** token-only styling guidance comments; `testID` / a11y prop stubs; default + variant story stubs.

**Must not:** wire networking, Redux, or feature modules.

---

## Composite generator (spec)

**Target level:** 2 — Composites

**Suggested tree:** same as Primitive under `components/<Name>/`, story under `stories/composites/`.

**Must include:** composition from existing primitives; slot props documented; Form-like associations use Label/Input patterns when relevant.

**Must not:** add React Hook Form or API clients.

---

## Pattern generator (spec)

**Target level:** 3 — Patterns

**Suggested tree:** `components/<Name>/` + `stories/patterns/<Name>.stories.tsx`.

**Must include:** documented consumers count placeholder; promotion checklist; still no business domain types from features.

**Gate:** Do not run Pattern generator into shared-ui until Hybrid promotion criteria are met (`HYBRID_ENTERPRISE_ATOMIC.md`).

---

## Screen generator (spec — deferred)

**Target level:** 4 — Screens

**Location:** `apps/web` / `apps/mobile` feature folders — **not** `shared-ui`.

Existing CLI `screen` placeholder may later align with app folder rules; Design System Screen catalog in Storybook remains optional/deferred.

**Must not:** export screens from `@nexus/shared-ui`.

---

## Storybook story naming (generator output)

| Level     | `title`                                  |
| --------- | ---------------------------------------- |
| Primitive | `Primitives/<Name>`                      |
| Composite | `Composites/<Name>`                      |
| Pattern   | `Patterns/<Name>`                        |
| Screen    | `Screens/<Name>` (apps only, if enabled) |

---

## Implementation policy

1. Implementing any Design System generator requires a focused batch + tests (`pnpm test:generators`).
2. Generators must not invent new packages or providers.
3. Prefer extending `scripts/generators` with explicit `primitive` / `composite` / `pattern` commands over overloading the generic `component` generator without level flags.

---

## Related

- `scripts/generators/README.md` — current CLI reality
- `DESIGN_SYSTEM_GOVERNANCE.md` — lifecycle
- `STORYBOOK.md` — story requirements
- `PUBLIC_API_GOVERNANCE.md` — exports
