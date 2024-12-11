import axios from 'axios';
import authService from './authService';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const tokens = authService.getTokens();
    if (tokens?.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Only try to refresh if we have a refresh token
        const currentTokens = authService.getTokens();
        if (currentTokens?.refresh) {
          const tokens = await authService.refreshToken();
          if (tokens?.access) {
            // Update the original request with new token
            originalRequest.headers.Authorization = `Bearer ${tokens.access}`;
            // Retry the original request
            return api(originalRequest);
          }
        }
        // If we don't have refresh token or refresh failed, clear auth and redirect
        authService.clearAuth();
        window.location.replace('/login');
        return Promise.reject(error);
      } catch (refreshError) {
        // If refresh fails, clear auth and redirect
        authService.clearAuth();
        window.location.replace('/login');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
