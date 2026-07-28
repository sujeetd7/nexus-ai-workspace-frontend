# Sprint 5 — Web Authentication Experience (Batch 5.DS.5)

Product-screen refinement for existing web auth routes using completed Nexus Design System patterns. No shared-ui expansion.

## Scope

| Screen          | Route              | Classification | Notes                                                                                                                          |
| --------------- | ------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Login           | `/login`           | Refined        | AuthShell/AuthCard, PasswordField via FormField, InlineAlert, focus after errors. Remember-me omitted (not in `LoginRequest`). |
| Register        | `/register`        | Refined        | Backend fields only: email, password, optional firstName/lastName.                                                             |
| Forgot Password | `/forgot-password` | Refined        | Success hides form; retry / send-another.                                                                                      |
| Reset Password  | `/reset-password`  | Refined        | Missing/invalid/expired token states; client confirm password; API password only.                                              |
| Verify Email    | `/verify-email`    | Refined        | Loading Loader; invalid/expired/failure/success; retry reuses `verifyEmail`.                                                   |

Separate Verification Success / Invalid / Expired screens were **not** added — backend distinguishes via error code/message on the same endpoints; UI states live on Reset/Verify screens.

## Composition contract

Screens compose: `AuthShell`, `AuthCard`, `AuthFooter`, `FormField` (+ `PasswordField` via `secureTextEntry`), `InlineAlert`, `Button`, `Link`, `Loader`, `Stack`, `Text`.

Brand slot: **Nexus AI Workspace** (not ChatGPT/OpenAI).

## Error presentation

`mapApiError` + `classifyAuthError` map network / 401 / 403 / invalid-token / expired-token for titles and InlineAlert tones. Saga login failures use `normalizeFrontendApiError` messages.

## Storybook

| Title                          | Purpose                                                                     |
| ------------------------------ | --------------------------------------------------------------------------- |
| `Patterns/Auth/Login`          | default, submitting, disabled, fieldErrors, apiError, networkError, success |
| `Patterns/Auth/Registration`   | backend-aligned fields                                                      |
| `Patterns/Auth/ForgotPassword` | success + retry                                                             |
| `Patterns/Auth/ResetPassword`  | invalid/expired token                                                       |
| `Patterns/Auth/VerifyEmail`    | loading / success / invalid / expired / apiError                            |

## Out of scope

OAuth, mobile auth polish, shared-ui changes, application shell, workspace/profile/chat.

## Related (Batch 5.DS.7)

System-level Session Expired / Unauthorized / Forbidden / bootstrap failure UX lives outside auth forms — see `docs/sprint-5/SYSTEM_AUTH_FAILURE_UX.md`.
