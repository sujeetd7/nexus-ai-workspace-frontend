# ADR-0005: RTK Query for server state

- Status: Accepted
- Date: 2026-07-22
- Deciders: Frontend platform

## Context

REST endpoints need caching, invalidation, and cancellation without duplicating Axios lifecycle code in every feature.

## Decision

Use **RTK Query** with a shared Axios base query from `@nexus/shared-network`.

- Apps provide platform adapters (token storage, unauthorized handling).
- Features inject endpoints onto a shared `baseApi`.

## Consequences

- Transport concerns stay in the networking package.
- Features depend on API modules, not Axios directly.
- Cancellation signals from RTK Query are forwarded to Axios.
