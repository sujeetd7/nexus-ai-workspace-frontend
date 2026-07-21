import axios from "axios";
import { api } from "../../config";
import {
  authInterceptor,
  errorInterceptor,
  requestInterceptor,
  responseInterceptor,
} from "../interceptors";

export const axiosClient = axios.create({
  baseURL: api.baseUrl,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use(requestInterceptor);

axiosClient.interceptors.request.use(authInterceptor);

axiosClient.interceptors.response.use(responseInterceptor, errorInterceptor);
