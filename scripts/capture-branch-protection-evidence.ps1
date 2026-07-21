param(
  [string]$Owner = "sujeetd7",
  [string]$Repo = "nexus-ai-workspace-frontend",
  [string]$Branch = "master",
  [string]$OutputPath = "docs/sprint-0/evidence/branch-protection-evidence.txt"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Continue"

$ghCandidates = @(
  "$env:ProgramFiles\GitHub CLI\gh.exe",
  "$env:LOCALAPPDATA\GitHub CLI\gh.exe",
  "gh"
)

$gh = $null
foreach ($candidate in $ghCandidates) {
  if ($candidate -eq "gh") {
    $cmd = Get-Command gh -ErrorAction SilentlyContinue
    if ($cmd) {
      $gh = $cmd.Source
      break
    }
  } elseif (Test-Path $candidate) {
    $gh = $candidate
    break
  }
}

$lines = New-Object System.Collections.Generic.List[string]
function Add-Line([string]$Text) {
  $script:lines.Add($Text) | Out-Null
}

Add-Line "Sprint 0 Branch Protection / Ruleset Evidence"
Add-Line ("Generated: {0}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz"))
Add-Line ("Repository: {0}/{1}" -f $Owner, $Repo)
Add-Line ("Default branch probed: {0}" -f $Branch)
Add-Line ""

if (-not $gh) {
  Add-Line "RESULT: GitHub CLI (gh) was not found on this machine."
  Add-Line "Install gh, authenticate, and re-run this script."
} else {
  Add-Line ("gh binary: {0}" -f $gh)
  Add-Line ""

  Add-Line "=== gh auth status ==="
  $auth = & $gh auth status 2>&1 | Out-String
  Add-Line $auth.TrimEnd()
  Add-Line ""

  Add-Line "=== Repository rulesets (GET /repos/{owner}/{repo}/rulesets) ==="
  $rulesets = (& $gh api "repos/$Owner/$Repo/rulesets" 2>&1 | ForEach-Object { "$_" }) -join "`n"
  Add-Line $rulesets.TrimEnd()
  Add-Line ""

  Add-Line "=== Classic branch protection (GET /repos/{owner}/{repo}/branches/{branch}/protection) ==="
  $protection = (& $gh api "repos/$Owner/$Repo/branches/$Branch/protection" 2>&1 | ForEach-Object { "$_" }) -join "`n"
  Add-Line $protection.TrimEnd()
  Add-Line ""

  Add-Line "=== Local readiness assets ==="
  foreach ($path in @(
      ".github/CODEOWNERS",
      ".github/rulesets/default-branch-protection.json",
      ".github/workflows/quality.yml",
      "docs/sprint-0/branch-protection-plan.md"
    )) {
    Add-Line ("{0}: {1}" -f $path, (Test-Path $path))
  }

  Add-Line ""
  Add-Line "=== Interpretation ==="
  if ($rulesets -match '"status"\s*:\s*"403"' -or $rulesets -match "Upgrade to GitHub Pro") {
    Add-Line "Ruleset API returned HTTP 403 for this private repository on the current GitHub plan."
    Add-Line "Protection settings are defined in-repo and ready to apply when the plan allows rulesets/branch protection."
  } elseif ($rulesets -match '^\s*\[\s*\]\s*$') {
    Add-Line "Ruleset API succeeded but returned an empty list. Apply .github/rulesets/default-branch-protection.json."
  } else {
    Add-Line "Ruleset API returned data. Confirm required checks and CODEOWNER reviews match docs/sprint-0/branch-protection-plan.md."
  }
}

$outDir = Split-Path -Parent $OutputPath
if ($outDir -and -not (Test-Path $outDir)) {
  New-Item -ItemType Directory -Force -Path $outDir | Out-Null
}

$lines -join "`n" | Set-Content -Path $OutputPath -Encoding utf8
Write-Host "Wrote $OutputPath"
