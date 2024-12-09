/**
 * A wrapper around localStorage that safely handles server-side rendering
 * and provides type-safe access to stored values.
 */
export class SafeStorage {
  private isClient: boolean;

  constructor() {
    this.isClient = typeof window !== 'undefined';
  }

  /**
   * Get an item from storage
   */
  getItem(key: string): string | null {
    if (!this.isClient) {
      return null;
    }
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  }

  /**
   * Set an item in storage
   */
  setItem(key: string, value: string): void {
    if (!this.isClient) {
      return;
    }
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting localStorage item:', error);
    }
  }

  /**
   * Remove an item from storage
   */
  removeItem(key: string): void {
    if (!this.isClient) {
      return;
    }
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing localStorage item:', error);
    }
  }

  /**
   * Clear all items from storage
   */
  clear(): void {
    if (!this.isClient) {
      return;
    }
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Get an item from storage and parse it as JSON
   */
  getJSON<T>(key: string): T | null {
    const item = this.getItem(key);
    if (!item) {
      return null;
    }
    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Error parsing localStorage item:', error);
      return null;
    }
  }

  /**
   * Set an item in storage as JSON
   */
  setJSON<T>(key: string, value: T): void {
    try {
      this.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error stringifying localStorage item:', error);
    }
  }
}
