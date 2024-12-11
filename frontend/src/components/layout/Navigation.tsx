'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { FiMenu, FiX, FiUser } from 'react-icons/fi';

const publicRoutes = [
  { path: '/', label: 'Home' },
  { path: '/explore', label: 'Explore' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

const protectedRoutes = [
  { path: '/events', label: 'Events', requiresAuth: true },
  { path: '/gallery', label: 'Gallery', requiresAuth: true },
  { path: '/feedback', label: 'Feedback', requiresAuth: true },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Combine routes based on authentication status
  const mainRoutes = [
    ...publicRoutes,
    ...(user ? protectedRoutes : [])
  ];

  const handleLogout = async () => {
    try {
      await logout();
      // Force redirect to login page
      window.location.replace('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-[120px] h-[60px]">
              <Image
                width={0}
                height={0}
                src="/images/gold-hoy.png"
                alt="HOY Logo"
                fill
                sizes="120px"
                priority
                className="object-contain"
                style={{ objectFit: 'contain' }}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 px-8">
            {mainRoutes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={`text-sm font-medium transition-colors hover:text-gold px-4 ${
                  pathname === route.path ? 'text-gold' : 'text-white-plum'
                }`}
              >
                {route.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="relative group">
                <button
                  className="flex items-center space-x-2 text-white-plum hover:text-gold transition-colors"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <FiUser className="h-5 w-5" />
                  <span>{user.first_name}</span>
                </button>
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-coffee-bean ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-white-plum hover:text-gold transition-colors"
                        role="menuitem"
                        onClick={() => setIsOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-white-plum hover:text-gold transition-colors"
                        role="menuitem"
                        onClick={() => setIsOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-white-plum hover:text-gold transition-colors"
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-x-4">
                <Link
                  href="/login"
                  className="text-white-plum hover:text-gold transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-gold text-jet-black px-4 py-2 rounded-full hover:bg-gold/90 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white-plum hover:text-gold"
            >
              {isOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {mainRoutes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === route.path
                      ? 'text-gold'
                      : 'text-white-plum hover:text-gold'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {route.label}
                </Link>
              ))}
              {user && (
                <>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-white-plum hover:text-gold"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-3 py-2 rounded-md text-base font-medium text-white-plum hover:text-gold"
                    onClick={() => setIsOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white-plum hover:text-gold"
                  >
                    Sign out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
