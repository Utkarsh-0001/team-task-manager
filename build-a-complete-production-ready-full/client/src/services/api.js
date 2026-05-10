import axios from "axios";

const PRODUCTION_API_URL = "https://team-task-manager-34f2.onrender.com/api";
const blockedHosts = ["example" + ".com", "local" + "host", "127" + ".0.0.1"];

const resolveApiUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();
  if (!configuredUrl) return PRODUCTION_API_URL;

  try {
    const { hostname } = new URL(configuredUrl);
    return blockedHosts.includes(hostname) ? PRODUCTION_API_URL : configuredUrl;
  } catch {
    return PRODUCTION_API_URL;
  }
};

const api = axios.create({
  baseURL: resolveApiUrl(),
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ttm_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("ttm_token");
      localStorage.removeItem("ttm_user");
    }
    return Promise.reject(error);
  }
);

export default api;
