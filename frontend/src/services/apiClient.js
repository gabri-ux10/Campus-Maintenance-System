import axios from "axios";
import toast from "react-hot-toast";

export const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "/api").trim() || "/api";
const requestTimeoutMs = Number(import.meta.env.VITE_API_TIMEOUT_MS || 15000);

let getAccessToken = () => null;
let refreshSessionHandler = null;
let clearSessionHandler = null;
let refreshPromise = null;

export const configureApiClientAuth = ({ accessTokenGetter, refreshSession, clearSession }) => {
  getAccessToken = typeof accessTokenGetter === "function" ? accessTokenGetter : () => null;
  refreshSessionHandler = typeof refreshSession === "function" ? refreshSession : null;
  clearSessionHandler = typeof clearSession === "function" ? clearSession : null;
};

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: requestTimeoutMs,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const AUTH_PAGES = ["/login", "/register", "/forgot-password", "/reset-password", "/accept-invite", "/verify-email"];
const isAuthPage = () => AUTH_PAGES.some((path) => window.location.pathname.startsWith(path));

const PUBLIC_ENDPOINTS = [
  "/analytics/public-summary",
  "/analytics/public-config",
  "/public/contact-support",
  "/catalog/support-categories",
];

const AUTH_REFRESH_ENDPOINTS = ["/auth/login", "/auth/refresh", "/auth/logout"];

const isPublicEndpoint = (url = "") => PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));
const isAuthRefreshEndpoint = (url = "") => AUTH_REFRESH_ENDPOINTS.some((endpoint) => url.includes(endpoint));

apiClient.interceptors.request.use((config) => {
  const url = config?.url || "";
  const token = getAccessToken();
  if (token && !isPublicEndpoint(url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config || {};
    const url = originalRequest?.url || "";
    const isRetried = Boolean(originalRequest.__retry);

    if (status === 401 && !isPublicEndpoint(url) && !isAuthRefreshEndpoint(url) && !isRetried && refreshSessionHandler) {
      try {
        refreshPromise ||= refreshSessionHandler();
        const refreshedSession = await refreshPromise;
        refreshPromise = null;
        if (refreshedSession?.accessToken) {
          originalRequest.__retry = true;
          originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: `Bearer ${refreshedSession.accessToken}`,
          };
          return apiClient(originalRequest);
        }
      } catch {
        refreshPromise = null;
      }
    }

    if (status === 401 && !isPublicEndpoint(url) && !isAuthRefreshEndpoint(url)) {
      clearSessionHandler?.();
      if (!isAuthPage()) {
        toast.error("Your session expired. Please sign in again.", { id: "session-expired" });
        window.location.href = "/login";
      }
    } else if (status === 403 && !isAuthRefreshEndpoint(url)) {
      toast.error("You don't have permission to perform this action.", { id: "forbidden" });
    } else if (status === 429) {
      const retryAfter = error?.response?.headers?.["retry-after"];
      const retryMessage = retryAfter
        ? `Too many requests. Please wait ${retryAfter} seconds and try again.`
        : "Too many requests. Please wait a moment and try again.";
      toast.error(retryMessage, { id: "rate-limited" });
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.", { id: "server-error" });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
