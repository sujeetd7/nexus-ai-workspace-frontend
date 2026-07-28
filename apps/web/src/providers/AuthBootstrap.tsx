import { useEffect, type PropsWithChildren } from "react";
import { useDispatch } from "react-redux";

import { getWebSession } from "../api/client/axios";
import { createBootstrapAction } from "../store/sagas/auth/authSaga";
import type { AppDispatch } from "../store/createAppStore";
import { sessionExpired } from "../store/slices/auth/authSlice";

export function AuthBootstrap({ children }: PropsWithChildren) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(createBootstrapAction());

    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = getWebSession().subscribe((snapshot) => {
        if (snapshot.status === "session-expired") {
          dispatch(sessionExpired());
        }
      });
    } catch {
      // Session manager may be unavailable in isolated unit harnesses.
    }

    return () => {
      unsubscribe?.();
    };
  }, [dispatch]);

  return children;
}
