import axios from "axios";
import store from "../redux/store.js";
import { logout } from "../redux/slices/authSlice.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true
});

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || "";
    const isAuthRequest = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout", "/auth/forgot-password", "/auth/reset-password"]
      .some((path) => requestUrl.endsWith(path));

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry || isAuthRequest) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    refreshPromise ??= refreshClient.post("/auth/refresh").finally(() => {
      refreshPromise = null;
    });

    try {
      await refreshPromise;
      return api(originalRequest);
    } catch (refreshError) {
      if (refreshError.response?.status === 401) {
        store.dispatch(logout());
      }
      return Promise.reject(refreshError);
    }
  },
);

export default api;