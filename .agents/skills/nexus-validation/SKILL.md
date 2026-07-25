---
name: nexus-validation
description: >-
  Validates changed Nexus frontend scope with required repository gates.
  Use before completing any implementation or review batch.
---

# nexus-validation

## Purpose

Validate the changed scope and satisfy repository-required final gates.

## Workflow

1. Validate the changed scope first (lint/type/tests for touched packages when diagnosing).
2. Before completion, run only the repository-required final gates:
   - `pnpm verify`
   - `git diff --check`
3. Run individual commands only to diagnose a failure.
4. Report failures with the failing gate and likely owner path.

## Constraints

- Do not skip required gates.
- Do not commit or push.
- Do not “fix” failures by weakening boundaries, ADR checks, or architecture rules.
- Prefer scoped diagnosis over re-running the full suite repeatedly.

## Expected output

- Commands run and pass/fail
- Failure summary (if any) with next fix action
- Confirmation that diff has no whitespace/conflict markers (`git diff --check`)
