---
name: nexus-readonly-assessment
description: >-
  Read-only assessment of a Nexus frontend batch. Use when assessing,
  planning, or scoping work without modifying code.
---

# nexus-readonly-assessment

## Purpose

Produce a grounded, read-only assessment of a batch before implementation.

## Workflow

1. Identify batch ID, goals, and claimed acceptance criteria.
2. Inspect only allowed / relevant docs and paths for that batch.
3. Compare intent against `AGENTS.md`, `IMPLEMENTATION_STATUS.md`, and architecture docs.
4. Classify each proposed change: allowed, constrained, deferred, or ADR-required.
5. Call out runtime-isolation risks for engineering-platform work.
6. Do not edit files.

## Constraints

- Read-only: no code, config, dependency, or lockfile changes.
- Do not invent features, routes, providers, or packages.
- Prefer evidence from repo docs over assumptions.
- Keep the assessment concise and decision-oriented.

## Expected output

- Batch fit / readiness verdict
- In-scope vs out-of-scope
- Risks and ADR triggers
- Recommended implementation order
- Explicit “do not touch” list
