# ADR-0010: Defer Storybook

- Status: Accepted
- Date: 2026-07-22
- Deciders: Frontend platform / CTO review

## Context

Interactive component documentation is valuable, but Sprint 0 prioritizes monorepo, CI, generators, and networking foundations.

## Decision

Defer Storybook (and related visual documentation tooling) beyond Sprint 0.

Tracked as technical debt **TD-002**.

## Consequences

- Shared UI relies on unit tests and package exports for now.
- Design-system documentation remains a later sprint commitment.
- No Storybook CI surface area during Sprint 0.
