import { useEffect, type PropsWithChildren } from "react";
import { useDispatch } from "react-redux";

import { getMobileSession } from "../api/client/axios";
import {
  sessionExpired,
  sessionRestoreFailed,
  sessionRestoreStarted,
  sessionTokensRestored,
  sessionUserUpdated,
} from "../store/slices/auth/authSlice";
import type { AppDispatch } from "../store/createAppStore";

export function MobileAuthBootstrap({ children }: PropsWithChildren) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = getMobileSession().subscribe((snapshot) => {
        if (snapshot.status === "session-expired") {
          dispatch(sessionExpired());
        }
      });
    } catch {
      // Session manager may be unavailable in isolated unit harnesses.
    }

    const bootstrap = async () => {
      dispatch(sessionRestoreStarted());
      try {
        const snapshot = await getMobileSession().bootstrap();
        if (
          snapshot.status === "authenticated" &&
          snapshot.accessToken &&
          snapshot.refreshToken
        ) {
          dispatch(
            sessionTokensRestored({
              accessToken: snapshot.accessToken,
              refreshToken: snapshot.refreshToken,
            }),
          );
          if (snapshot.user) {
            dispatch(sessionUserUpdated(snapshot.user));
          }
          return;
        }
        dispatch(sessionRestoreFailed());
      } catch {
        dispatch(sessionRestoreFailed());
      }
    };

    void bootstrap();

    return () => {
      unsubscribe?.();
    };
  }, [dispatch]);

  return children;
}
