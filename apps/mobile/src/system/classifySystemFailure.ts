/**
 * App-owned system failure classification for auth/bootstrap/API gates.
 * Prefers normalized status/code/causeType over message heuristics.
 */

export type SystemFailureKind =
  | "sessionExpired"
  | "unauthorized"
  | "forbidden"
  | "networkUnavailable"
  | "retryableApi"
  | "generic";

export type SystemFailurePrimaryAction = "signIn" | "retry" | "none";
export type SystemFailureSecondaryAction = "signOut" | "goBack" | "none";

export interface SystemFailureInput {
  readonly status?: number;
  readonly code?: string;
  readonly message?: string;
  readonly causeType?: string;
  readonly retryable?: boolean;
  readonly authAction?: string;
  readonly authorizationAction?: string;
  /**
   * `authenticated` — caller believed a session existed (protected/bootstrap).
   * `anonymous` — no recoverable session expected.
   */
  readonly context?: "authenticated" | "anonymous";
}

export interface SystemFailurePresentation {
  readonly kind: SystemFailureKind;
  readonly title: string;
  readonly message: string;
  readonly primaryAction: SystemFailurePrimaryAction;
  readonly secondaryAction: SystemFailureSecondaryAction;
  readonly retryable: boolean;
  readonly tone: "error" | "warning";
  /** Whether the authenticated shell must not render. */
  readonly blocksShell: boolean;
  /** Whether the session should be treated as invalid. */
  readonly requiresReauth: boolean;
}

const COPY: Record<
  SystemFailureKind,
  Pick<SystemFailurePresentation, "title" | "message" | "tone">
> = {
  sessionExpired: {
    title: "Session expired",
    message: "Your session has expired. Sign in again to continue.",
    tone: "error",
  },
  unauthorized: {
    title: "Sign-in required",
    message: "You need to sign in to access this content.",
    tone: "error",
  },
  forbidden: {
    title: "Access denied",
    message: "Your account does not have permission to access this content.",
    tone: "warning",
  },
  networkUnavailable: {
    title: "Service unavailable",
    message:
      "Unable to reach Nexus right now. Check your connection and try again.",
    tone: "error",
  },
  retryableApi: {
    title: "Something went wrong",
    message: "A temporary error occurred. Please try again.",
    tone: "error",
  },
  generic: {
    title: "Something went wrong",
    message: "The request could not be completed.",
    tone: "error",
  },
};

/**
 * Residual message heuristics (compatibility fallback only).
 * Used when status/code/causeType are absent — e.g. workspace bootstrap
 * string errors already written by app-owned bootstrap providers.
 */
function inferKindFromMessage(message: string): SystemFailureKind | undefined {
  const normalized = message.toLowerCase();
  if (normalized.includes("session has expired") || normalized.includes("sign in again")) {
    return "sessionExpired";
  }
  if (
    normalized.includes("do not have permission") ||
    normalized.includes("permission denied")
  ) {
    return "forbidden";
  }
  if (
    normalized.includes("connection") ||
    normalized.includes("network") ||
    normalized.includes("unreachable")
  ) {
    return "networkUnavailable";
  }
  return undefined;
}

function isNetworkLike(input: SystemFailureInput): boolean {
  if (input.causeType === "network" || input.causeType === "timeout") {
    return true;
  }
  const code = (input.code ?? "").toUpperCase();
  if (
    code === "NETWORK_ERROR" ||
    code === "ECONNABORTED" ||
    code === "ETIMEDOUT" ||
    code === "ERR_NETWORK"
  ) {
    return true;
  }
  return (
    input.status === 502 ||
    input.status === 503 ||
    input.status === 504
  );
}

function isRetryable(input: SystemFailureInput): boolean {
  if (typeof input.retryable === "boolean") {
    return input.retryable;
  }
  if (isNetworkLike(input)) {
    return true;
  }
  const status = input.status;
  if (status === undefined) {
    return true;
  }
  return status === 408 || status === 429 || (status >= 500 && status < 600);
}

