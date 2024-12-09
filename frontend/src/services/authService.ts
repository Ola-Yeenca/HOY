import { User, AuthTokens, LoginResponse, Profile, RegisterData } from '@/types/auth';
import api from './api';
import { SafeStorage } from '@/utils/safeStorage';
import { sessionManager } from '@/utils/sessionManager';

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

      // Store user data in session and cookies
      sessionManager.setCache(USER_KEY, response.data.user, SESSION_CACHE_TIME);
      sessionManager.setCookie('user_id', response.data.user.id.toString());
      
      // Set Authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
      this.handleError(error);
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/users/auth/login/', {
        email,
        password,
      });
      
      this.setTokens({
        access: response.data.access,
        refresh: response.data.refresh
      });

      // Store user data in session and cookies
      sessionManager.setCache(USER_KEY, response.data.user, SESSION_CACHE_TIME);
      sessionManager.setCookie('user_id', response.data.user.id.toString());
      
      // Set Authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      const tokens = this.getTokens();
      
      // If no tokens exist, just clear the auth state
      if (!tokens?.access) {
        this.clearAuth();
        return;
      }

      // Attempt to logout on the server
      try {
        await api.post('/users/auth/logout/', {}, {
          headers: {
            Authorization: `Bearer ${tokens.access}`
          }
        });
      } catch (error: any) {
        // Log the error but don't throw it - we still want to clear local state
        if (error.response?.status !== 401) {  // Ignore 401 errors
          console.error('Server logout failed:', error.response?.data || error.message);
        }
      }
    } finally {
      // Clear all session data and cookies
      this.clearAuth();
      sessionManager.clearAll();
    }
  }

  async checkAuth(): Promise<LoginResponse> {
    try {
      // Check session cache first
      const cachedUser = sessionManager.getCache<User>(USER_KEY);
      if (cachedUser) {
        return {
          user: cachedUser,
          access: this.getTokens()?.access || '',
          refresh: this.getTokens()?.refresh || '',
          profile: null
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
      sessionManager.setCache(USER_KEY, response.data.user, SESSION_CACHE_TIME);
      
      return response.data;
    } catch (error) {
      this.clearAuth();
      throw error;
    }
  }

  private setTokens(tokens: AuthTokens): void {
    storage.setItem(TOKEN_KEY, JSON.stringify(tokens));
    sessionManager.setCookie('auth_status', 'true');
  }

  private getTokens(): AuthTokens | null {
    const tokensStr = storage.getItem(TOKEN_KEY);
    return tokensStr ? JSON.parse(tokensStr) : null;
  }

  private clearAuth(): void {
    storage.removeItem(TOKEN_KEY);
    storage.removeItem(USER_KEY);
    delete api.defaults.headers.common['Authorization'];
  }
}

export default new AuthService();