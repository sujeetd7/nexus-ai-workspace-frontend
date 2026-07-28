/**
 * @vitest-environment jsdom
 */

import { describe, expect, it } from "vitest";

import type { AuthUser } from "@nexus/shared-types";

import {
  resolveProfileDisplayName,
  resolveProfileEmail,
  resolveProfileInitials,
} from "./profileDisplay";

const mockUser: AuthUser = {
  id: "user-1",
  email: "alex@example.com",
  role: "USER",
  firstName: "Alex",
  lastName: "Rivera",
  emailVerified: true,
  isActive: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("profileDisplay", () => {
  it("resolves initials from first and last name", () => {
    expect(resolveProfileInitials(mockUser)).toBe("AR");
  });

  it("falls back to email initial when name is missing", () => {
    expect(
      resolveProfileInitials({ ...mockUser, firstName: undefined, lastName: undefined }),
    ).toBe("A");
  });

  it("falls back gracefully when user is unavailable", () => {
    expect(resolveProfileInitials(null)).toBe("?");
    expect(resolveProfileDisplayName(undefined)).toBe("Account");
    expect(resolveProfileEmail(null)).toBeUndefined();
  });

  it("resolves display name and email", () => {
    expect(resolveProfileDisplayName(mockUser)).toBe("Alex Rivera");
    expect(resolveProfileEmail(mockUser)).toBe("alex@example.com");
  });
});
