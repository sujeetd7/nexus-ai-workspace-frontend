import { all } from "redux-saga/effects";

/**
 * Platform root saga — no feature sagas in Sprint 3.
 */
export function* rootSaga() {
  yield all([]);
}
