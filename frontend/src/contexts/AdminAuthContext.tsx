'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminAuthApi } from '@/services/adminApi';
import { toast } from 'react-hot-toast';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: async () => {},
  logout: async () => {},
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await adminAuthApi.checkAuth();
      setIsAuthenticated(true);
      setUser(response.user);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      // Only redirect if we're in an admin route
      if (window.location.pathname.startsWith('/admin') && 
          !window.location.pathname.includes('/admin/auth')) {
        router.push('/admin/auth/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await adminAuthApi.login({ email, password });
      localStorage.setItem('authToken', response.access);
      localStorage.setItem('refreshToken', response.refresh);
      setIsAuthenticated(true);
      setUser(response.user);
      toast.success('Successfully logged in');
      router.push('/admin');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to login');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await adminAuthApi.logout();
      setIsAuthenticated(false);
      setUser(null);
      router.push('/admin/auth/login');
      toast.success('Successfully logged out');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to logout');
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}
