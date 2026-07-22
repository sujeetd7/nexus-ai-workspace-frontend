import { createApi } from "@reduxjs/toolkit/query/react";

import { axiosBaseQuery } from "../baseQuery";

/**
 * Empty RTK Query shell for mobile. No feature endpoints in Sprint 3.
 */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: [],
  endpoints: () => ({}),
});
