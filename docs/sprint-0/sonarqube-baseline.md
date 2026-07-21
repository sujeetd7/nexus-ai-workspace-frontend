# SonarQube Baseline

## Scope

Root `sonar-project.properties` defines the monorepo analysis baseline for:

- `apps/`
- `packages/`
- `scripts/`

Native Android/iOS trees and generated build artifacts are excluded.

## Sprint 0 status

| Item                                            | Status                                         |
| ----------------------------------------------- | ---------------------------------------------- |
| Root `sonar-project.properties`                 | Present                                        |
| Hosted SonarQube server / project binding       | Deferred                                       |
| CI scanner step                                 | Deferred                                       |
| `SONAR_TOKEN` / Sonar secrets in GitHub Actions | Deferred (do not add until scanner is enabled) |

## Deferred execution

Sprint 0 ships configuration only. Scanner execution is intentionally deferred because:

1. No hosted SonarQube endpoint is bound to this repository yet.
2. Quality CI must remain secret-free until scanner integration is approved.
3. Coverage report paths will be wired into CI when the scanner job is introduced.

Tracked as **TD-003** in `docs/technical-debt-register.md`.

## Local dry-run (optional)

When a SonarQube server and token are available:

```powershell
# Example only — not part of pnpm verify
sonar-scanner
```

Do not add scanner invocation to the default quality workflow until TD-003 is closed.
