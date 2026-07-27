import { useEffect, type PropsWithChildren } from "react";
import { useDispatch } from "react-redux";

import { getMobileSession } from "../api/client/axios";
import {
  sessionRestoreFailed,
  sessionRestoreStarted,
  sessionTokensRestored,
  sessionUserUpdated,
} from "../store/slices/auth/authSlice";
import type { AppDispatch } from "../store/createAppStore";

export function MobileAuthBootstrap({ children }: PropsWithChildren) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
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
  }, [dispatch]);

  return children;
}
