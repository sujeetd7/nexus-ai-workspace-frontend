# Theme Architecture

Theme engine details for `@nexus/shared-ui` (Batch 2.2 — finalized).

See also: [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md), [`../sprint-2/BATCH_MAP.md`](../sprint-2/BATCH_MAP.md).

Batch 2.2 absorbed theme-engine work. Batch 2.3 must not reimplement preference switching, persistence, or Tamagui theme sync.

## Responsibilities

| Layer                      | Responsibility                                                     |
| -------------------------- | ------------------------------------------------------------------ |
| Token modules              | Absolute design values                                             |
| `semanticColors`           | Role aliases derived from palette / darkColors                     |
| `lightTheme` / `darkTheme` | Assembled theme objects                                            |
| `ThemeProvider`            | Preference state, system subscription, persistence hooks           |
| `SharedUIProvider`         | Composition root: Tamagui + ThemeProvider + Tamagui `<Theme>` sync |
| Apps                       | Inject `StorageAdapter` + storage key; never own theme lifecycle   |

## Public `useTheme()` contract

```ts
const { theme, mode, preference, setPreference, setMode } = useTheme();
```

| Field           | Meaning                                                                                                                                                                                  |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `theme`         | Resolved Nexus theme object (`lightTheme` or `darkTheme`) including palette, semantic roles, and foundation tokens                                                                       |
| `mode`          | Resolved appearance after applying preference + system: always `"light"` or `"dark"`                                                                                                     |
| `preference`    | User (or default) preference: `"light"` \| `"dark"` \| `"system"`                                                                                                                        |
| `setPreference` | **Primary** setter. Updates preference, notifies listeners, and persists when storage is configured                                                                                      |
| `setMode`       | **Stable convenience API** for forcing `"light"` or `"dark"`. Implemented as `setPreference(mode)` — same lifecycle, persistence, and controlled-mode behavior. Cannot select `"system"` |

### Why both setters exist

- `setPreference` is the full preference API (including `"system"`).
- `setMode` is intentional sugar for UI that only toggles light/dark without offering system.
- `setMode` does **not** bypass persistence or controlled-mode rules.

### Backward compatibility

Batch 2.1 `useTheme()` returned the theme object directly (`ThemeContextValue` = light/dark theme). Batch 2.2 changed the return shape to the controller object above. No application call sites depended on the old shape at the time of the change. Callers that previously expected `useTheme().colors` must use `useTheme().theme.colors`.

## Switching

```ts
setPreference("dark");
setPreference("system");
setMode("light"); // identical to setPreference("light")
```

When `preference === "system"`, OS/browser scheme changes update `mode` and `theme`. Explicit `"light"` / `"dark"` preferences ignore system changes until preference changes.

## Persistence contract

Shared UI depends only on `StorageAdapter` from `@nexus/shared-types`. It never imports `localStorage`, AsyncStorage, or MMKV.

| Concern                | Owner                                                                                                                      |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Adapter implementation | Apps (`createLocalStorageAdapter` on web)                                                                                  |
| Storage key identity   | `@nexus/shared-ui` — `THEME_STORAGE_SCOPE`, `THEME_STORAGE_KEY_NAME`, `THEME_PREFERENCE_STORAGE_KEY` (`nexus:prefs:theme`) |
| Persistence optional   | Omit `storage` / `storageKey` (mobile default)                                                                             |

```ts
import {
  SharedUIProvider,
  THEME_PREFERENCE_STORAGE_KEY,
} from "@nexus/shared-ui";

<SharedUIProvider
  defaultPreference="system"
  storage={adapter}
  storageKey={THEME_PREFERENCE_STORAGE_KEY}
/>;
```

Stored value is the preference string (`light` | `dark` | `system`), not the resolved mode. Unknown/corrupted values are ignored (fallback to current/default preference). Read/write failures are swallowed so rendering and switching continue.

## System detection

- Web: `matchMedia("(prefers-color-scheme: dark)")` with `addEventListener`/`removeEventListener` cleanup (legacy `addListener` fallback)
- Native: React Native `Appearance.addChangeListener` with `subscription.remove()` cleanup
- `ThemeProvider` registers the subscription once (`useEffect` with `[]`) and unsubscribes on unmount
- Missing globals / failed `require("react-native")` are safe no-ops

## Tamagui synchronization

- Applications use only `SharedUIProvider`
- `tamaguiConfig` is created once at module load — theme switches do not recreate config
- Runtime sync uses Tamagui `<Theme name={mode}>` where `mode` is only `"light"` or `"dark"`
- Nexus context `mode` and Tamagui theme name are driven from the same resolved value

## Future themes

Add a new Nexus theme object and Tamagui theme entry in shared-ui. Keep app imports pointed at `SharedUIProvider` / `useTheme` so applications do not change.
