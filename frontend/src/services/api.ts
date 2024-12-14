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
    'Accept': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    console.log('Request URL:', config.url);
    console.log('Request Method:', config.method);
    console.log('Request Headers:', config.headers);
    
    const tokens = authService.getTokens();
    if (tokens?.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }

    // Add CSRF token if available
    const csrfToken = document.cookie.split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
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
    console.log('Response data:', response.data);
    return response;
  },
  async (error) => {
    console.error('Response error:', error);
    console.error('Response error data:', error.response?.data);
    
    if (error.response?.status === 401) {
      // Try to refresh the token
      try {
        await authService.refreshToken();
        // Retry the original request
        const config = error.config;
        const tokens = authService.getTokens();
        if (tokens?.access) {
          config.headers.Authorization = `Bearer ${tokens.access}`;
        }
        return axios(config);
      } catch (refreshError) {
        // If refresh fails, logout
        authService.logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
