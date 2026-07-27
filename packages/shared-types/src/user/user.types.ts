/** User profile domain types — curated from Gateway OpenAPI (W6). */

export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

export interface UserProfile {
  readonly id: string;
  readonly authUserId: string;
  readonly email: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly avatar?: string;
  readonly status: UserStatus;
  readonly preferences?: Record<string, unknown>;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateUserProfileRequest {
  readonly authUserId: string;
  readonly email: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly avatar?: string;
}

export interface UpdateUserProfileRequest {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly avatar?: string;
  readonly preferences?: Record<string, unknown>;
  readonly status?: UserStatus;
}

export interface UserHttpClient {
  get<T>(url: string, config?: { signal?: AbortSignal }): Promise<{ data: T }>;
  post<T>(
    url: string,
    body?: unknown,
    config?: { signal?: AbortSignal },
  ): Promise<{ data: T }>;
  patch<T>(
    url: string,
    body?: unknown,
    config?: { signal?: AbortSignal },
  ): Promise<{ data: T }>;
  delete<T>(
    url: string,
    config?: { signal?: AbortSignal },
  ): Promise<{ data: T }>;
}

export interface CreateUserClientOptions {
  readonly client: UserHttpClient;
}

export interface UserClient {
  getCurrentUser(signal?: AbortSignal): Promise<UserProfile>;
  updateCurrentUser(
    input: UpdateUserProfileRequest,
    signal?: AbortSignal,
  ): Promise<UserProfile>;
  createUser(
    input: CreateUserProfileRequest,
    signal?: AbortSignal,
  ): Promise<UserProfile>;
}
