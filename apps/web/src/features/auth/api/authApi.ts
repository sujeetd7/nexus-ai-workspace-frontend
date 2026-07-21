import { baseApi } from "../../../api/services";
import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  LogoutRequest,
  MessageResponse,
  RefreshTokenRequest,
  RegisterRequest,
  ResendVerificationRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from "../types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        data: body,
      }),
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        data: body,
      }),
    }),

    refreshToken: builder.mutation<AuthResponse, RefreshTokenRequest>({
      query: (body) => ({
        url: "/auth/refresh",
        method: "POST",
        data: body,
      }),
    }),

    logout: builder.mutation<void, LogoutRequest>({
      query: (body) => ({
        url: "/auth/logout",
        method: "POST",
        data: body,
      }),
    }),

    forgotPassword: builder.mutation<MessageResponse, ForgotPasswordRequest>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        data: body,
      }),
    }),

    resetPassword: builder.mutation<MessageResponse, ResetPasswordRequest>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        data: body,
      }),
    }),

    verifyEmail: builder.mutation<AuthResponse["user"], VerifyEmailRequest>({
      query: (body) => ({
        url: "/auth/verify-email",
        method: "POST",
        data: body,
      }),
    }),

    resendVerification: builder.mutation<
      MessageResponse,
      ResendVerificationRequest
    >({
      query: (body) => ({
        url: "/auth/resend-verification",
        method: "POST",
        data: body,
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
} = authApi;
