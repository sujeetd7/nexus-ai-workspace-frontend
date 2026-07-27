/** Auth domain types — curated from Gateway OpenAPI (W5). */

export type UserRole = "USER" | "ADMIN" | "MANAGER";

export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly role: UserRole | string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly emailVerified: boolean;
  readonly isActive: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface AuthTokens {
  readonly accessToken: string;
  readonly refreshToken: string;
}

export interface AuthResponse {
  readonly user: AuthUser;
  readonly tokens: AuthTokens;
}

export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

export interface RegisterRequest {
  readonly email: string;
  readonly password: string;
  readonly firstName?: string;
  readonly lastName?: string;
}

export interface RefreshTokenRequest {
  readonly refreshToken: string;
}

export interface LogoutRequest {
  readonly refreshToken: string;
}

export interface ForgotPasswordRequest {
  readonly email: string;
}

export interface ResetPasswordRequest {
  readonly token: string;
  readonly password: string;
}

export interface VerifyEmailRequest {
  readonly token: string;
}

export interface ResendVerificationRequest {
  readonly email: string;
}

export interface MessageResponse {
  readonly success?: boolean;
  readonly message: string;
}

export interface AuthSessionInfo {
  readonly id: string;
  readonly deviceName?: string;
  readonly ipAddress?: string;
  readonly userAgent?: string;
  readonly createdAt: string;
  readonly lastActiveAt?: string;
  readonly current?: boolean;
}

export type AuthSessionStatus =
  | "bootstrapping"
  | "authenticated"
  | "unauthenticated"
  | "session-expired";

export interface AuthState {
  readonly accessToken: string | null;
  readonly refreshToken: string | null;
  readonly user: AuthUser | null;
  readonly authenticated: boolean;
  readonly loading: boolean;
  readonly initialized: boolean;
  readonly status: AuthSessionStatus | "idle" | "restoring";
  readonly error: string | null;
}

/** Minimal HTTP adapter contract for app-owned auth clients. */
export interface AuthHttpClient {
  post<TResponse>(
    url: string,
    data?: unknown,
    config?: { signal?: AbortSignal }
  ): Promise<{ data: TResponse }>;
  get<TResponse>(
    url: string,
    config?: { signal?: AbortSignal }
  ): Promise<{ data: TResponse }>;
  delete<TResponse>(
    url: string,
    config?: { signal?: AbortSignal }
  ): Promise<{ data: TResponse }>;
}

/** Typed Gateway auth operations — implemented in app API layers only. */
export interface AuthClient {
  register(input: RegisterRequest, signal?: AbortSignal): Promise<AuthResponse>;
  login(input: LoginRequest, signal?: AbortSignal): Promise<AuthResponse>;
  refresh(
    input: RefreshTokenRequest,
    signal?: AbortSignal
  ): Promise<AuthResponse>;
  logout(input: LogoutRequest, signal?: AbortSignal): Promise<void>;
  logoutAll(signal?: AbortSignal): Promise<void>;
  listSessions(signal?: AbortSignal): Promise<AuthSessionInfo[]>;
  revokeSession(sessionId: string, signal?: AbortSignal): Promise<void>;
  verifyEmail(
    input: VerifyEmailRequest,
    signal?: AbortSignal
  ): Promise<AuthResponse>;
  resendVerification(
    input: ResendVerificationRequest,
    signal?: AbortSignal
  ): Promise<MessageResponse>;
  forgotPassword(
    input: ForgotPasswordRequest,
    signal?: AbortSignal
  ): Promise<MessageResponse>;
  resetPassword(
    input: ResetPasswordRequest,
    signal?: AbortSignal
  ): Promise<MessageResponse>;
}

export interface CreateAuthClientOptions {
  readonly client: AuthHttpClient;
}