export function classifySystemFailure(
  input: SystemFailureInput,
): SystemFailurePresentation {
  const context = input.context ?? "authenticated";
  const messageFallback =
    typeof input.message === "string" && input.message.trim().length > 0
      ? input.message.trim()
      : undefined;

  let kind: SystemFailureKind = "generic";

  const authReauth =
    input.authAction === "reauthenticate" ||
    input.authAction === "logout" ||
    input.status === 401;

  if (authReauth) {
    kind = context === "anonymous" ? "unauthorized" : "sessionExpired";
  } else if (
    input.authorizationAction === "showForbidden" ||
    input.status === 403
  ) {
    kind = "forbidden";
  } else if (isNetworkLike(input)) {
    kind = "networkUnavailable";
  } else {
    const fromMessage =
      !authReauth &&
      input.status === undefined &&
      !input.authorizationAction &&
      messageFallback
        ? inferKindFromMessage(messageFallback)
        : undefined;

    if (fromMessage) {
      kind = fromMessage;
    } else if (isRetryable(input)) {
      kind = "retryableApi";
    } else if (messageFallback) {
      kind = inferKindFromMessage(messageFallback) ?? "generic";
    }
  }

  const base = COPY[kind];
  const retryable =
    kind === "networkUnavailable" ||
    kind === "retryableApi" ||
    (isRetryable(input) && kind !== "sessionExpired" && kind !== "unauthorized" && kind !== "forbidden");

  const primaryAction: SystemFailurePrimaryAction =
    kind === "sessionExpired" || kind === "unauthorized"
      ? "signIn"
      : retryable
        ? "retry"
        : "none";

  const secondaryAction: SystemFailureSecondaryAction =
    kind === "forbidden" && context === "authenticated" ? "signOut" : "none";

  return {
    kind,
    title: base.title,
    message: messageFallback && kind === "generic" ? messageFallback : base.message,
    primaryAction,
    secondaryAction,
    retryable,
    tone: base.tone,
    blocksShell:
      kind === "sessionExpired" ||
      kind === "unauthorized" ||
      kind === "forbidden" ||
      kind === "networkUnavailable" ||
      kind === "retryableApi" ||
      kind === "generic",
    requiresReauth: kind === "sessionExpired" || kind === "unauthorized",
  };
}

/** Stable copy for workspace-list/bootstrap surfaces (keeps prior product wording). */
export function workspaceFailureCopy(
  kind: SystemFailureKind,
  fallbackMessage?: string,
): { title: string; message: string } {
  switch (kind) {
    case "sessionExpired":
      return {
        title: "Session expired",
        message: "Your session has expired. Sign in again to continue.",
      };
    case "unauthorized":
      return {
        title: "Sign-in required",
        message: "You need to sign in to view workspaces.",
      };
    case "forbidden":
      return {
        title: "Permission denied",
        message: "You do not have permission to view workspaces.",
      };
    case "networkUnavailable":
      return {
        title: "Service unavailable",
        message:
          "Unable to reach Nexus right now. Check your connection and try again.",
      };
    case "retryableApi":
      return {
        title: "Unable to load workspaces",
        message:
          fallbackMessage && fallbackMessage.trim().length > 0
            ? fallbackMessage
            : "A temporary error occurred. Please try again.",
      };
    default:
      return {
        title: "Unable to load workspaces",
        message:
          fallbackMessage && fallbackMessage.trim().length > 0
            ? fallbackMessage
            : COPY.generic.message,
      };
  }
}

/** Stable copy for profile / preferences surfaces. */
export function profileFailureCopy(
  kind: SystemFailureKind,
  fallbackMessage?: string,
): { title: string; message: string } {
  switch (kind) {
    case "sessionExpired":
      return {
        title: "Session expired",
        message: "Your session has expired. Sign in again to continue.",
      };
    case "unauthorized":
      return {
        title: "Sign-in required",
        message: "You need to sign in to view your profile.",
      };
    case "forbidden":
      return {
        title: "Permission denied",
        message: "You do not have permission to view this profile.",
      };
    case "networkUnavailable":
      return {
        title: "Service unavailable",
        message:
          "Unable to reach Nexus right now. Check your connection and try again.",
      };
    case "retryableApi":
      return {
        title: "Unable to load profile",
        message:
          fallbackMessage && fallbackMessage.trim().length > 0
            ? fallbackMessage
            : "A temporary error occurred. Please try again.",
      };
    default:
      return {
        title: "Unable to load profile",
        message:
          fallbackMessage && fallbackMessage.trim().length > 0
            ? fallbackMessage
            : COPY.generic.message,
      };
  }
}
