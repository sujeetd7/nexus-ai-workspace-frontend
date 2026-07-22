import { storageError } from "../errors/appError";

function hasDisallowedCharacters(value: string): boolean {
  for (const character of value) {
    const code = character.charCodeAt(0);
    if (code <= 0x1f || code === 0x7f) {
      return true;
    }
  }
  return false;
}

/**
 * Builds a deterministic namespaced storage key: `nexus:<scope>:<key>`.
 * Feature packages own their key constants; this only formats the namespace.
 */
export function createNamespacedStorageKey(scope: string, key: string): string {
  const normalizedScope = scope.trim();
  const normalizedKey = key.trim();

  if (normalizedScope.length === 0) {
    throw storageError("Invalid storage key scope.", {
      operation: "namespace",
      failure: "invalid_scope",
    });
  }

  if (normalizedKey.length === 0) {
    throw storageError("Invalid storage key name.", {
      operation: "namespace",
      failure: "invalid_key",
    });
  }

  if (
    hasDisallowedCharacters(normalizedScope) ||
    hasDisallowedCharacters(normalizedKey)
  ) {
    throw storageError("Invalid storage key characters.", {
      operation: "namespace",
      failure: "invalid_characters",
    });
  }

  if (normalizedScope.includes(":") || normalizedKey.includes(":")) {
    throw storageError("Invalid storage key separators.", {
      operation: "namespace",
      failure: "invalid_separator",
    });
  }

  return `nexus:${normalizedScope}:${normalizedKey}`;
}
