# ADR-0013: Adopt Web Storybook for Design System

- Status: Accepted
- Date: 2026-07-22
- Deciders: Frontend platform / Sprint 2 Batch 2.6
- Supersedes: ADR-0010 (web Storybook deferral only)

## Context

ADR-0010 deferred Storybook beyond Sprint 0. Sprint 2 Batch 2.6 requires an official Design System development environment for completed Level 1 and Level 2 components.

React Native Storybook remains out of scope (separate native toolchain and peer surface).

## Decision

1. Adopt **Storybook for Web only** under `apps/web` (`storybook` + `@storybook/react-vite`).
2. Stories wrap production components with **`SharedUIProvider` only** — never expose `TamaguiProvider`.
3. Organize stories as `Primitives/*` and `Composites/*` matching Sprint 2 hierarchy.
4. Include `@storybook/addon-docs` and `@storybook/addon-a11y` for docs and lightweight accessibility checks.
5. Keep Storybook as **dev/build tooling** — must not leak into the production web application bundle.
6. React Native Storybook remains deferred (tracked as residual TD-002 / RN note).

## Consequences

- `pnpm storybook` / `pnpm storybook:build` are first-class scripts; `verify` includes `storybook:build`.
- ADR-0010 is superseded for **web** Storybook; RN Storybook deferral continues.
- TD-002 is closed for web interactive documentation; RN Storybook remains an open residual if listed separately.
