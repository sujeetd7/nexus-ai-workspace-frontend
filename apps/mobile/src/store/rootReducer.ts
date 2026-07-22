import { combineReducers } from "@reduxjs/toolkit";

import { baseApi } from "../api/services";

/**
 * Mobile root reducer — RTK Query infrastructure only (no feature/auth state).
 */
export const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
});

export type RootReducerState = ReturnType<typeof rootReducer>;
