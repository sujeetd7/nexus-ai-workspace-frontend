# Theme Architecture

Theme engine details for `@nexus/shared-ui` (Batch 2.2).

See also: [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md).

## Responsibilities

| Layer                      | Responsibility                                                     |
| -------------------------- | ------------------------------------------------------------------ |
| Token modules              | Absolute design values                                             |
| `semanticColors`           | Role aliases derived from palette / darkColors                     |
| `lightTheme` / `darkTheme` | Assembled theme objects                                            |
| `ThemeProvider`            | Preference state, system subscription, persistence hooks           |
| `SharedUIProvider`         | Composition root: Tamagui + ThemeProvider + Tamagui `<Theme>` sync |
| Apps                       | Inject `StorageAdapter` + storage key; never own theme lifecycle   |

## Switching

```ts
const { mode, preference, setPreference, setMode, theme } = useTheme();

setPreference("dark");
setPreference("system");
setMode("light"); // same as setPreference("light")
```

## Persistence contract

```ts
<SharedUIProvider
  defaultPreference="system"
  storage={adapter}
  storageKey={createNamespacedStorageKey("prefs", "theme")}
/>
```

Stored value is the preference string (`light` | `dark` | `system`), not the resolved mode.

## System detection

- Web: `matchMedia("(prefers-color-scheme: dark)")` with change subscription
- Native: React Native `Appearance` when available
- Implemented in `appearance/appearance.ts`

## Future themes

Add a new Nexus theme object and Tamagui theme entry in shared-ui. Keep app imports pointed at `SharedUIProvider` / `useTheme` so applications do not change.
