import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware, { type SagaMiddleware } from "redux-saga";
import type { PublicClientConfig } from "@nexus/shared-types";

import { baseApi } from "../api/services";
import { rootReducer } from "./rootReducer";
import { rootSaga } from "./rootSaga";

export interface CreateAppStoreOptions {
  readonly config: PublicClientConfig;
  readonly startSaga?: boolean;
}

function buildStore(
  config: PublicClientConfig,
  sagaMiddleware: SagaMiddleware,
) {
  return configureStore({
    reducer: rootReducer,
    devTools: config.isDevelopment,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware, sagaMiddleware),
  });
}

export type AppStore = ReturnType<typeof buildStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export interface AppStoreBundle {
  readonly store: AppStore;
  readonly sagaMiddleware: SagaMiddleware;
  readonly sagaStarted: boolean;
}

export function createAppStore(options: CreateAppStoreOptions): AppStoreBundle {
  const sagaMiddleware = createSagaMiddleware();
  const startSaga = options.startSaga !== false;
  const store = buildStore(options.config, sagaMiddleware);

  let sagaStarted = false;
  if (startSaga) {
    sagaMiddleware.run(rootSaga);
    sagaStarted = true;
  }

  return { store, sagaMiddleware, sagaStarted };
}
