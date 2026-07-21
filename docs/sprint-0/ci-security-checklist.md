# CI Security Checklist

## Permissions

- [x] Workflow declares `contents: read`
- [ ] No job has unnecessary write permissions
- [ ] Future release workflows use separate permissions
- [ ] Fork pull requests cannot access protected secrets

## Actions

- [x] Official actions are used
- [x] Action major versions are pinned
- [ ] Actions are pinned to immutable commit SHAs
- [ ] Dependabot monitors GitHub Actions

## Execution Controls

- [x] Concurrency cancellation is configured
- [x] Job timeout is configured
- [x] Frozen lockfile installation is enforced
- [x] Dependency-policy validation is enforced
- [x] Lint, typecheck, tests, and builds run in CI

## Cache Safety

- [x] pnpm cache uses the lockfile
- [x] `node_modules` is not cached directly
- [ ] Cache poisoning risks reviewed for forked pull requests
- [ ] Restore keys are not overly broad

## Secrets

- [x] Quality workflow requires no secrets
- [ ] Future deployment secrets use GitHub Environments
- [ ] Secrets are never printed
- [x] Sonar token is added only when scanner integration is enabled (intentionally absent while TD-003 is deferred)

## Artifacts

- [x] Quality workflow does not upload unnecessary artifacts
- [ ] Future artifacts define explicit retention periods
- [ ] Release artifacts use checksums/signing
- [ ] APK/AAB signing is isolated from pull-request workflows

## Branch Protection Readiness

- [x] Required status check identified (`Install, Verify and Build`)
- [x] CODEOWNERS file is valid and path-scoped
- [x] Intended ruleset payload committed (`.github/rulesets/default-branch-protection.json`)
- [x] Evidence capture script committed (`scripts/capture-branch-protection-evidence.ps1`)
- [ ] Ruleset/branch protection enabled on GitHub (blocked on current private-repo plan — see evidence)
- [ ] Workflow is required for protected branches (enable with ruleset)
- [ ] Direct pushes are restricted (enable with ruleset)
- [ ] Pull-request review is required (enable with ruleset)
- [ ] CODEOWNERS review is required where appropriate (enable with ruleset)
- [ ] Stale approvals are dismissed after new commits (enable with ruleset)

## Result

Status: Quality CI is ready. Branch protection assets and evidence are in-repo; enablement on GitHub is deferred until the repository plan supports private rulesets/branch protection (HTTP 403 today). See `docs/sprint-0/branch-protection-plan.md`.
