---
name: nexus-batch-execution
description: >-
  Implements an approved Nexus frontend batch with minimal scope.
  Use when executing or implementing a batch after assessment approval.
---

# nexus-batch-execution

## Purpose

Execute an approved batch against the existing architecture with the smallest safe change set.

## Workflow

1. Confirm batch ID, acceptance criteria, and out-of-scope items.
2. Read `AGENTS.md` and only the docs/files needed for this batch.
3. Apply `nexus-runtime-isolation` if engineering-platform or `@sujeetd7/ai-engineering-*` is involved.
4. Implement only in-scope paths. Reuse existing packages and patterns.
5. Add or update tests and documentation required by the batch.
6. Stop and report if an ADR, architecture change, or dependency update is required.
7. Apply `nexus-validation` for **reporting** recommended user commands — do not execute gates unless the user explicitly asks.
8. Stop after implementation and reporting.

## Constraints

- Do not expand scope beyond the batch.
- Do not modify unrelated features, screens, or services.
- Do not install packages or update lockfiles unless the batch explicitly requires it.
- Do not commit or push unless asked.
- Do not run full validation unless the user explicitly requests it.
- Architecture rules in `AGENTS.md` override local convenience.

## Expected output

- Implementation completed
- List of files created and modified
- Tests added or updated
- Documentation updated
- Validation not run — user-owned
- Recommended validation commands
- Assumptions, risks, unresolved issues
- Git status if inspected
- Blockers / deferred items (if any)
