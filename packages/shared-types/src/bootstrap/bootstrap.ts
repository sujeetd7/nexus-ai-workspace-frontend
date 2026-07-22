/**
 * Cross-platform application bootstrap status and failure contracts.
 * Applications own runtime orchestration; this package owns shared shapes only.
 */

export type BootstrapStatus = "initializing" | "ready" | "failed";

/**
 * Stable bootstrap failure codes. Prefer these over raw platform messages.
 */
export const BOOTSTRAP_FAILURE_CODES = {
  CONFIGURATION_INVALID: "CONFIGURATION_INVALID",
  RUNTIME_INIT_FAILED: "RUNTIME_INIT_FAILED",
  STORE_INIT_FAILED: "STORE_INIT_FAILED",
} as const;

export type BootstrapFailureCode =
  (typeof BOOTSTRAP_FAILURE_CODES)[keyof typeof BOOTSTRAP_FAILURE_CODES];

export interface BootstrapFailure {
  readonly code: BootstrapFailureCode | string;
  /** Safe, user-facing message — never include secrets or raw env dumps. */
  readonly message: string;
  /** Original error for internal logging only. */
  readonly cause?: unknown;
  readonly retryable: boolean;
}

export type BootstrapOutcome<TRuntime> =
  | {
      readonly status: "ready";
      readonly runtime: TRuntime;
    }
  | {
      readonly status: "failed";
      readonly failure: BootstrapFailure;
    };
