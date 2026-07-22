/**
 * Store factory and types. Prefer {@link createAppStore} from bootstrap;
 * the legacy singleton export is removed — use runtime.store after bootstrap.
 */
export {
  createAppStore,
  type AppDispatch,
  type AppStore,
  type AppStoreBundle,
  type CreateAppStoreOptions,
  type RootState,
} from "./createAppStore";
