# ADR-0014: Hybrid Enterprise Atomic Organization

- Status: Accepted
- Date: 2026-07-22
- Deciders: Frontend platform / Sprint 2 Batch 2.7

## Context

Sprint 2 delivered Level 1 primitives and Level 2 composites in `@nexus/shared-ui`, plus Web Storybook hierarchy using those names. The organization needs a clear four-level model for future Patterns and Screens without adopting classical Atomic Design packaging or renaming packages.

## Decision

Adopt **Hybrid Enterprise Atomic** classification:

1. Level 1 — Primitives
2. Level 2 — Composites
3. Level 3 — Patterns
4. Level 4 — Screens

This is an **organizational refinement only**. It does **not** change package boundaries, dependency rules, provider/token/theme/Tamagui/responsive/accessibility ownership, or cross-platform strategy.

Patterns are not implemented in Sprint 2. Screens remain application-owned. Shared-ui continues as the single Design System package.

## Consequences

- Docs and Storybook use `Primitives` / `Composites` / `Patterns` / `Screens`.
- Generator governance may scaffold by level later; Batch 2.7 defines standards only.
- No new packages (`shared-patterns`, `ui-kit`) are created for this hierarchy.

## Related

- `docs/architecture/HYBRID_ENTERPRISE_ATOMIC.md`
- ADR-0012 (Tamagui / shared-ui ownership)
- ADR-0013 (Web Storybook)
