---
name: nexus-validation
description: >-
  User-owned validation for Nexus frontend changes. Report recommended
  commands; execute gates only when the user explicitly requests it or
  supplies a focused failure to fix.
---

# nexus-validation

## Purpose

Coordinate validation without spending agent usage on deterministic local gates.
The user runs lint, typecheck, tests, builds, and `pnpm verify` locally.

## Workflow (after implementation)

1. Do **not** run `pnpm verify`, lint, typecheck, tests, or builds unless the user explicitly asks.
2. Identify affected packages from the change set.
3. Report exact commands the user should run, for example:
   - `pnpm --filter <affected-package> typecheck`
   - `pnpm --filter <affected-package> test`
   - `git diff --check`
   - `pnpm verify`
4. State clearly: **validation not run — user-owned**.
5. Stop after reporting.

## Failure-fix workflow (when user returns a failure)

1. Inspect only the supplied failing command and error output.
2. Identify the smallest likely root cause.
3. Request additional files only when necessary.
4. Provide a targeted fix; do not redo unrelated implementation.
5. Instruct the user which single command to rerun.
6. Do not ask the user to rerun all gates until the focused failure is resolved.
7. Run the full validation suite only after targeted checks pass **and** the user requests it.

## Constraints

- Do not claim gates passed when they were not run.
- Do not retry validation speculatively.
- Do not “fix” failures by weakening boundaries, ADR checks, or architecture rules.
- Do not commit or push.

## Expected output

- Recommended validation commands (not executed, unless user asked)
- Explicit “validation not run — user-owned” (when gates were not run)
- On failure-fix: root cause, files changed, command to rerun
- Never: “all gates passed” / “validation successful” / “build verified” without user confirmation
