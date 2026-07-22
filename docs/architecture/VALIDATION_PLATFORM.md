# Validation Platform

Canonical guidance for Sprint 1 Batch 1.4 shared validation primitives.

## Purpose

`@nexus/shared-validation` owns reusable, framework-independent Zod schemas and safe parsing helpers consumed by React Web and React Native.

It validates plain values and objects. It does not read environment globals, render UI, or own feature/domain schemas.

## Ownership

| Concern                                         | Owner                                                  |
| ----------------------------------------------- | ------------------------------------------------------ |
| Shared schema primitives and `parseWithSchema`  | `@nexus/shared-validation`                             |
| `Result` / `AppError` / `ERROR_CODES` contracts | `@nexus/shared-types`                                  |
| Result helpers and AppError factories           | `@nexus/shared-utils`                                  |
| Public client config parse                      | `@nexus/shared-validation` (`parsePublicClientConfig`) |
| Feature / form / auth / AI schemas              | Feature or domain owners                               |
| React Hook Form adapters                        | Future approved adapter layer                          |

## Allowed and forbidden imports

**Allowed**

- `zod`
- `@nexus/shared-types`

**Forbidden**

- React / React Native
- React Hook Form
- Redux / RTK Query
- Axios / `@nexus/shared-network`
- `@nexus/shared-utils` (construct `Result` / `AppError` from shared-types shapes instead)
- Browser / Node env globals (`import.meta.env`, `process.env`)
- Application packages

## Generic validation flow

```text
unknown input
    ↓
Zod schema
    ↓
safeParse
    ↓
sanitized metadata
    ↓
Result<T, AppError>
```

Use `parseWithSchema(schema, input, options?)`:

- Default error code: `ERROR_CODES.VALIDATION`
- Configuration boundaries may pass `errorCode: ERROR_CODES.CONFIGURATION`
- Safe metadata only: `fields`, `categories`, `issueCount`
- Never include raw input, field values, URLs, tokens, stacks, or Zod issue objects

## Schema ownership rules

- Generic primitives may live in `@nexus/shared-validation` after reuse is demonstrated.
- Feature schemas remain with feature/domain owners.
- Do not dump miscellaneous product schemas into shared-validation.
- Breaking schema behavior requires review.

## Validation versus business rules

- Schemas enforce shape, format, and closed-input contracts.
- Business rules (authorization, quotas, domain invariants) belong in services/domain layers.

## Safe error policy

Validation failures return `AppError` values that remain serializable through the Batch 1.2 platform.

Do not expose:

- Raw values
- Full input objects
- URLs, tokens, passwords, headers
- Native exception objects
- Complete `ZodIssue` objects

## Unknown-key policy

The schema remains authoritative. `parseWithSchema` does not silently strip or reject keys beyond what the schema defines.

Shared closed object primitives in this package (`publicClientConfigSchema`, `pageRequestSchema`, `cursorPageRequestSchema`) use `.strict()` and reject unknown keys.

Future feature schemas may choose strip/reject/passthrough explicitly for their boundary.

## Cross-platform guarantees

- No DOM or React Native APIs
- Standard `URL` constructor for absolute HTTP(S) checks (localhost-safe)
- Vitest package tests run in Node
- Same public API for Web and React Native consumers

## Testing standards

- Schema behavior
- Safe parsing and error codes
- Metadata sanitization (no leakage)
- Regression for `parsePublicClientConfig`
- Public export stability

## Anti-patterns

- Parallel validation Result types
- Importing `@nexus/shared-utils` from shared-validation
- Putting feature schemas in shared-validation
- React Hook Form / UI wiring in this package
- UUID policies for identifiers that are not UUID-based
- Arbitrary product length limits without consumers
- Exposing raw Zod errors to callers

## Generator decision

No `gen:validation` / `gen:zod` generator in Batch 1.4.

A generator is deferred until the repository repeatedly creates standard schema modules outside shared primitives, without encouraging feature schemas into the wrong package.

## Deferred React Hook Form integration

Form adapters belong to a future approved adapter layer. They are intentionally out of scope for the validation platform package.
