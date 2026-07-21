import type { AuthUser } from "../../../features/auth/types";

export type AuthStatus =
  | "idle"
  | "restoring"
  | "authenticated"
  | "unauthenticated";

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  authenticated: boolean;
  loading: boolean;
  initialized: boolean;
  status: AuthStatus;
  error: string | null;
}
