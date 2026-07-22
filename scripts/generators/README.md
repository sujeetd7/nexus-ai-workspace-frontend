# Nexus Generator CLI

This directory contains all code generation infrastructure.

Implemented generators:

- component
- hook
- slice

Future generators (not implemented; no CLI placeholders):

- screen
- feature
- api
- graphql
- saga
- repository — deferred (Batch 1.8); see `docs/architecture/REPOSITORY_CONTRACTS.md`
- service
- zod
- story
- test

Templates are stored under templates/.

## Safety

- Output `--path` values must be workspace-relative (absolute, UNC, and drive-rooted paths are rejected).
- Path traversal, reserved Windows names, and symlink escapes are blocked.
- Existing files are protected unless `--force` is set; `--dry-run` writes nothing.
- Run `pnpm test:generators` to validate generator security controls.
