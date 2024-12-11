import { User } from '@/types/user';
import authService from '@/services/authService';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  profile: any | null;
  error: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (data: {
    email: string;
    password: string;
    password_confirm: string;
    first_name: string;
    last_name: string;
  }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  clearError: () => void;
}

const useAuthStore = create<AuthState>()(
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
            set({
              user: response.user,
              profile: response.profile,
              isAuthenticated: true,
              isLoading: false,
            });
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
          set({
            user: response.user,
            profile: response.profile,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          const message = error.message || 'Login failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await authService.logout();
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error: any) {
          const message = error.message || 'Logout failed';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const response = await authService.checkAuth();
          set({
            user: response.user,
            profile: response.profile,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error) {
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return false;
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