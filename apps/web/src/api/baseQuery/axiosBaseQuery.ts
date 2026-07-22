import {
  createAxiosBaseQuery,
  type AxiosBaseQueryArgs,
  type BaseQueryError,
} from "@nexus/shared-network";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

import { axiosClient } from "../client";

export type { AxiosBaseQueryArgs, BaseQueryError };

/**
 * Resolves the Axios client per request so bootstrap can initialize the client
 * before any network activity without requiring baseApi recreation.
 */
export const axiosBaseQuery =
  (): BaseQueryFn<AxiosBaseQueryArgs, unknown, BaseQueryError> => {
    return async (args, api, extraOptions) => {
      const run = createAxiosBaseQuery(axiosClient);

      return run(
        {
          ...args,
          signal: args.signal ?? api.signal,
        },
        api,
        extraOptions,
      );
    };
  };
