param(
  [string]$RepositoryRoot = "."
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = (Resolve-Path $RepositoryRoot).Path
Set-Location $root

function Ensure-Directory {
  param([string]$Path)

  if (-not (Test-Path $Path)) {
    New-Item -ItemType Directory -Force $Path | Out-Null
  }
}

function Write-File {
  param(
    [string]$Path,
    [string]$Content
  )

  $parent = Split-Path $Path -Parent

  if ($parent) {
    Ensure-Directory $parent
  }

  $Content | Set-Content -Path $Path -Encoding utf8
  Write-Host "Created: $Path"
}

Ensure-Directory "docs\sprint-0\evidence"
Ensure-Directory "docs\adr"

# -------------------------------------------------------------------
# IMPLEMENTATION STATUS
# -------------------------------------------------------------------

Write-File "IMPLEMENTATION_STATUS.md" @'
# Nexus AI Workspace Frontend — Implementation Status

## Current Phase

Sprint 0 — Engineering Foundation & Developer Experience

## Sprint 0 Status

Status: Pending CTO approval

## Completed

- pnpm workspace configuration
- TurboRepo task orchestration
- Node.js 22.22.2 standardization
- pnpm 9.15.9 standardization
- engine-strict dependency enforcement
- React web foundation
- React Native mobile foundation
- Metro monorepo configuration
- shared package structure
- shared UI and theme foundations
- strict TypeScript configuration
- ESLint configuration
- React Native ESLint isolation
- Prettier
- Husky
- Commitlint
- lint-staged
- Syncpack dependency governance
- frozen-lockfile installation
- GitHub Actions quality workflow
- root quality command through `pnpm verify`
- generator CLI foundation
- component generator
- hook generator
- Redux slice generator
- generator tests
- Axios networking foundation
- RTK Query base query
- GraphQL base query
- request ID interceptor
- authorization header adapter
- token storage adapter
- API error normalization
- networking unit tests
- SonarQube baseline configuration
- repository governance templates
- Sprint 0 documentation foundation

## Pending CTO Validation

- tracked repository evidence validation
- speculative `.gitkeep` cleanup
- overlapping UI/theme package responsibility review
- microfrontend justification review
- generator security approval
- networking security approval
- GitHub Actions security approval
- final Sprint 0 sign-off

## Deferred

- Storybook implementation
- APK/AAB release automation
- web deployment automation
- production SonarQube integration
- refresh-token concurrency and replay flow
- secure mobile credential storage
- streaming transport
- complete offline transport
- Sprint 1 authentication UI and product features

## Quality Commands

```powershell
pnpm install --frozen-lockfile
pnpm deps:check
pnpm verify
```

## Rule

Sprint 1 must not begin until CTO approval is issued.
'@

# -------------------------------------------------------------------
# ADR INDEX
# -------------------------------------------------------------------

Write-File "docs\adr\README.md" @'
# Architecture Decision Record Index

Canonical ADR directory: `docs/adr/`.

| ADR | Decision | Status |
|---|---|---|
| ADR-0001 | pnpm + TurboRepo monorepo | Accepted |
| ADR-0002 | pnpm 9.15.9 and Node.js 22.22.2 | Accepted |
| ADR-0003 | Strict TypeScript strategy | Accepted |
| ADR-0004 | Redux Toolkit application state | Accepted |
| ADR-0005 | RTK Query for server state | Accepted |
| ADR-0006 | GraphQL via shared networking | Accepted |
| ADR-0007 | Testing strategy | Accepted |
| ADR-0008 | CI quality pipeline | Accepted |
| ADR-0009 | Package and import boundaries | Accepted |
| ADR-0010 | Defer Storybook | Accepted |
| ADR-0011 | Isolate React Native ESLint | Accepted |

## ADR Rules

- ADRs are immutable after acceptance.
- Material changes require a new ADR.
- Superseded ADRs remain in the repository with updated status.
- ADR IDs must be unique (`ADR-####`); validated by `pnpm adr:check`.
- Architecture-affecting Sprint 1 changes require CTO review.
'@

# -------------------------------------------------------------------
# TECHNICAL DEBT
# -------------------------------------------------------------------

Write-File "docs\technical-debt-register.md" @'
# Technical Debt Register

| ID | Area | Debt | Risk | Priority | Target |
|---|---|---|---|---|---|
| TD-001 | Shared packages | Some packages currently have minimal or no runtime tests | Medium | Medium | Sprint 1–2 |
| TD-002 | Storybook | Shared UI has no interactive component documentation | Medium | Medium | Design-system sprint |
| TD-003 | SonarQube | Configuration exists, but hosted scanner and token are not integrated | Medium | Medium | CI hardening sprint |
| TD-004 | Android release | APK/AAB automation is not implemented | Medium | Medium | Release engineering sprint |
| TD-005 | Web deployment | Production web deployment is not implemented | Medium | Medium | Release engineering sprint |
| TD-006 | Networking | Refresh-token single-flight and request replay are deferred | High | High | Authentication sprint |
| TD-007 | Networking | Browser localStorage is not appropriate for all security contexts | High | High | Authentication/security sprint |
| TD-008 | Mobile security | Secure credential storage is not implemented | High | High | Mobile authentication sprint |
| TD-009 | Streaming | Streaming client remains deferred | Low | Low | AI/chat sprint |
| TD-010 | Offline | Offline manager remains incomplete | Medium | Low | Mobile resilience sprint |
| TD-011 | CI supply chain | GitHub Actions use version tags instead of immutable commit SHAs | Medium | Medium | CI security hardening |
| TD-012 | Microfrontends | Existing `*-mf` applications require evidence-based justification | High | High | Sprint 0 closure |
| TD-013 | Package ownership | `shared-theme`, `shared-ui`, and `ui-kit` ownership may overlap | High | High | Sprint 0 closure |
| TD-014 | Empty scaffolding | `.gitkeep`-only directories may communicate speculative architecture | Low | Medium | Sprint 0 closure |

## Review Policy

- Review this register at the beginning and end of every sprint.
- Security-related debt cannot be deferred without explicit approval.
- New debt must include an owner and target sprint.
'@

# -------------------------------------------------------------------
# STRUCTURAL CLEANUP REPORT
# -------------------------------------------------------------------

Write-File "docs\sprint-0\structural-cleanup-report.md" @'
# Sprint 0 Structural Cleanup Report

## Status

Pending final tracked-file review.

## Scope

This review covers:

- speculative `.gitkeep` directories
- duplicate scaffolding
- overlapping packages
- generated outputs
- temporary files
- stale lockfiles
- unused configuration
- public exports of deferred modules

## Completed Cleanup

- temporary generator validation output excluded
- build outputs excluded from tracked evidence
- Node and pnpm versions standardized
- React Native Metro monorepo resolution corrected
- React Native ESLint isolated from root flat configuration
- stale dependency-policy mismatches resolved
- networking tests added
- generator tests added

## `.gitkeep` Review Rule

A `.gitkeep`-only directory should remain only when:

1. it is required by an immediate implementation batch;
2. a tool depends on the directory existing;
3. it documents an approved architecture boundary;
4. its purpose is documented.

All other `.gitkeep`-only directories should be removed.

## Pending Decisions

- remove unsupported speculative directories
- resolve ownership overlap among UI/theme packages
- review all microfrontend folders
- remove public exports for deferred or empty implementations

## Recommendation

Complete cleanup only after reviewing:

```text
docs/sprint-0/evidence/gitkeep-audit.txt
docs/sprint-0/evidence/structure-evidence.txt
```
'@

# -------------------------------------------------------------------
# PACKAGE OWNERSHIP MATRIX
# -------------------------------------------------------------------

Write-File "docs\sprint-0\package-ownership-matrix.md" @'
# Package Ownership Matrix

| Package | Primary Responsibility | Allowed Contents | Must Not Contain |
|---|---|---|---|
| `shared-types` | Shared TypeScript contracts | domain types, API types, common interfaces | runtime business logic, UI |
| `shared-utils` | Platform-safe helpers | pure utilities, test builders | browser-only or React-specific logic |
| `shared-validation` | Shared validation contracts | Zod schemas, validation helpers | API transport or UI |
| `shared-ui` | Cross-platform UI foundation | components, tokens, themes, responsive helpers | product features, application state |
| `shared-theme` | Candidate: theme-only package | tokens and theme composition only | duplicate UI components |
| `ui-kit` | Candidate: presentation component library | design-system components only | duplicate theme ownership |

## Overlap Decision

The preferred target is:

- `shared-ui` owns cross-platform UI components and consumes a single theme source.
- Only one package should own design tokens and theme construction.
- `ui-kit` should exist only if it has a distinct consumer contract and release boundary.
- `shared-theme` should exist only if theme assets are consumed independently by multiple UI implementations.

## Consolidation Recommendation

Unless repository evidence proves independent consumers:

1. consolidate tokens and themes into `shared-ui`;
2. remove duplicate `shared-theme` and `ui-kit` scaffolding;
3. preserve internal folders to keep future extraction possible;
4. avoid publishing three overlapping packages during Sprint 0.

## Required Evidence Before Keeping Separate Packages

- independent consumers
- distinct ownership
- separate release lifecycle
- measurable build or runtime boundary
- clear dependency direction
'@

# -------------------------------------------------------------------
# MICROFRONTEND REVIEW
# -------------------------------------------------------------------

Write-File "docs\sprint-0\microfrontend-review.md" @'
# Microfrontend Review

## Decision Standard

Each `*-mf` application must satisfy at least one strong enterprise criterion:

- independent deployment
- distinct team ownership
- runtime isolation
- independent release cadence
- measurable business or operational requirement

## Current Recommendation

If these criteria are not supported by repository and organizational evidence, consolidate the microfrontend applications into the main web application.

## Consolidation Approach

Retain microfrontend-ready boundaries through:

- feature-first folders
- route-level lazy loading
- isolated Redux slices and sagas
- explicit public feature exports
- no cross-feature internal imports
- independent test boundaries
- stable shared package contracts

## Why Consolidation Is Safer Now

Premature microfrontends introduce:

- deployment complexity
- duplicated dependencies
- routing complexity
- shared-state complexity
- local development overhead
- version skew
- slower CI
- unclear ownership

## Approval Requirement

No `*-mf` application should remain solely because microfrontends are considered an enterprise pattern.

Every retained application must document:

| Criterion | Evidence |
|---|---|
| Independent deployment | Pending |
| Team ownership | Pending |
| Runtime isolation | Pending |
| Release independence | Pending |
| Business justification | Pending |

## Proposed Outcome

Status: Consolidate unless evidence justifies separation.
'@

# -------------------------------------------------------------------
# CI SECURITY CHECKLIST
# -------------------------------------------------------------------

Write-File "docs\sprint-0\ci-security-checklist.md" @'
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
- [ ] Sonar token is added only when scanner integration is enabled

## Artifacts

- [x] Quality workflow does not upload unnecessary artifacts
- [ ] Future artifacts define explicit retention periods
- [ ] Release artifacts use checksums/signing
- [ ] APK/AAB signing is isolated from pull-request workflows

## Branch Protection Readiness

- [ ] Workflow is required for protected branches
- [ ] Direct pushes are restricted
- [ ] Pull-request review is required
- [ ] CODEOWNERS review is required where appropriate
- [ ] Stale approvals are dismissed after new commits

## Result

Status: Ready for quality CI; additional hardening required before release CI/CD.
'@

# -------------------------------------------------------------------
# GENERATOR SECURITY CHECKLIST
# -------------------------------------------------------------------

Write-File "docs\sprint-0\generator-security-checklist.md" @'
# Generator Security Checklist

## Implemented Controls

- [x] Input names are validated
- [x] Path traversal is rejected
- [x] Overwrite is blocked by default
- [x] `--force` is explicit
- [x] `--dry-run` does not write files
- [x] Unsupported generators fail
- [x] Generator tests cover core behavior
- [x] Non-zero failure behavior is expected

## Required Security Validation

### Traversal

- [x] Reject `../`
- [x] Resolve paths against repository root
- [ ] Confirm encoded and mixed-separator traversal is rejected

### Absolute Paths

- [ ] Reject drive-rooted paths such as `C:\`
- [ ] Reject UNC paths
- [ ] Reject POSIX absolute paths
- [ ] Allow absolute paths only through an explicit future policy

### Symlinks

- [ ] Detect symlink/reparse-point destinations
- [ ] Prevent writes escaping the repository through symlinks
- [ ] Use real-path validation before writes

### Reserved Filenames

- [ ] Reject Windows reserved names such as `CON`, `PRN`, `AUX`, `NUL`
- [ ] Reject names ending in a dot or space
- [ ] Reject invalid cross-platform filename characters

### Overwrite Safety

- [x] Existing files are protected
- [ ] `--force` must not overwrite unrelated files
- [ ] Barrel updates must avoid duplicate exports

### Atomic Generation

- [ ] Generate into a temporary directory
- [ ] Validate all output before commit
- [ ] Move files atomically when possible
- [ ] Roll back partial writes after failure

### Determinism

- [x] Naming transformations are tested
- [ ] File ordering is deterministic
- [ ] Barrel export ordering is deterministic
- [ ] Generated content is stable across platforms
- [ ] Tests verify identical output for identical input

## Result

Status: Core safety exists, but symlink, reserved-name, atomic-write, and determinism hardening remain technical debt.
'@

# -------------------------------------------------------------------
# NETWORKING SECURITY CHECKLIST
# -------------------------------------------------------------------

Write-File "docs\sprint-0\networking-security-checklist.md" @'
# Networking Security Checklist

## Tokens

- [x] Authorization header adapter exists
- [x] Token clearing exists
- [ ] Tokens are never logged
- [ ] Token redaction is applied in observability
- [ ] Refresh token is not exposed to unrelated modules
- [ ] Browser storage risk is documented
- [ ] Mobile tokens use secure platform storage

## Refresh Flow

- [ ] Single-flight refresh concurrency
- [ ] Failed-request replay
- [ ] Refresh recursion prevention
- [ ] Refresh-token rotation support
- [ ] Replay detection handling
- [ ] Session invalidation callback

## Retries

- [ ] Maximum retry count enforced
- [ ] Exponential backoff
- [ ] Jitter
- [ ] Non-idempotent requests excluded by default
- [ ] 401 refresh flow separated from generic retries

## Interceptors

- [x] Request interceptor exists
- [x] Authorization interceptor exists
- [x] Response interceptor exists
- [x] Error interceptor exists
- [ ] Interceptor registration is idempotent
- [ ] Interceptor IDs can be ejected in tests/hot reload
- [ ] Duplicate interceptor registration is prevented

## Storage

- [x] Browser token storage adapter is isolated
- [ ] Production browser strategy reviewed against XSS threat model
- [ ] Secure cookie option evaluated
- [ ] Mobile secure storage implemented
- [ ] Storage failures handled

## GraphQL

- [x] Separate GraphQL client exists
- [x] GraphQL base query exists
- [ ] GraphQL `errors[]` normalized into the common error model
- [ ] Partial-data behavior documented
- [ ] Sensitive query variables are not logged

## Cancellation

- [ ] AbortSignal support
- [ ] RTK Query cancellation forwarded to Axios
- [ ] Streaming cancellation support
- [ ] Unmounted requests are canceled where needed

## Logging

- [x] No logging is required for token storage
- [ ] Authorization headers redacted
- [ ] Cookies redacted
- [ ] Sensitive request bodies redacted
- [ ] Password and reset-token fields redacted
- [ ] Production logs exclude raw Axios errors when sensitive data may exist

## Result

Status: Sprint 0 networking foundation is structurally complete, but authentication security orchestration remains intentionally deferred.
'@

# -------------------------------------------------------------------
# SPRINT 0 COMPLETION REPORT
# -------------------------------------------------------------------

Write-File "docs\sprint-0\sprint-0-completion-report.md" @'
# Sprint 0 Completion Report

## Executive Summary

Sprint 0 established the engineering foundation and developer experience for the Nexus AI Workspace frontend monorepo.

The repository now supports web and React Native development, shared packages, strict quality gates, generator infrastructure, networking foundations, CI validation, and architectural documentation.

## Scope

Sprint 0 covered:

- monorepo
- tooling
- CI quality workflow
- generators
- networking foundation
- documentation
- repository governance

Sprint 0 did not include product features or release deployment.

## Major Outcomes

### Monorepo

- pnpm workspace
- TurboRepo
- shared package boundaries
- React web application
- React Native mobile application

### Runtime

- Node.js 22.22.2
- pnpm 9.15.9
- engine-strict enforcement
- frozen-lockfile reproducibility

### Quality

- lint
- typecheck
- tests
- builds
- dependency policy
- root `pnpm verify`

### Mobile

- Metro configured for pnpm monorepo resolution
- Android application builds and runs
- React Native ESLint isolated from root tooling

### Generators

Implemented:

- component
- hook
- Redux slice

Capabilities:

- path option
- dry-run
- force option
- overwrite protection
- traversal protection
- barrel export updates
- automated tests

### Networking

Implemented:

- Axios client
- RTK Query base query
- GraphQL base query
- token storage adapter
- authorization header adapter
- request ID interceptor
- API error normalization
- unauthorized callback
- unit tests

### CI

GitHub Actions quality workflow includes:

- frozen install
- Syncpack dependency validation
- lint
- typecheck
- tests
- generator tests
- builds

## Verification Evidence

Evidence is stored under:

```text
docs/sprint-0/evidence/
```

Required commands:

```powershell
pnpm install --frozen-lockfile
pnpm deps:check
pnpm verify
```

## Deferred Work

- Storybook
- release pipelines
- APK/AAB automation
- web deployment
- hosted SonarQube integration
- authentication refresh orchestration
- secure mobile token storage
- streaming
- offline transport completion

## CTO Closure Status

Recommendation: Changes Required until structural, package ownership, microfrontend, generator-security, networking-security, and CI-security reviews are accepted.

## Sprint 1 Gate

Sprint 1 must not begin until CTO approval is recorded.
'@

# -------------------------------------------------------------------
# EVIDENCE SUMMARY
# -------------------------------------------------------------------

Write-File "docs\sprint-0\evidence\README.md" @'
# Sprint 0 Evidence

This folder contains generated evidence for CTO review.

Expected files:

- tracked-files-manifest.txt
- configuration-evidence.txt
- structure-evidence.txt
- gitkeep-audit.txt
- generator-evidence.txt
- networking-evidence.txt
- documentation-evidence.txt
- symlink-evidence.txt
- frozen-install-output.txt
- dependency-policy-output.txt
- verify-output.txt
- github-actions-runs.txt
- github-actions-latest-run.txt

Run the repository audit script and quality commands before submission.
'@

# -------------------------------------------------------------------
# TRACKED FILE MANIFEST
# -------------------------------------------------------------------

$excludedPattern = '(^|/)(node_modules|dist|build|coverage|\.turbo|\.cache|tmp)(/|$)|(^|/)apps/mobile/android/(\.gradle|app/build|build)(/|$)|(^|/)apps/mobile/ios/(Pods|build|DerivedData)(/|$)'

git ls-files |
  Where-Object { $_ -notmatch $excludedPattern } |
  Sort-Object |
  Set-Content "docs\sprint-0\evidence\tracked-files-manifest.txt"

Write-Host "Created: docs\sprint-0\evidence\tracked-files-manifest.txt"

# -------------------------------------------------------------------
# CONFIGURATION EVIDENCE
# -------------------------------------------------------------------

$configFiles = @(
  ".nvmrc",
  ".npmrc",
  "package.json",
  "pnpm-workspace.yaml",
  "turbo.json",
  ".syncpackrc.json",
  "eslint.config.mjs",
  "sonar-project.properties",
  ".github\workflows\quality.yml",
  ".husky\pre-commit",
  ".husky\commit-msg"
)

$configOutput = @()
$configOutput += "Node: $(node --version)"
$configOutput += "pnpm: $(pnpm --version)"
$configOutput += "Branch: $(git branch --show-current)"
$configOutput += "Commit: $(git rev-parse HEAD)"

foreach ($file in $configFiles) {
  $configOutput += ""
  $configOutput += "=== $file ==="

  if (Test-Path $file) {
    $configOutput += Get-Content $file
  } else {
    $configOutput += "MISSING"
  }
}

$configOutput | Set-Content "docs\sprint-0\evidence\configuration-evidence.txt"
Write-Host "Created: docs\sprint-0\evidence\configuration-evidence.txt"

# -------------------------------------------------------------------
# STRUCTURE EVIDENCE
# -------------------------------------------------------------------

$structure = @()
$structure += "=== Applications ==="
$structure += Get-ChildItem "apps" -Directory -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty FullName

$structure += ""
$structure += "=== Packages ==="
$structure += Get-ChildItem "packages" -Directory -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty FullName

$structure += ""
$structure += "=== Microfrontend candidates ==="
$structure += Get-ChildItem "apps" -Directory -Recurse -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -like "*-mf" } |
  Select-Object -ExpandProperty FullName

$structure += ""
$structure += "=== UI/theme candidates ==="
$structure += Get-ChildItem "packages" -Directory -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -match "theme|ui" } |
  Select-Object -ExpandProperty FullName

$structure | Set-Content "docs\sprint-0\evidence\structure-evidence.txt"
Write-Host "Created: docs\sprint-0\evidence\structure-evidence.txt"

# -------------------------------------------------------------------
# GITKEEP EVIDENCE
# -------------------------------------------------------------------

$gitkeepReport = @()

git ls-files |
  Where-Object { [System.IO.Path]::GetFileName($_) -eq ".gitkeep" } |
  ForEach-Object {
    $directory = Split-Path $_ -Parent
    $others = @(git ls-files "$directory/*" |
      Where-Object { [System.IO.Path]::GetFileName($_) -ne ".gitkeep" })

    $gitkeepReport += "Directory: $directory"
    $gitkeepReport += "GitkeepOnly: $($others.Count -eq 0)"
    $gitkeepReport += "OtherTrackedFiles: $($others -join ', ')"
    $gitkeepReport += ""
  }

$gitkeepReport | Set-Content "docs\sprint-0\evidence\gitkeep-audit.txt"
Write-Host "Created: docs\sprint-0\evidence\gitkeep-audit.txt"

# -------------------------------------------------------------------
# GENERATOR EVIDENCE
# -------------------------------------------------------------------

$generatorFiles = git ls-files "scripts/generators/**"
$generatorFiles | Set-Content "docs\sprint-0\evidence\generator-evidence.txt"
Write-Host "Created: docs\sprint-0\evidence\generator-evidence.txt"

# -------------------------------------------------------------------
# NETWORKING EVIDENCE
# -------------------------------------------------------------------

$networkFiles = git ls-files "apps/web/src/api/**"
$networkFiles | Set-Content "docs\sprint-0\evidence\networking-evidence.txt"
Write-Host "Created: docs\sprint-0\evidence\networking-evidence.txt"

# -------------------------------------------------------------------
# DOCUMENTATION EVIDENCE
# -------------------------------------------------------------------

git ls-files |
  Where-Object {
    $_ -match '(^|/)(docs/|README\.md$|CONTRIBUTING\.md$|SECURITY\.md$|IMPLEMENTATION_STATUS\.md$)'
  } |
  Sort-Object |
  Set-Content "docs\sprint-0\evidence\documentation-evidence.txt"

Write-Host "Created: docs\sprint-0\evidence\documentation-evidence.txt"

Write-Host ""
Write-Host "Sprint 0 closure documents created successfully."
Write-Host "Next run:"
Write-Host "  pnpm install --frozen-lockfile"
Write-Host "  pnpm deps:check"
Write-Host "  pnpm verify"
Write-Host ""
Write-Host "Then capture outputs into docs\sprint-0\evidence."
