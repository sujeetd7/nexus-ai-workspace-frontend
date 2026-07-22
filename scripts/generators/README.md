# Nexus Generator CLI

This directory contains all code generation infrastructure.

Implemented generators:

- component
- hook
- slice

CLI placeholders (registered; runtime rejects until implemented):

- screen
- feature
- api
- graphql
- saga

These placeholders predate Sprint 1 (Sprint 0 generator CLI surface). They are not production generators.

Deferred without CLI placeholders (Sprint 1 decisions):

- repository — Batch 1.8; see `docs/architecture/REPOSITORY_CONTRACTS.md`
- service — Batch 1.9; see `docs/architecture/SHARED_SERVICES.md`
- model — Batch 1.5; see `docs/architecture/DOMAIN_MODELS.md`
- zod / validation schema generator
- logger
- story
- test

Templates are stored under templates/.

## Safety

- Output `--path` values must be workspace-relative (absolute, UNC, and drive-rooted paths are rejected).
- Path traversal, reserved Windows names, and symlink escapes are blocked.
- Existing files are protected unless `--force` is set; `--dry-run` writes nothing.
- Run `pnpm test:generators` to validate generator security controls.
