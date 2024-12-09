import { SafeStorage } from './safeStorage';
import Cookies from 'js-cookie';

interface SessionData {
  [key: string]: any;
}

class SessionManager {
  private storage: SafeStorage;
  private readonly COOKIE_PREFIX = 'hoy_';
  private readonly SESSION_PREFIX = 'hoy_session_';
  private readonly DEFAULT_COOKIE_OPTIONS = {
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/'
  };

  constructor() {
    this.storage = new SafeStorage();
  }

  // Session Storage Methods
  setSessionData(key: string, data: any): void {
    try {
      const sessionKey = this.SESSION_PREFIX + key;
      this.storage.setItem(sessionKey, JSON.stringify(data));
    } catch (error) {
      console.warn(`Failed to set session data for key ${key}:`, error);
    }
  }

  getSessionData<T>(key: string): T | null {
    try {
      const sessionKey = this.SESSION_PREFIX + key;
      const data = this.storage.getItem(sessionKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn(`Failed to get session data for key ${key}:`, error);
      return null;
    }
  }

  removeSessionData(key: string): void {
    const sessionKey = this.SESSION_PREFIX + key;
    this.storage.removeItem(sessionKey);
  }

  // Cookie Methods
  setCookie(key: string, value: string, options?: Cookies.CookieAttributes): void {
    const cookieKey = this.COOKIE_PREFIX + key;
    Cookies.set(cookieKey, value, {
      ...this.DEFAULT_COOKIE_OPTIONS,
      ...options
    });
  }

  getCookie(key: string): string | undefined {
    const cookieKey = this.COOKIE_PREFIX + key;
    return Cookies.get(cookieKey);
  }

  removeCookie(key: string): void {
    const cookieKey = this.COOKIE_PREFIX + key;
    Cookies.remove(cookieKey);
  }

  // Cache Methods with Expiration
  setCache(key: string, data: any, expirationMinutes: number = 60): void {
    const cacheData = {
      data,
      timestamp: Date.now(),
      expiresIn: expirationMinutes * 60 * 1000 // Convert minutes to milliseconds
    };
    this.setSessionData(key, cacheData);
  }

  getCache<T>(key: string): T | null {
    const cacheData = this.getSessionData<{
      data: T;
      timestamp: number;
      expiresIn: number;
    }>(key);

    if (!cacheData) return null;

    const now = Date.now();
    const isExpired = now - cacheData.timestamp > cacheData.expiresIn;

    if (isExpired) {
      this.removeSessionData(key);
      return null;
    }

    return cacheData.data;
  }

  // Clear all session data and cookies
  clearAll(): void {
    // Clear session storage
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith(this.SESSION_PREFIX)) {
        this.storage.removeItem(key);
      }
    });

    // Clear cookies
    Object.keys(Cookies.get() || {}).forEach(key => {
      if (key.startsWith(this.COOKIE_PREFIX)) {
        Cookies.remove(key);
      }
    });
  }
}

export const sessionManager = new SessionManager();
