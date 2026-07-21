import {
  createAxiosBaseQuery,
  type AxiosBaseQueryArgs,
  type BaseQueryError,
} from "@nexus/shared-network";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

import { axiosClient } from "../client";

export type { AxiosBaseQueryArgs, BaseQueryError };

export const axiosBaseQuery =
  (): BaseQueryFn<AxiosBaseQueryArgs, unknown, BaseQueryError> => {
    const run = createAxiosBaseQuery(axiosClient);

    return async (args, api, extraOptions) =>
      run(
        {
          ...args,
          signal: args.signal ?? api.signal,
        },
        api,
        extraOptions,
      );
  };
