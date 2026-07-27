import { all } from "redux-saga/effects";
import { authSaga } from "../sagas/auth";
import { networkSaga } from "../sagas/network";

export function* rootSaga() {
  yield all([networkSaga(), authSaga()]);
}
