import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import authService from '@/services/authService';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const checkAuthStatus = useCallback(async () => {
    try {
      const tokens = authService.getTokens();
      if (!tokens?.access) {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      const response = await api.get('/users/me/');
      const userData = response.data;
      
      setAuthState({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email });
      const response = await api.post('/users/auth/login/', { email, password });
      console.log('Login response:', response.data);

      const { access, refresh, user } = response.data;
      authService.setTokens({ access, refresh });

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/users/auth/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authService.logout();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      router.push('/login');
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await api.post('/users/auth/register/', {
        email,
        password,
        name,
      });
      
      const { access, refresh, user } = response.data;
      authService.setTokens({ access, refresh });

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  return {
    ...authState,
    login,
    logout,
    register,
    checkAuthStatus,
  };
}