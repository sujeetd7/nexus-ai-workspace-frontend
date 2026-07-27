import type {
  CreateUserClientOptions,
  UserClient,
  UserProfile,
} from "@nexus/shared-types";

export function createUserClient(options: CreateUserClientOptions): UserClient {
  const { client } = options;

  return {
    async getCurrentUser(signal) {
      const { data } = await client.get<UserProfile>("/users/me", { signal });
      return data;
    },

    async updateCurrentUser(input, signal) {
      const { data } = await client.patch<UserProfile>("/users/me", input, {
        signal,
      });
      return data;
    },

    async createUser(input, signal) {
      const { data } = await client.post<UserProfile>("/users", input, {
        signal,
      });
      return data;
    },
  };
}
