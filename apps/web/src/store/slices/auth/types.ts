export type {
  AuthResponse,
  AuthState,
  AuthTokens,
  AuthUser,
  ForgotPasswordRequest,
  LoginRequest,
  LogoutRequest,
  MessageResponse,
  RefreshTokenRequest,
  RegisterRequest,
  ResendVerificationRequest,
  ResetPasswordRequest,
  UserRole,
  VerifyEmailRequest,
} from "@nexus/shared-types";

export type AuthStatus = AuthState["status"];

import type { AuthState } from "@nexus/shared-types";
