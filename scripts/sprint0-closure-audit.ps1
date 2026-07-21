param(
  [string]$OutputDirectory = "docs\sprint-0\evidence"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repositoryRoot = (Resolve-Path ".").Path
$outputRoot = Join-Path $repositoryRoot $OutputDirectory

New-Item -ItemType Directory -Force $outputRoot | Out-Null

function Write-Section {
  param(
    [string]$Path,
    [string]$Title,
    [scriptblock]$Command
  )

  Add-Content -Path $Path -Value ""
  Add-Content -Path $Path -Value "============================================================"
  Add-Content -Path $Path -Value $Title
  Add-Content -Path $Path -Value "============================================================"

  try {
    & $Command 2>&1 | Out-String | Add-Content -Path $Path
  } catch {
    "ERROR: $($_.Exception.Message)" | Add-Content -Path $Path
  }
}

$excludedPattern = @(
  '(^|/)(node_modules|dist|build|coverage|\.turbo|\.cache)(/|$)',
  '(^|/)apps/mobile/android/(\.gradle|app/build|build)(/|$)',
  '(^|/)apps/mobile/ios/(Pods|build|DerivedData)(/|$)',
  '(^|/)tmp(/|$)'
) -join '|'

# ------------------------------------------------------------
# 1. Tracked repository manifest
# ------------------------------------------------------------

$manifestPath = Join-Path $outputRoot "tracked-files-manifest.txt"

$trackedFiles = git ls-files |
  Where-Object {
    $_ -notmatch $excludedPattern
  } |
  Sort-Object

$trackedFiles | Set-Content $manifestPath

# ------------------------------------------------------------
# 2. Toolchain and configuration evidence
# ------------------------------------------------------------

$configEvidence = Join-Path $outputRoot "configuration-evidence.txt"
Set-Content $configEvidence "Sprint 0 Configuration Evidence"

Write-Section $configEvidence "Repository" {
  git remote -v
  git branch --show-current
  git rev-parse HEAD
  git status --short
}

Write-Section $configEvidence "Runtime versions" {
  node --version
  pnpm --version
  npm --version
}

Write-Section $configEvidence ".nvmrc" {
  Get-Content ".nvmrc"
}

Write-Section $configEvidence "Root package.json" {
  Get-Content "package.json"
}

Write-Section $configEvidence "pnpm workspace" {
  Get-Content "pnpm-workspace.yaml"
}

Write-Section $configEvidence "Turbo configuration" {
  Get-Content "turbo.json"
}

Write-Section $configEvidence "npm configuration" {
  Get-Content ".npmrc"
}

Write-Section $configEvidence "Syncpack configuration" {
  Get-Content ".syncpackrc.json"
}

Write-Section $configEvidence "ESLint configuration" {
  Get-Content "eslint.config.mjs"
}

Write-Section $configEvidence "Husky hooks" {
  Get-ChildItem ".husky" -File |
    Where-Object { $_.Name -notmatch "^_" } |
    ForEach-Object {
      "`n--- $($_.FullName) ---"
      Get-Content $_.FullName
    }
}

Write-Section $configEvidence "Commitlint configuration" {
  Get-ChildItem "configs\commitlint" -Recurse -File |
    ForEach-Object {
      "`n--- $($_.FullName) ---"
      Get-Content $_.FullName
    }
}

Write-Section $configEvidence "GitHub Actions" {
  Get-ChildItem ".github\workflows" -File |
    ForEach-Object {
      "`n--- $($_.FullName) ---"
      Get-Content $_.FullName
    }
}

Write-Section $configEvidence "SonarQube" {
  if (Test-Path "sonar-project.properties") {
    Get-Content "sonar-project.properties"
  } else {
    "sonar-project.properties is missing"
  }
}

# ------------------------------------------------------------
# 3. Package and application inventory
# ------------------------------------------------------------

$structureEvidence = Join-Path $outputRoot "structure-evidence.txt"
Set-Content $structureEvidence "Sprint 0 Structure Evidence"

Write-Section $structureEvidence "Workspace applications" {
  Get-ChildItem "apps" -Directory |
    Select-Object Name, FullName
}

Write-Section $structureEvidence "Microfrontend-like applications" {
  Get-ChildItem "apps" -Directory -Recurse |
    Where-Object {
      $_.Name -like "*-mf"
    } |
    Select-Object Name, FullName
}

Write-Section $structureEvidence "Workspace packages" {
  Get-ChildItem "packages" -Directory |
    Select-Object Name, FullName
}

Write-Section $structureEvidence "Package manifests" {
  Get-ChildItem "packages" -Directory |
    ForEach-Object {
      $manifest = Join-Path $_.FullName "package.json"

      if (Test-Path $manifest) {
        "`n--- $manifest ---"
        Get-Content $manifest
      }
    }
}

Write-Section $structureEvidence "Theme and UI-related tracked files" {
  git ls-files |
    Where-Object {
      $_ -match "(shared-theme|shared-ui|ui-kit)"
    } |
    Sort-Object
}

# ------------------------------------------------------------
# 4. Empty and .gitkeep-only directory audit
# ------------------------------------------------------------

$gitkeepEvidence = Join-Path $outputRoot "gitkeep-audit.txt"
Set-Content $gitkeepEvidence "Sprint 0 .gitkeep Directory Audit"

$gitkeepFiles = git ls-files |
  Where-Object {
    [System.IO.Path]::GetFileName($_) -eq ".gitkeep"
  }

foreach ($gitkeep in $gitkeepFiles) {
  $relativeDirectory = Split-Path $gitkeep -Parent
  $absoluteDirectory = Join-Path $repositoryRoot $relativeDirectory

  $otherTrackedFiles = git ls-files "$relativeDirectory/*" |
    Where-Object {
      [System.IO.Path]::GetFileName($_) -ne ".gitkeep"
    }

  [PSCustomObject]@{
    Directory = $relativeDirectory
    GitkeepOnly = ($otherTrackedFiles.Count -eq 0)
    OtherTrackedFiles = ($otherTrackedFiles -join ", ")
  } |
    Format-List |
    Out-String |
    Add-Content $gitkeepEvidence
}

# ------------------------------------------------------------
# 5. Generator evidence and security signals
# ------------------------------------------------------------

$generatorEvidence = Join-Path $outputRoot "generator-evidence.txt"
Set-Content $generatorEvidence "Sprint 0 Generator Evidence"

Write-Section $generatorEvidence "Generator tracked files" {
  git ls-files "scripts/generators/**"
}

Write-Section $generatorEvidence "Generator implementation" {
  Get-ChildItem "scripts\generators" -Recurse -File |
    ForEach-Object {
      "`n--- $($_.FullName) ---"
      Get-Content $_.FullName
    }
}

Write-Section $generatorEvidence "Generator security signal search" {
  Get-ChildItem "scripts\generators" -Recurse -File |
    Select-String -Pattern @(
      "resolve",
      "relative",
      "normalize",
      "realpath",
      "symlink",
      "lstat",
      "absolute",
      "reserved",
      "force",
      "overwrite",
      "rename",
      "temp",
      "atomic",
      "sort"
    ) |
    Select-Object Path, LineNumber, Line
}

# ------------------------------------------------------------
# 6. Networking evidence and security signals
# ------------------------------------------------------------

$networkEvidence = Join-Path $outputRoot "networking-evidence.txt"
Set-Content $networkEvidence "Sprint 0 Networking Evidence"

Write-Section $networkEvidence "Networking tracked files" {
  git ls-files "apps/web/src/api/**"
}

Write-Section $networkEvidence "Networking implementation" {
  Get-ChildItem "apps\web\src\api" -Recurse -File |
    Where-Object {
      $_.Name -notmatch "\.(test|spec)\."
    } |
    ForEach-Object {
      "`n--- $($_.FullName) ---"
      Get-Content $_.FullName
    }
}

Write-Section $networkEvidence "Networking tests" {
  Get-ChildItem "apps\web\src\api" -Recurse -File |
    Where-Object {
      $_.Name -match "\.(test|spec)\.(ts|tsx)$"
    } |
    ForEach-Object {
      "`n--- $($_.FullName) ---"
      Get-Content $_.FullName
    }
}

Write-Section $networkEvidence "Networking security signal search" {
  Get-ChildItem "apps\web\src\api" -Recurse -File |
    Select-String -Pattern @(
      "accessToken",
      "refreshToken",
      "Authorization",
      "console.log",
      "logger",
      "retry",
      "cancel",
      "AbortController",
      "interceptor",
      "eject",
      "localStorage",
      "sessionStorage",
      "Promise",
      "401",
      "GraphQL"
    ) |
    Select-Object Path, LineNumber, Line
}

# ------------------------------------------------------------
# 7. Documentation evidence
# ------------------------------------------------------------

$documentationEvidence = Join-Path $outputRoot "documentation-evidence.txt"
Set-Content $documentationEvidence "Sprint 0 Documentation Evidence"

Write-Section $documentationEvidence "Tracked documentation" {
  git ls-files |
    Where-Object {
      $_ -match '(^|/)(docs/|README\.md$|CONTRIBUTING\.md$|SECURITY\.md$|ARCHITECTURE\.md$|IMPLEMENTATION_STATUS\.md$)'
    } |
    Sort-Object
}

Write-Section $documentationEvidence "ADR files" {
  git ls-files "docs/adr/**"
  Write-Output ""
  Write-Output "Legacy pointer:"
  git ls-files "docs/architecture/adr/**"
}

# ------------------------------------------------------------
# 8. Symlink inventory
# ------------------------------------------------------------

$symlinkEvidence = Join-Path $outputRoot "symlink-evidence.txt"
Set-Content $symlinkEvidence "Sprint 0 Symlink Evidence"

Get-ChildItem "scripts\generators" -Recurse -Force |
  Where-Object {
    $_.Attributes -band [System.IO.FileAttributes]::ReparsePoint
  } |
  Select-Object FullName, LinkType, Target |
  Format-Table -AutoSize |
  Out-String |
  Add-Content $symlinkEvidence

# ------------------------------------------------------------
# 9. Summary
# ------------------------------------------------------------

$summaryPath = Join-Path $outputRoot "evidence-summary.md"

@"
# Sprint 0 Evidence Summary

Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz")

## Repository

- Branch: $(git branch --show-current)
- Commit: $(git rev-parse HEAD)
- Tracked files in filtered manifest: $($trackedFiles.Count)

## Evidence Files

- tracked-files-manifest.txt
- configuration-evidence.txt
- structure-evidence.txt
- gitkeep-audit.txt
- generator-evidence.txt
- networking-evidence.txt
- documentation-evidence.txt
- symlink-evidence.txt
- verify-output.txt

## Important

This evidence reflects the repository state at the commit listed above.
Run the audit again after structural cleanup and before CTO submission.
"@ | Set-Content $summaryPath

Write-Host ""
Write-Host "Sprint 0 evidence generated at:"
Write-Host $outputRoot
