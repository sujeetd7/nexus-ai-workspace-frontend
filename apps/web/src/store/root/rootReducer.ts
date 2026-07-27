import { combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "../../api/services";
import authReducer from "../slices/auth/authSlice";
import workspaceReducer from "../slices/workspace/workspaceSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  workspace: workspaceReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
