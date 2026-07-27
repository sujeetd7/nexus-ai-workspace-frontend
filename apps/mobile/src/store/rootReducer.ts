import { combineReducers } from "@reduxjs/toolkit";

import { baseApi } from "../api/services";
import authReducer from "./slices/auth/authSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export type RootReducerState = ReturnType<typeof rootReducer>;
