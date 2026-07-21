# ADR-0004: Application state with Redux Toolkit

- Status: Accepted
- Date: 2026-07-22
- Deciders: Frontend platform

## Context

The web application needs predictable client state for auth/session and UI orchestration while keeping server cache separate.

## Decision

Use **Redux Toolkit** for application/client state, with Redux Saga available for long-running orchestration workflows.

Feature domain contracts used by slices live in shared app layers (for example store types), not behind cross-feature imports.

## Consequences

- Client state has a single store composition path.
- Server/async API cache is handled by RTK Query (see ADR-0005), not ad-hoc slice fetching.
- Generators can scaffold slices consistently.
