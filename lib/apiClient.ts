import axios from "axios";
import { API_BASE_URL, API_TIMEOUT } from "./config";

const getTokenFromCookie = (): string | null => {
  if (typeof document === "undefined") return null;

  const cookieString = document.cookie;
  const cookies = cookieString.split("; ");
  const authTokenCookie = cookies.find((cookie) =>
    cookie.startsWith("auth-token=")
  );

  if (authTokenCookie) {
    return authTokenCookie.split("=")[1];
  }

  return null;
};

const getLocaleFromCookie = (): string => {
  if (typeof document === "undefined") return "en";

  const cookieString = document.cookie;
  const cookies = cookieString.split("; ");
  const localeCookie = cookies.find((cookie) =>
    cookie.startsWith("NEXT_LOCALE=")
  );

  if (localeCookie) {
    return localeCookie.split("=")[1];
  }

  return "en";
};

const clearAuthCookie = () => {
  document.cookie =
    "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; SameSite=Strict;";
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getTokenFromCookie();
    const selectedLanguage = getLocaleFromCookie();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["Accept-Language"] = selectedLanguage;

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearAuthCookie();
    }
    console.error("API Error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default apiClient;
