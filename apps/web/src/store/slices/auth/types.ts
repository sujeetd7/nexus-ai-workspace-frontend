export interface User {
  id: string;

  email: string;

  name: string;

  roles: string[];
}

export interface AuthState {
  token: string | null;

  refreshToken: string | null;

  user: User | null;

  authenticated: boolean;

  loading: boolean;
}
