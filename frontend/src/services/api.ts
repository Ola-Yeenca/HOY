import axios from 'axios';
import authService from './authService';

const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side rendering
    return process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000/api';
  }
  // Client-side rendering
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
};

export const baseURL = getBaseUrl();

console.log('API Base URL:', baseURL);

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
  },
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    console.log('Request URL:', config.url);
    console.log('Request Method:', config.method);
    
    const tokens = authService.getTokens();
    if (tokens?.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response status:', response.status);
    return response;
  },
  async (error) => {
    console.error('Response error:', error.response?.data || error);
    
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
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        authService.clearAuth();
        window.location.replace('/login');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
