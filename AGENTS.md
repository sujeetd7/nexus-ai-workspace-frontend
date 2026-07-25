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
| `nexus-validation`          | Validate changed scope before completion        |

## Default operating rules

- Inspect only paths required for the current batch.
- Prefer the smallest change that satisfies acceptance criteria.
- Do not install packages, update lockfiles, or configure secrets unless the batch requires it.
- Do not commit or push unless the user explicitly asks.
- Before completion, follow `nexus-validation` (required gates: `pnpm verify`, `git diff --check`).

## Response discipline

Return only: changed files, validation results, and blockers — unless the user asks for more.
