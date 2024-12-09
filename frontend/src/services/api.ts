import axios from 'axios';
import authService from './authService';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Get CSRF token for mutation requests
    if (['post', 'put', 'patch', 'delete'].includes(config.method || '')) {
      try {
        await api.get('/users/auth/csrf/');
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      }
    }

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
        // If we don't have refresh token or refresh failed, logout
        await authService.logout();
        return Promise.reject(error);
      } catch (refreshError) {
        // Only logout if refresh actually failed (not for other errors)
        if (refreshError.response?.status === 401) {
          await authService.logout();
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
