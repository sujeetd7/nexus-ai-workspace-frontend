# ADR-0006: GraphQL transport via shared networking

- Status: Accepted
- Date: 2026-07-22
- Deciders: Frontend platform

## Context

The product requires GraphQL alongside REST. GraphQL `errors[]` payloads must normalize into the same error model as HTTP failures.

## Decision

Support GraphQL through `@nexus/shared-network` helpers built on the shared HTTP client.

- GraphQL `errors[]` map to `ApiError`.
- Platform clients supply base URL, auth, and unauthorized handling.

## Consequences

- REST and GraphQL share redaction, retries, and request IDs.
- App GraphQL adapters remain thin wrappers over the shared package.
- Partial-data GraphQL behavior remains documented as follow-up hardening.
