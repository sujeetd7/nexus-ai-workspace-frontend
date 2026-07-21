@'

## Summary

Describe the purpose of this change.

## Changes

-
-

## Validation

- [ ] `pnpm install --frozen-lockfile`
- [ ] `pnpm deps:check`
- [ ] `pnpm verify`
- [ ] Web tested
- [ ] Android tested when applicable

## Risk

Describe possible regressions or migration concerns.

## Screenshots

Add screenshots for UI changes.

## Documentation

- [ ] Documentation updated
- [ ] No documentation change required

## Breaking changes

- [ ] This change contains a breaking change
- [ ] No breaking changes
      '@ | Set-Content .github\PULL_REQUEST_TEMPLATE.md
