import { User, AuthTokens, LoginResponse, Profile, RegisterData } from '@/types/auth';
import api from './api';
import { SafeStorage } from '@/utils/safeStorage';
import { sessionManager } from '@/services/sessionManager';

const storage = new SafeStorage();
const TOKEN_KEY = 'auth_tokens';
const USER_KEY = 'user';
const SESSION_CACHE_TIME = 60; // Cache for 60 minutes

// Track refresh token promise to prevent multiple refresh attempts
let refreshPromise: Promise<AuthTokens> | null = null;

class AuthService {
  private handleError(error: any): never {
    const message = error.response?.data?.detail || 
                   error.response?.data?.message ||
                   error.message || 
                   'Authentication failed';
    throw new Error(message);
  }

  async register(data: RegisterData): Promise<LoginResponse> {
    try {
      console.log('Registration data:', data);
      
      const response = await api.post<LoginResponse>('/users/auth/register/', {
        email: data.email,
        password: data.password,
        password_confirm: data.password_confirm,
        first_name: data.firstName,
        last_name: data.lastName
      });
      
      console.log('Registration response:', response.data);
      
      this.setTokens({
        access: response.data.access,
        refresh: response.data.refresh
      });

      // Store user data
      this.setUserData(response.data.user);
      
      // Set auth status cookie
      sessionManager.setCookie('auth_status', 'authenticated', {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
      this.handleError(error);
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      console.log('Attempting login with URL:', api.defaults.baseURL);
      const response = await api.post<LoginResponse>('/users/auth/login/', {
        email,
        password,
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Login response:', response.data);
      
      if (!response.data.access || !response.data.refresh) {
        throw new Error('Invalid response: missing access or refresh tokens');
      }

      // Store tokens
      this.setTokens({
        access: response.data.access,
        refresh: response.data.refresh
      });

      // Store user data
      this.setUserData(response.data.user);
      
      // Set auth cookies with explicit options
      sessionManager.setCookie('auth_status', 'authenticated', {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: 7 // 7 days
      });

      if (response.data.user && response.data.user.id) {
        sessionManager.setCookie('user_id', response.data.user.id.toString(), {
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          expires: 7 // 7 days
        });
      }

      // Store tokens in localStorage for persistence
      localStorage.setItem('access_token', response.data.access);
      if (response.data.refresh) {
        localStorage.setItem('refresh_token', response.data.refresh);
      }

      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error);
      const errorMessage = error.response?.data?.detail || 
                         error.response?.data?.message ||
                         error.message || 
                         'Login failed. Please try again.';
      throw new Error(errorMessage);
    }
  }

  async logout(): Promise<void> {
    console.log('Logging out...');
    this.clearAuth();
    window.location.replace('/login');
  }

  async checkAuth(): Promise<LoginResponse> {
    try {
      // Check session cache first
      const cachedUser = this.getUserData();
      if (cachedUser) {
        return {
          user: cachedUser,
          access: this.getTokens()?.access || '',
          refresh: this.getTokens()?.refresh || '',
          profile: undefined
        };
      }

      // If no cached user, verify with server
      const tokens = this.getTokens();
      if (!tokens?.access) {
        throw new Error('No access token found');
      }

      const response = await api.get<LoginResponse>('/users/auth/me/', {
        headers: {
          Authorization: `Bearer ${tokens.access}`
        }
      });

      // Update cache with fresh data
      this.setUserData(response.data.user);
      
      return response.data;
    } catch (error) {
      this.clearAuth();
      throw error;
    }
  }

  async resetPassword(token: string, password: string): Promise<void> {
    try {
      await api.post('/users/auth/reset-password/', {
        token,
        password
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateProfilePicture(file: File): Promise<Profile> {
    try {
      const formData = new FormData();
      formData.append('profile_picture', file);

      const response = await api.patch<Profile>(
        '/users/profile/picture/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Update the stored user data with the new profile picture
      const currentUser = this.getUserData();
      if (currentUser) {
        this.setUserData({
          ...currentUser,
          profile: {
            ...currentUser.profile,
            profile_picture: response.data.profile_picture
          }
        });
      }

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  clearAuth(): void {
    console.log('Clearing auth state...');
    // Clear tokens
    storage.removeItem(TOKEN_KEY);
    
    // Clear session data
    sessionManager.removeCache(USER_KEY);
    sessionManager.removeCookie('auth_status');
    sessionManager.removeCookie('user_id');
    
    // Clear API headers
    delete api.defaults.headers.common['Authorization'];
  }

  setTokens(tokens: AuthTokens): void {
    storage.setItem(TOKEN_KEY, JSON.stringify(tokens));
  }

  getTokens(): AuthTokens | null {
    const tokens = storage.getItem(TOKEN_KEY);
    return tokens ? JSON.parse(tokens) : null;
  }

  setUserData(user: User): void {
    storage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUserData(): User | null {
    const user = storage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    const tokens = this.getTokens();
    const user = this.getUserData();
    const authStatus = sessionManager.getCookie('auth_status');
    return !!(tokens?.access && user && authStatus === 'authenticated');
  }

  async refreshToken(): Promise<AuthTokens | null> {
    try {
      const tokens = this.getTokens();
      if (!tokens?.refresh) {
        return null;
      }

      if (!refreshPromise) {
        refreshPromise = api
          .post<{ access: string }>('/users/auth/refresh/', {
            refresh: tokens.refresh,
          })
          .then((response) => {
            const newTokens = {
              access: response.data.access,
              refresh: tokens.refresh,
            };
            this.setTokens(newTokens);
            return newTokens;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      return refreshPromise;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearAuth();
      return null;
    }
  }
}

export default new AuthService();