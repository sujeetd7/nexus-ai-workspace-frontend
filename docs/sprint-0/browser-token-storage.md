# Browser token storage (web)

Sprint 0 ships a browser `localStorage` adapter under `apps/web/src/api/auth/authStorage.ts`.

## Risk

`localStorage` is readable by any script running in the page origin. XSS can exfiltrate access and refresh tokens.

## Sprint 0 stance

- Keep the adapter isolated behind `TokenProvider` / auth helpers.
- Do not log tokens (shared-network redacts authorization and token fields).
- Treat production hardening (HttpOnly cookies, BFF session, or hardened storage) as **TD-007**.
- Mobile secure storage remains **TD-008**.

Refresh single-flight / replay is intentionally deferred (**TD-006**) and must not be folded into generic HTTP retries.

## Batch 1.6 relationship

Batch 1.6 added a platform `StorageAdapter` Web helper at `apps/web/src/platform/storage` and shared utilities in `@nexus/shared-utils`.

- Auth token persistence remains **feature-owned** in `authStorage.ts` and is **not** migrated onto the platform adapter in Batch 1.6.
- Platform storage documentation: `docs/architecture/STORAGE_PLATFORM.md`.
- Do not treat either browser adapter as secure credential storage.
