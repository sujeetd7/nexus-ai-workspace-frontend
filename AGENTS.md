# Nexus AI Workspace Frontend — Agent Instructions

Shared source of truth for Cursor, GitHub Copilot, and Claude Code.
Tool adapters (`.cursor/`, `.github/`, `CLAUDE.md`) must stay thin and reference this file plus `.agents/skills/`.

## Project

- pnpm monorepo: `apps/*`, `packages/*`, `tooling/*`
- Apps: `apps/web` (React), `apps/mobile` (React Native)
- Shared packages: `@nexus/shared-ui`, `@nexus/shared-types`, `@nexus/shared-utils`, `@nexus/shared-validation`, `@nexus/shared-network`
- Engineering platform consumer: `tooling/engineering-platform/` only (`@sujeetd7/ai-engineering-*@0.1.1`)
- Canonical docs: `docs/architecture/`, `docs/setup/`, `IMPLEMENTATION_STATUS.md`

## Architecture (non-negotiable)

1. Preserve existing architecture, ownership, and dependency boundaries.
2. Reuse existing infrastructure and components; do not invent duplicate abstractions.
3. Apps depend on `@nexus/*` public APIs only — no deep imports (`@nexus/*/src/...`).
4. Packages must not import apps. Apps must not import other apps.
5. Features must not import other features.
6. Axios / HTTP / GraphQL helpers live only in `@nexus/shared-network` (plus approved web API adapters).
7. UI tokens, Tamagui config, theme, responsive, a11y, and primitives/composites live only in `@nexus/shared-ui`.
8. Use Tamagui via `@nexus/shared-ui`. Do not add MUI, Tailwind, or a second token system.
9. Hybrid Enterprise Atomic levels: Primitives → Composites → Patterns → Screens (organizational only).
10. Provider depth ≤ 8. Do not add providers, IoC containers, or Module Federation without an approved ADR.
11. Keep `@sujeetd7/ai-engineering-*` imports out of product runtime (`apps/*`, `@nexus/shared-ui`).
12. Do not modify published platform APIs. Stop and report when an ADR is required.
13. Figma MCP / Code Connect / OpenAPI / AI Runtime remain deferred unless a batch explicitly enables them.

## Skills

Reusable workflows live in `.agents/skills/`:

| Skill                       | Use when                                        |
| --------------------------- | ----------------------------------------------- |
| `nexus-readonly-assessment` | Assess a batch without code changes             |
| `nexus-batch-execution`     | Implement an approved batch                     |
| `nexus-runtime-isolation`   | Touch engineering-platform or AI packages       |
| `nexus-design-to-code`      | Implement from Figma                            |
| `nexus-openapi-integration` | Wire OpenAPI / generated clients (when enabled) |
| `nexus-validation`          | User-owned validation reporting & failure-fix   |

## User-owned validation (CTO directive)

Repository validation is executed by the user locally. Agents must not run full validation suites unless the user explicitly requests it.

Applies to all remaining P2–P5 and frontend product batches unless explicitly overridden.

### Developer must

- Inspect approved scope; implement only the approved batch; reuse existing implementations.
- Add or update tests and documentation required by the batch.
- Report files created/modified, assumptions, risks, and unresolved issues.
- Provide exact validation commands for the user.
- Stop after implementation and reporting.

### Developer must not

- Run full validation (`pnpm verify`, lint, typecheck, tests, builds) unless the user explicitly requests it.
- Retry validation speculatively or spend agent usage on deterministic gates.
- Commit or push unless the user explicitly asks.
- Claim validation passed when it was not run.

### User runs locally (adjust filters to affected packages)

```powershell
pnpm --filter <affected-package> typecheck
pnpm --filter <affected-package> test
git diff --check
pnpm verify
```

### Failure-fix workflow

1. Inspect only the supplied failure.
2. Identify the smallest likely root cause; request extra files only when necessary.
3. Provide a targeted fix; do not redo unrelated implementation.
4. Instruct the user which single command to rerun.
5. Run the full suite only after targeted checks pass and the user requests full validation.

### Completion report language

Report: implementation completed; tests added/updated; docs updated; **validation not run — user-owned**; recommended commands; known risks; git status if inspected.

Do not write “all gates passed”, “validation successful”, or “build verified” unless the user later confirms those results.

## Senior manager batch output

Every batch prompt must include:

1. Exact repository and package scope
2. Files to inspect
3. Files to create
4. Files to modify
5. Implementation requirements
6. Tests to add or update
7. Documentation requirements
8. Expected file-change summary
9. Validation commands for the user
10. Expected results
11. Stop conditions
12. Completion-report format

Do not include instructions requiring the developer to execute validation.

## Default operating rules

- Inspect only paths required for the current batch.
- Prefer the smallest change that satisfies acceptance criteria.
- Do not install packages, update lockfiles, or configure secrets unless the batch requires it.
- Do not commit or push unless the user explicitly asks.
- Before completion, follow `nexus-validation` (report recommended user commands; do not execute gates unless asked).

## Response discipline

Return only: changed files, recommended validation commands, assumptions/risks/blockers — unless the user asks for more.
