# Branch Protection / Ruleset Plan

## Goal

Protect `master`, `main`, and `develop` so that:

1. Direct pushes are blocked (PR required).
2. At least one approving review is required.
3. CODEOWNERS review is required.
4. Stale approvals are dismissed on new commits.
5. GitHub Actions check **Install, Verify and Build** (`Frontend Quality`) is required and up to date.

## Repository assets

| Asset                                                   | Purpose                              |
| ------------------------------------------------------- | ------------------------------------ |
| `.github/CODEOWNERS`                                    | Ownership paths for required reviews |
| `.github/rulesets/default-branch-protection.json`       | Intended repository ruleset payload  |
| `.github/workflows/quality.yml`                         | Required status check producer       |
| `scripts/capture-branch-protection-evidence.ps1`        | Evidence capture helper              |
| `docs/sprint-0/evidence/branch-protection-evidence.txt` | Latest capture output                |

## Apply (when GitHub plan allows)

Private repositories on GitHub Free cannot create/read repository rulesets or classic branch protection via API (HTTP 403). Options:

1. Upgrade the org/user plan that unlocks branch protection for private repos, **or**
2. Make the repository public (if appropriate), **or**
3. Apply equivalent org-level rulesets from an entitlement that supports them.

Apply the JSON under `.github/rulesets/` from GitHub UI (**Settings → Rules → Rulesets → New ruleset**) or API:

```powershell
powershell -NoProfile -File scripts/capture-branch-protection-evidence.ps1
# When the plan allows creating rulesets:
# & "$env:ProgramFiles\GitHub CLI\gh.exe" api repos/sujeetd7/nexus-ai-workspace-frontend/rulesets -X POST --input .github/rulesets/default-branch-protection.json
```

Then refresh evidence:

```powershell
powershell -NoProfile -File scripts/capture-branch-protection-evidence.ps1
```

## Required status check name

Must match the job `name` in `.github/workflows/quality.yml`:

```text
Install, Verify and Build
```
