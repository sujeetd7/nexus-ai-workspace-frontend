# Validate Changes

Coordinate validation for the current change set (user-owned by default).

1. Follow `AGENTS.md`.
2. Apply skill `.agents/skills/nexus-validation`.
3. Unless the user explicitly asks to run gates: report recommended commands only and state validation not run — user-owned.
4. If the user supplies a failure: fix only that failure, then instruct which command to rerun.
5. Run full gates only when the user explicitly requests it.
