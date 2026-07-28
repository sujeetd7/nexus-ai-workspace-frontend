export type AuthErrorKind =
  | "network"
  | "unauthorized"
  | "forbidden"
  | "invalidToken"
  | "expiredToken"
  | "generic";

export interface MappedAuthError {
  readonly message: string;
  readonly retryable: boolean;
  readonly status?: number;
  readonly code?: string;
  readonly kind: AuthErrorKind;
  readonly title: string;
}

function inferTokenKind(
  code: string | undefined,
  message: string,
): AuthErrorKind | undefined {
  const normalizedCode = (code ?? "").toUpperCase();
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedCode.includes("EXPIRED") ||
    normalizedMessage.includes("expired")
  ) {
    return "expiredToken";
  }

  if (
    normalizedCode.includes("INVALID_TOKEN") ||
    normalizedCode.includes("TOKEN_INVALID") ||
    normalizedMessage.includes("invalid token") ||
    normalizedMessage.includes("invalid link") ||
    normalizedMessage.includes("invalid reset") ||
    normalizedMessage.includes("invalid verification")
  ) {
    return "invalidToken";
  }

  return undefined;
}

export function classifyAuthError(input: {
  message: string;
  retryable: boolean;
  status?: number;
  code?: string;
  causeType?: string;
}): MappedAuthError {
  const { message, retryable, status, code, causeType } = input;
  const tokenKind = inferTokenKind(code, message);

  let kind: AuthErrorKind = "generic";
  if (tokenKind) {
    kind = tokenKind;
  } else if (causeType === "network" || causeType === "timeout") {
    kind = "network";
  } else if (status === 401) {
    kind = "unauthorized";
  } else if (status === 403) {
    kind = "forbidden";
  } else if (code === "NETWORK_ERROR") {
    kind = "network";
  }

  const titleByKind: Record<AuthErrorKind, string> = {
    network: "Connection problem",
    unauthorized: "Sign-in required",
    forbidden: "Access denied",
    invalidToken: "Invalid link",
    expiredToken: "Link expired",
    generic: "Request failed",
  };

  return {
    message,
    retryable,
    status,
    code,
    kind,
    title: titleByKind[kind],
  };
}

/** Titles for login-specific API failures. */
export function loginErrorTitle(kind: AuthErrorKind): string {
  if (kind === "unauthorized") {
    return "Unable to sign in";
  }
  if (kind === "network") {
    return "Connection problem";
  }
  return "Unable to sign in";
}
