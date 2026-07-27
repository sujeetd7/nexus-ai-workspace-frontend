# Test Strategy — Quality Intelligence (Frontend)

## Scope

- **Vitest**: `web`, `@nexus/shared-*`
- **Jest**: `mobile`
- **Storybook**: visual/example surface (not automatic product E2E)
- **Playwright**: not present yet — adapter ready when introduced

Shared reporting architecture with the Engineering Platform (`tooling/quality-report`, schema `1.0.0`).

## Commands

```powershell
pnpm --filter @nexus/quality-report test
pnpm quality:report
pnpm quality:serve
```

Dashboard URL (default): `http://127.0.0.1:4173`

## Collect

1. Produce framework JSON + coverage-summary into paths listed in `quality/collect-manifest.json`.
2. Run `pnpm quality:report` to normalize + generate dashboard.
3. Serve with `pnpm quality:serve`.

Enable Vitest coverage for packages when collecting:

```powershell
$env:QUALITY_COVERAGE="1"
```
