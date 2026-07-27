import { useEffect, type PropsWithChildren } from "react";
import { useDispatch } from "react-redux";

import { createBootstrapAction } from "../store/sagas/auth/authSaga";
import type { AppDispatch } from "../store/createAppStore";

export function AuthBootstrap({ children }: PropsWithChildren) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(createBootstrapAction());
  }, [dispatch]);

  return children;
}
