import { z } from "zod";

import { emailSchema } from "../primitives/strings";

const workspaceRoleSchema = z.enum(["OWNER", "ADMIN", "DEVELOPER", "VIEWER"]);

export const createWorkspaceSchema = z
  .object({
    name: z.string().trim().min(1, "Workspace name is required"),
    description: z.string().trim().optional(),
    ownerId: z.string().min(1),
  })
  .strict();

export const updateWorkspaceSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    description: z.string().trim().optional(),
    status: z.enum(["ACTIVE", "ARCHIVED", "SUSPENDED"]).optional(),
  })
  .strict();

export const inviteMemberSchema = z
  .object({
    email: emailSchema,
    invitedBy: z.string().min(1),
    role: workspaceRoleSchema,
  })
  .strict();

export const addMemberSchema = z
  .object({
    userId: z.string().min(1),
    role: workspaceRoleSchema,
  })
  .strict();

export const updateMemberRoleSchema = z
  .object({
    role: workspaceRoleSchema,
  })
  .strict();

export const acceptInvitationSchema = z
  .object({
    token: z.string().min(1, "Invitation token is required"),
    email: emailSchema.optional(),
  })
  .strict();

export const rejectInvitationSchema = z
  .object({
    token: z.string().min(1, "Invitation token is required"),
  })
  .strict();
