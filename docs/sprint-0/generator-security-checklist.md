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
- [x] Confirm encoded and mixed-separator traversal is rejected

### Absolute Paths

- [x] Reject drive-rooted paths such as `C:\`
- [x] Reject UNC paths
- [x] Reject POSIX absolute paths
- [x] Allow absolute paths only through an explicit future policy

### Symlinks

- [x] Detect symlink/reparse-point destinations
- [x] Prevent writes escaping the repository through symlinks
- [x] Use real-path validation before writes

### Reserved Filenames

- [x] Reject Windows reserved names such as `CON`, `PRN`, `AUX`, `NUL`
- [x] Reject names ending in a dot or space
- [x] Reject invalid cross-platform filename characters

### Overwrite Safety

- [x] Existing files are protected
- [x] `--force` must not overwrite unrelated files
- [x] Barrel updates must avoid duplicate exports

### Atomic Generation

- [x] Generate into a temporary directory
- [x] Validate all output before commit
- [x] Move files atomically when possible
- [x] Roll back partial writes after failure

### Determinism

- [x] Naming transformations are tested
- [x] File ordering is deterministic
- [x] Barrel export ordering is deterministic
- [x] Generated content is stable across platforms
- [x] Tests verify identical output for identical input

## Result

Status: Generator path, symlink, reserved-name, overwrite, atomic-write, and determinism controls are implemented and covered by `pnpm test:generators`.
