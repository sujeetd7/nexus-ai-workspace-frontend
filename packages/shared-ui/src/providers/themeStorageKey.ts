/**
 * Canonical theme-preference storage identity owned by `@nexus/shared-ui`.
 *
 * Applications compose the namespaced key with shared-utils:
 * `createNamespacedStorageKey(THEME_STORAGE_SCOPE, THEME_STORAGE_KEY_NAME)`
 * which yields {@link THEME_PREFERENCE_STORAGE_KEY}.
 */
export const THEME_STORAGE_SCOPE = "prefs" as const;

export const THEME_STORAGE_KEY_NAME = "theme" as const;

/** Fully namespaced key: `nexus:prefs:theme`. */
export const THEME_PREFERENCE_STORAGE_KEY =
  `nexus:${THEME_STORAGE_SCOPE}:${THEME_STORAGE_KEY_NAME}` as const;
