import { all } from "redux-saga/effects";
import { networkSaga } from "../sagas/network";

export function* rootSaga() {
  yield all([networkSaga()]);
}
