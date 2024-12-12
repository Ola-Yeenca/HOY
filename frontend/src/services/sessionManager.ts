import Cookies, { CookieAttributes } from 'js-cookie';

class SessionManager {
  private cache: Map<string, { value: any; expiry: number }> = new Map();

  setCache<T>(key: string, value: T, expiryMinutes: number = 60): void {
    const expiryTime = Date.now() + expiryMinutes * 60 * 1000;
    this.cache.set(key, { value, expiry: expiryTime });
  }

  getCache<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  removeCache(key: string): void {
    this.cache.delete(key);
  }

  setCookie(name: string, value: string, options?: CookieAttributes): void {
    const cookieOptions: CookieAttributes = {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      domain: window.location.hostname === 'localhost' ? 'localhost' : undefined,
      expires: 7, // 7 days
      ...options,
    };

    console.log('Setting cookie:', { name, value, options: cookieOptions });
    
    try {
      Cookies.set(name, value, cookieOptions);
      console.log('Cookie set successfully');
      console.log('Current cookies:', Cookies.get());
    } catch (error) {
      console.error('Error setting cookie:', error);
    }
  }

  getCookie(name: string): string | undefined {
    try {
      const value = Cookies.get(name);
      console.log('Getting cookie:', { name, value });
      return value;
    } catch (error) {
      console.error('Error getting cookie:', error);
      return undefined;
    }
  }

  removeCookie(name: string, options?: CookieAttributes): void {
    const cookieOptions: CookieAttributes = {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      domain: window.location.hostname === 'localhost' ? 'localhost' : undefined,
      ...options,
    };

    try {
      Cookies.remove(name, cookieOptions);
      console.log('Cookie removed:', name);
    } catch (error) {
      console.error('Error removing cookie:', error);
    }
  }

  clearAll(): void {
    // Clear cache
    this.cache.clear();

    // Clear all cookies
    try {
      const cookies = Cookies.get();
      Object.keys(cookies).forEach(cookieName => {
        this.removeCookie(cookieName);
      });
      console.log('All cookies cleared');
    } catch (error) {
      console.error('Error clearing cookies:', error);
    }
  }
}

export const sessionManager = new SessionManager();
export default sessionManager;
