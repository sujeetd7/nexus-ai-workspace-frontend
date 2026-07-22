import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";

import type { AppStore } from "../../store/createAppStore";

export interface ReduxProviderProps extends PropsWithChildren {
  readonly store: AppStore;
}

export function ReduxProvider({ children, store }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
