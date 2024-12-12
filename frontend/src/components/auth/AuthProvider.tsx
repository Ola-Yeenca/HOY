'use client';

import { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import authService from '@/services/authService';
import { usePathname } from 'next/navigation';
import { Loader } from '@/components/ui/loader';

const publicRoutes = ['/', '/login', '/register'];
const protectedRoutes = ['/admin', '/events', '/dashboard', '/gallery', '/profile', '/feedback'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  // Function to handle navigation
  const handleNavigation = () => {
    console.log('Handling navigation:', { pathname, isAuthenticated });
    
    const isLoginPage = pathname === '/login';
    const isPublicRoute = pathname ? publicRoutes.includes(pathname) : false;
    const isProtectedRoute = pathname ? protectedRoutes.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    ) : false;

    if (isAuthenticated) {
      console.log('User is authenticated');
      if (isLoginPage) {
        console.log('Redirecting to dashboard from login page');
        window.location.replace('/dashboard');
      }
    } else {
      console.log('User is not authenticated');
      if (isProtectedRoute) {
        console.log('Redirecting to login from protected route');
        const returnUrl = encodeURIComponent(pathname || '/');
        window.location.replace(`/login?returnUrl=${returnUrl}`);
      }
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      console.log('Initializing auth...', { pathname });
      try {
        const tokens = authService.getTokens();
        if (tokens) {
          await checkAuth();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading) {
      handleNavigation();
    }
  }, [isLoading, isAuthenticated, pathname]);

  if (isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
}
