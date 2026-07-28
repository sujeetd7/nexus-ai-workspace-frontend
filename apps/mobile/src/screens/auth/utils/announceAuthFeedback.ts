import { AccessibilityInfo } from "react-native";

/** Announce auth status / validation feedback for VoiceOver and TalkBack. */
export function announceAuthFeedback(message: string): void {
  if (!message) {
    return;
  }
  AccessibilityInfo.announceForAccessibility(message);
}

export function announceFirstFieldError(
  errors: Partial<Record<string, string | undefined>>,
  fieldOrder: readonly string[],
): void {
  for (const field of fieldOrder) {
    const message = errors[field];
    if (message) {
      announceAuthFeedback(message);
      return;
    }
  }
}
