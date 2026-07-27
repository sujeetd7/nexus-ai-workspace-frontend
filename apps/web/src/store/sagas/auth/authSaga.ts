import { takeLatest, put, call } from "redux-saga/effects";

import { getWebSession } from "../../../api/client/axios";
import {
  authFailure,
  authSuccess,
  loginRequest,
  logoutCompleted,
  sessionRestoreFailed,
  sessionRestoreStarted,
  sessionTokensRestored,
  sessionUserUpdated,
} from "../../slices/auth/authSlice";
import type { AuthResponse } from "../../slices/auth/types";

export const AUTH_ACTIONS = {
  BOOTSTRAP: "auth/bootstrap",
  LOGIN: "auth/login",
  LOGOUT: "auth/logout",
  LOGOUT_ALL: "auth/logoutAll",
} as const;

export interface LoginPayload {
  readonly email: string;
  readonly password: string;
}

function* bootstrapSession() {
  yield put(sessionRestoreStarted());

  try {
    const snapshot: Awaited<ReturnType<ReturnType<typeof getWebSession>["bootstrap"]>> =
      yield call([getWebSession(), "bootstrap"]);

    if (snapshot.status === "authenticated" && snapshot.accessToken && snapshot.refreshToken) {
      yield put(
        sessionTokensRestored({
          accessToken: snapshot.accessToken,
          refreshToken: snapshot.refreshToken,
        }),
      );

      if (snapshot.user) {
        yield put(sessionUserUpdated(snapshot.user));
      }
      return;
    }

    yield put(sessionRestoreFailed());
  } catch {
    yield put(sessionRestoreFailed());
  }
}

function* loginWorker(action: { payload: LoginPayload }) {
  yield put(loginRequest());

  try {
    const snapshot: Awaited<ReturnType<ReturnType<typeof getWebSession>["login"]>> =
      yield call([getWebSession(), "login"], action.payload.email, action.payload.password);

    if (snapshot.user && snapshot.accessToken && snapshot.refreshToken) {
      const response: AuthResponse = {
        user: snapshot.user,
        tokens: {
          accessToken: snapshot.accessToken,
          refreshToken: snapshot.refreshToken,
        },
      };
      yield put(authSuccess(response));
      return;
    }

    yield put(authFailure("Unable to sign in."));
  } catch (error) {
    yield put(
      authFailure(
        error instanceof Error ? error.message : "Unable to sign in.",
      ),
    );
  }
}

function* logoutWorker() {
  try {
    yield call([getWebSession(), "logout"]);
  } finally {
    yield put(logoutCompleted());
  }
}

function* logoutAllWorker() {
  try {
    yield call([getWebSession(), "logoutAll"]);
  } finally {
    yield put(logoutCompleted());
  }
}

export function* authSaga(): Generator {
  yield takeLatest(AUTH_ACTIONS.BOOTSTRAP, bootstrapSession);
  yield takeLatest(AUTH_ACTIONS.LOGIN as never, loginWorker);
  yield takeLatest(AUTH_ACTIONS.LOGOUT, logoutWorker);
  yield takeLatest(AUTH_ACTIONS.LOGOUT_ALL, logoutAllWorker);
}

export function createLoginAction(payload: LoginPayload) {
  return { type: AUTH_ACTIONS.LOGIN, payload };
}

export function createBootstrapAction() {
  return { type: AUTH_ACTIONS.BOOTSTRAP };
}

export function createLogoutAction() {
  return { type: AUTH_ACTIONS.LOGOUT };
}

export function createLogoutAllAction() {
  return { type: AUTH_ACTIONS.LOGOUT_ALL };
}
