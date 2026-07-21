import axios from "axios";

import { api } from "../../config";
import {
  authInterceptor,
  errorInterceptor,
  requestInterceptor,
  responseInterceptor,
} from "../interceptors";

export const graphqlClient = axios.create({
  baseURL: api.graphql,
  timeout: 30_000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

graphqlClient.interceptors.request.use(requestInterceptor);

graphqlClient.interceptors.request.use(authInterceptor);

graphqlClient.interceptors.response.use(responseInterceptor, errorInterceptor);
