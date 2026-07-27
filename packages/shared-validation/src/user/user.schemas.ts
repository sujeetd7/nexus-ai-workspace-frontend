import { z } from "zod";

import { emailSchema } from "../primitives/strings";

export const updateUserProfileSchema = z
  .object({
    firstName: z.string().trim().min(1).optional(),
    lastName: z.string().trim().min(1).optional(),
    avatar: z.string().url().optional(),
    preferences: z.record(z.string(), z.unknown()).optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "BLOCKED"]).optional(),
  })
  .strict();

export const createUserProfileSchema = z
  .object({
    authUserId: z.string().min(1),
    email: emailSchema,
    firstName: z.string().trim().min(1).optional(),
    lastName: z.string().trim().min(1).optional(),
    avatar: z.string().url().optional(),
  })
  .strict();

export const userPreferencesSchema = z
  .object({
    preferences: z.record(z.string(), z.unknown()),
  })
  .strict();
