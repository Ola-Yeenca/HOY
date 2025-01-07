import api from './api';

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  emailNotifications: boolean;
  favoriteCategories: string[];
  preferredLocations: string[];
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  preferences: UserPreferences;
}

class UserService {
  async getProfile() {
    const response = await api.get<UserProfile>('/users/profile/');
    return response.data;
  }

  async updateProfile(data: Partial<UserProfile>) {
    const response = await api.patch<UserProfile>('/users/profile/', data);
    return response.data;
  }

  async updatePreferences(preferences: Partial<UserPreferences>) {
    const response = await api.patch<UserPreferences>('/users/preferences/', preferences);
    return response.data;
  }

  async getFavorites() {
    const response = await api.get('/users/favorites/');
    return response.data;
  }

  async addFavorite(itemId: number, itemType: string) {
    const response = await api.post('/users/favorites/', { itemId, itemType });
    return response.data;
  }

  async removeFavorite(itemId: number, itemType: string) {
    const response = await api.delete(`/users/favorites/${itemType}/${itemId}/`);
    return response.data;
  }

  async getNotificationSettings() {
    const response = await api.get('/users/notification-settings/');
    return response.data;
  }

  async updateNotificationSettings(settings: {
    pushEnabled: boolean;
    emailEnabled: boolean;
    categories: string[];
  }) {
    const response = await api.patch('/users/notification-settings/', settings);
    return response.data;
  }

  async getActivityHistory(page: number = 1, limit: number = 10) {
    const response = await api.get(`/users/activity/?page=${page}&limit=${limit}`);
    return response.data;
  }
}

export const userService = new UserService();
export default userService;
