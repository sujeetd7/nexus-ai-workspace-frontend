import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { baseApi } from "../api/services";

import { rootReducer, rootSaga } from "./root";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
