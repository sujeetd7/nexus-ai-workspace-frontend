/**
 * Focus helpers for auth screens — web only (this batch).
 */

export function focusElementByTestId(testID: string): void {
  const root = globalThis as typeof globalThis & {
    document?: {
      querySelector: (selector: string) => HTMLElement | null;
    };
  };
  const node = root.document?.querySelector(
    `[data-testid="${testID}"]`,
  ) as HTMLElement | null;
  if (!node) {
    return;
  }
  if (typeof node.focus === "function") {
    node.focus();
  }
}

/**
 * Focus the first field input that has a validation error.
 * FormField inputs use `${fieldTestId}-input`.
 */
export function focusFirstFieldError(
  fieldErrors: Partial<Record<string, string | undefined>>,
  fieldOrder: readonly string[],
  testIdPrefix: string,
): void {
  for (const field of fieldOrder) {
    if (fieldErrors[field]) {
      focusElementByTestId(`${testIdPrefix}-${field}-input`);
      return;
    }
  }
}

/** Prefer focusing the status alert region after API failures. */
export function focusAuthStatus(testIdPrefix: string): void {
  const candidates = [
    `${testIdPrefix}-api-error`,
    `${testIdPrefix}-invalid-token`,
    `${testIdPrefix}-expired-token`,
    `${testIdPrefix}-success`,
  ];
  for (const id of candidates) {
    const root = globalThis as typeof globalThis & {
      document?: {
        querySelector: (selector: string) => HTMLElement | null;
      };
    };
    const node = root.document?.querySelector(
      `[data-testid="${id}"]`,
    ) as HTMLElement | null;
    if (node) {
      if (typeof node.focus === "function") {
        node.focus();
      }
      return;
    }
  }

  const root = globalThis as typeof globalThis & {
    document?: {
      querySelector: (selector: string) => HTMLElement | null;
    };
  };
  const status = root.document?.querySelector(
    `[data-testid="${testIdPrefix}-card-status"] [role="alert"], [data-testid^="${testIdPrefix}-"][role="alert"]`,
  ) as HTMLElement | null;
  status?.focus?.();
}
