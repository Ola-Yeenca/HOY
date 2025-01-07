import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const AUTH_ENDPOINTS = ['/api/auth/token/', '/api/auth/token/refresh/', '/api/auth/token/verify/'];

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for handling HttpOnly cookies
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token && !AUTH_ENDPOINTS.includes(config.url || '')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Check for new access token in header
    const newToken = response.headers['new-access-token'];
    if (newToken) {
      Cookies.set('accessToken', newToken, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is not 401 or it's already a retry request, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Mark this request as retried
    originalRequest._retry = true;

    if (isRefreshing) {
      // If a token refresh is already in progress, wait for it
      try {
        const token = await new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    isRefreshing = true;

    try {
      const response = await api.post('/api/auth/token/refresh/');
      const { access } = response.data;
      
      Cookies.set('accessToken', access, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      originalRequest.headers.Authorization = `Bearer ${access}`;
      processQueue(null, access);
      
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      
      // Clear tokens and redirect to login
      Cookies.remove('accessToken');
      
      // Show error message
      toast.error('Your session has expired. Please log in again.');
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
