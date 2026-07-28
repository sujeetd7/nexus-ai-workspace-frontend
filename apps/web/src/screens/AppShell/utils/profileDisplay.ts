import type { AuthUser } from "@nexus/shared-types";

export function resolveProfileInitials(
  user: AuthUser | null | undefined,
): string {
  if (!user) {
    return "?";
  }

  const first = user.firstName?.trim().charAt(0) ?? "";
  const last = user.lastName?.trim().charAt(0) ?? "";
  const fromName = `${first}${last}`.trim();

  if (fromName) {
    return fromName.slice(0, 2).toUpperCase();
  }

  return user.email.trim().charAt(0).toUpperCase() || "?";
}

export function resolveProfileDisplayName(
  user: AuthUser | null | undefined,
): string {
  if (!user) {
    return "Account";
  }

  const parts = [user.firstName, user.lastName].filter(Boolean);
  if (parts.length > 0) {
    return parts.join(" ");
  }

  const localPart = user.email.split("@")[0]?.trim();
  return localPart || "Account";
}

export function resolveProfileEmail(
  user: AuthUser | null | undefined,
): string | undefined {
  return user?.email?.trim() || undefined;
}
