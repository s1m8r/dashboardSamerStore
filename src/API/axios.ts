import { env } from "@/env";
import { useAuthStore } from "@/stores/userStore";
import axios from "axios";

const api = axios.create({
  baseURL: env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();

      // A 401 from the login request itself means bad credentials, not an
      // expired session - redirecting there would wipe the form error.
      const path = window.location.pathname;
      if (path !== "/login" && path !== "/register") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
