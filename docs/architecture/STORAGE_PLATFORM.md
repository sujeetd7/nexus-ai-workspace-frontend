# Storage Platform

Canonical guidance for Sprint 1 Batch 1.6 storage platform.

## Purpose

Provide a reusable, string-only storage foundation on top of the existing `StorageAdapter` contract:

- Shared helpers in `@nexus/shared-utils` (keys, JSON serialize/parse, in-memory adapter)
- Application-local Web `localStorage` adapter
- Explicit deferral of native durable and secure credential storage

## Existing contract

`StorageAdapter` in `@nexus/shared-types` is **frozen** for this batch:

```ts
export interface StorageAdapter {
  getItem(key: string): MaybePromise<string | null>;
  setItem(key: string, value: string): MaybePromise<void>;
  removeItem(key: string): MaybePromise<void>;
  clear?(): MaybePromise<void>;
}
```

- Values are **strings only**
- Missing keys return `null`
- Methods may be sync or async (`MaybePromise`)
- `clear` is optional
- Do not change this contract without an ADR

## Ownership

| Concern                                       | Owner                                           |
| --------------------------------------------- | ----------------------------------------------- |
| `StorageAdapter` contract                     | `@nexus/shared-types`                           |
| Namespaced keys, JSON helpers, memory adapter | `@nexus/shared-utils`                           |
| Browser `localStorage` adapter                | `apps/web` (`src/platform/storage`)             |
| Auth token persistence                        | Feature-owned (`apps/web` auth) — **unchanged** |
| Native durable / secure storage               | Deferred (TD-007 / TD-008 / TD-031+)            |

## Shared utilities

### Namespaced keys

`createNamespacedStorageKey(scope, key)` → `nexus:<scope>:<key>`

- Trims inputs
- Rejects empty / whitespace / control characters / embedded `:`
- Feature packages own their key constants; do not create a global key enum

### JSON serialization / parsing

- `serializeStorageValue` — fail-closed safe JSON → string
- `parseStorageValue` — parse JSON string; reject malformed / empty
- Allowed: `null`, boolean, finite number, string, arrays/objects of those
- Reject: `undefined`, functions, symbols, bigint, non-finite numbers, circular refs, Date, class instances, Error, DOM/native objects
- Errors use `ERROR_CODES.STORAGE` and must not embed raw values
- Schema validation after parse belongs to `@nexus/shared-validation` when needed

### In-memory adapter

`createMemoryStorageAdapter()` implements `StorageAdapter`.

- Isolated per instance
- Supports `clear`
- **Not durable** — tests and explicit non-production injection only
- Do not wire as production mobile persistence

## Web adapter

`createLocalStorageAdapter(options?)` in `apps/web/src/platform/storage`:

- Uses browser `localStorage` (injectable `Storage` for tests)
- Maps unavailable / quota / access / unknown failures to `ERROR_CODES.STORAGE`
- Constructs `AppError` from `@nexus/shared-types` (same pattern as environment adapters; avoids pulling `@nexus/shared-utils` into the web `tsc -b` graph)
- Shared `storageError` factory remains available from `@nexus/shared-utils` for non-web consumers
- Does not claim secure storage
- Stores strings only; use shared JSON helpers at the call site when needed

## Error policy

Use `storageError` / `ERROR_CODES.STORAGE`.

Safe metadata may include:

- `operation`: read / write / remove / clear / serialize / parse / namespace
- `adapter`: memory / browser
- `failure`: unavailable / quota / access / serialization categories / parsing / unknown / …

Must not include stored values, tokens, full keys, raw browser exceptions, or stacks.

## Authentication storage exclusion

Existing browser token storage remains feature-owned:

- `apps/web/src/api/auth/authStorage.ts`
- `STORAGE_KEYS` in `apps/web/src/config/constants.ts`
- `authSession` and network `TokenProvider`

Batch 1.6 does **not** migrate auth tokens onto the platform adapter.

See `docs/sprint-0/browser-token-storage.md` — `localStorage` is **not** secure for secrets (TD-007).

## React Native

No production native adapter in this batch.

Do not add AsyncStorage, MMKV, Keychain, or Keystore without CTO approval and an ADR.

Use the shared memory adapter only for tests / explicit non-durable injection.

## Anti-patterns

- Parallel storage contracts replacing `StorageAdapter`
- Putting `localStorage` in shared packages
- Silent use of memory adapter as durable mobile storage
- Migrating auth tokens without security approval
- Embedding secrets or raw values in storage errors
- Global enums of all feature storage keys
- Claiming browser `localStorage` is secure

## Generator decision

No `gen:storage`. Only one production adapter is approved; storage code is security-sensitive and requires manual review.

## Future extension / ADR triggers

Raise an ADR before:

- Breaking `StorageAdapter` (Result returns, generic values, sync-only/async-only)
- Adding AsyncStorage / MMKV / Keychain / IndexedDB
- Migrating auth token storage
- Creating a dedicated storage package

## Related documents

- Package ownership matrix
- Dependency rules
- Browser token storage
- Result and errors (`ERROR_CODES.STORAGE`)
