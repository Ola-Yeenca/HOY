import { User } from '@/types/user';
import authService from '@/services/authService';
import sessionManager from '@/services/sessionManager';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  profile: any | null;
  error: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  register: (data: {
    email: string;
    password: string;
    password_confirm: string;
    first_name: string;
    last_name: string;
  }) => Promise<void>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<any>;
  clearError: () => void;
}

const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      error: null,
      isLoading: false,
      isAuthenticated: false,

      register: async (data) => {
        if (!get()) {
          set({ isLoading: true, error: null });
          try {
            const response = await authService.register({
              email: data.email,
              password: data.password,
              password_confirm: data.password_confirm,
              firstName: data.first_name,
              lastName: data.last_name
            });
            console.log('Register response:', response);
            set({
              user: response.user,
              profile: response.profile,
              isAuthenticated: true,
              isLoading: false,
            });
            console.log('Auth state updated:', { user: response.user, isAuthenticated: true });
          } catch (error: any) {
            const message = error.message || 'Registration failed';
            set({ error: message, isLoading: false });
            throw error;
          }
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(email, password);
          console.log('Login successful, updating auth state');
          
          // Update auth state
          set({
            user: response.user,
            profile: response.profile,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          // Set auth cookies
          sessionManager.setCookie('auth_status', 'authenticated', {
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });
          sessionManager.setCookie('user_id', response.user.id.toString(), {
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });

          return response;
        } catch (error: any) {
          console.error('Login failed:', error);
          set({ 
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message 
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
          console.log('Logout successful, clearing auth state');
          
          // Clear auth state
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });

          // Clear auth cookies
          sessionManager.removeCookie('auth_status');
          sessionManager.removeCookie('user_id');

          // Redirect to login
          window.location.replace('/login');
        } catch (error: any) {
          console.error('Logout failed:', error);
          set({ isLoading: false, error: error.message });
          throw error;
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const response = await authService.checkAuth();
          console.log('Auth check successful, updating state');
          
          // Update auth state
          set({
            user: response.user,
            profile: response.profile,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          // Set auth cookies
          sessionManager.setCookie('auth_status', 'authenticated', {
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });
          sessionManager.setCookie('user_id', response.user.id.toString(), {
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });

          return response;
        } catch (error: any) {
          console.error('Auth check failed:', error);
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.message
          });

          // Clear auth cookies
          sessionManager.removeCookie('auth_status');
          sessionManager.removeCookie('user_id');

          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// React hook wrapper
export function useAuth() {
  const state = useAuthStore();
  return {
    user: state.user,
    profile: state.profile,
    error: state.error,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    register: state.register,
    login: state.login,
    logout: state.logout,
    checkAuth: state.checkAuth,
    clearError: state.clearError,
  };
}

export default useAuth;