import type {
  CreateUserProfileRequest,
  UpdateUserProfileRequest,
  UserProfile,
} from "@nexus/shared-types";

import { baseApi } from "../baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<UserProfile, void>({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      providesTags: ["UserProfile"],
    }),

    updateCurrentUser: builder.mutation<UserProfile, UpdateUserProfileRequest>({
      query: (body) => ({
        url: "/users/me",
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["UserProfile"],
    }),

    createUserProfile: builder.mutation<UserProfile, CreateUserProfileRequest>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["UserProfile"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
  useCreateUserProfileMutation,
} = userApi;
