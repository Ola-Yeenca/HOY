import { User, AuthTokens, LoginResponse, Profile, RegisterData } from '@/types/auth';
import api from './api';
import { SafeStorage } from '@/utils/safeStorage';
import { sessionManager } from '@/services/sessionManager';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

const storage = new SafeStorage();
const USER_KEY = 'user';
const SESSION_CACHE_TIME = 60; // Cache for 60 minutes

class AuthService {
  private handleError(error: any): never {
    const message = error.response?.data?.detail || 
                   error.response?.data?.message ||
                   error.message || 
                   'Authentication failed';
    toast.error(message);
    throw new Error(message);
  }

  private setUserData(user: User) {
    storage.setItem(USER_KEY, JSON.stringify(user));
  }

  private clearUserData() {
    storage.removeItem(USER_KEY);
    Cookies.remove('accessToken', { path: '/' });
    sessionManager.removeCookie('auth_status');
  }

  async register(data: RegisterData): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/api/auth/register/', {
        email: data.email,
        password: data.password,
        password_confirm: data.password_confirm,
        first_name: data.firstName,
        last_name: data.lastName
      });
      
      const { access, user } = response.data;
      
      // Store access token in cookie
      Cookies.set('accessToken', access, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      // Store user data
      this.setUserData(user);
      
      // Set auth status cookie
      sessionManager.setCookie('auth_status', 'authenticated', {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/api/auth/token/', {
        email,
        password,
      });

      const { access, user } = response.data;
      
      // Store access token in cookie
      Cookies.set('accessToken', access, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      // Store user data
      this.setUserData(user);
      
      // Set auth status cookie
      sessionManager.setCookie('auth_status', 'authenticated', {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });

      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async logout() {
    try {
      await api.post('/api/auth/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearUserData();
      window.location.href = '/login';
    }
  }

  async verifyToken(): Promise<boolean> {
    try {
      const token = Cookies.get('accessToken');
      if (!token) return false;

      await api.post('/api/auth/token/verify/', { token });
      return true;
    } catch (error) {
      this.clearUserData();
      return false;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = storage.getItem(USER_KEY);
      if (!userData) {
        const response = await api.get<User>('/api/auth/me/');
        this.setUserData(response.data);
        return response.data;
      }
      return JSON.parse(userData);
    } catch (error) {
      this.clearUserData();
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!Cookies.get('accessToken');
  }
}

export default new AuthService();