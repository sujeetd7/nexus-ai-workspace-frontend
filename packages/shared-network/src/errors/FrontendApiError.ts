export type FrontendApiErrorAuthAction =
  | "none"
  | "refresh"
  | "logout"
  | "reauthenticate";

export type FrontendApiErrorAuthorizationAction =
  | "none"
  | "showForbidden"
  | "hideFeature";

export type FrontendApiErrorCauseType =
  | "http"
  | "network"
  | "timeout"
  | "cancelled"
  | "stream";

export interface FrontendApiError {
  readonly status?: number;
  readonly code: string;
  readonly message: string;
  readonly fieldErrors?: Readonly<Record<string, readonly string[]>>;
  readonly correlationId?: string;
  readonly retryable: boolean;
  readonly service?: string;
  readonly authAction?: FrontendApiErrorAuthAction;
  readonly authorizationAction?: FrontendApiErrorAuthorizationAction;
  readonly causeType: FrontendApiErrorCauseType;
}

export class FrontendApiErrorInstance extends Error implements FrontendApiError {
  readonly status?: number;
  readonly code: string;
  readonly fieldErrors?: Readonly<Record<string, readonly string[]>>;
  readonly correlationId?: string;
  readonly retryable: boolean;
  readonly service?: string;
  readonly authAction?: FrontendApiErrorAuthAction;
  readonly authorizationAction?: FrontendApiErrorAuthorizationAction;
  readonly causeType: FrontendApiErrorCauseType;

  constructor(details: FrontendApiError) {
    super(details.message, { cause: details });
    this.name = "FrontendApiError";
    this.status = details.status;
    this.code = details.code;
    this.fieldErrors = details.fieldErrors;
    this.correlationId = details.correlationId;
    this.retryable = details.retryable;
    this.service = details.service;
    this.authAction = details.authAction;
    this.authorizationAction = details.authorizationAction;
    this.causeType = details.causeType;
  }
}

export function isFrontendApiError(error: unknown): error is FrontendApiErrorInstance {
  return error instanceof FrontendApiErrorInstance;
}
