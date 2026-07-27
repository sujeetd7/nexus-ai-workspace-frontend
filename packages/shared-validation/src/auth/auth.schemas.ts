import { z } from "zod";

import { emailSchema, passwordSchema } from "../primitives/strings";

export const loginRequestSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1, "Password is required"),
  })
  .strict();

export const registerRequestSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    firstName: z.string().trim().min(1).optional(),
    lastName: z.string().trim().min(1).optional(),
  })
  .strict();

export const forgotPasswordRequestSchema = z
  .object({
    email: emailSchema,
  })
  .strict();

export const resetPasswordRequestSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: passwordSchema,
  })
  .strict();

export const verifyEmailRequestSchema = z
  .object({
    token: z.string().min(1, "Verification token is required"),
  })
  .strict();

export const resendVerificationRequestSchema = z
  .object({
    email: emailSchema,
  })
  .strict();
