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
    Cookies.set(name, value, {
      ...options,
      secure: process.env.NODE_ENV === 'production',
      sameSite: options?.sameSite || 'lax'
    });
  }

  getCookie(name: string): string | undefined {
    return Cookies.get(name);
  }

  removeCookie(name: string, options?: CookieAttributes): void {
    Cookies.remove(name, options);
  }

  clearAll(): void {
    // Clear cache
    this.cache.clear();

    // Clear all cookies
    const cookies = Cookies.get();
    Object.keys(cookies).forEach(cookieName => {
      Cookies.remove(cookieName, { path: '/' });
    });
  }
}

export const sessionManager = new SessionManager();
export default sessionManager;
