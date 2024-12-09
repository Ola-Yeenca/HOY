export interface Profile {
  id: string;
  bio: string;
  birth_date: string | null;
  location: string;
  profile_image: string | null;
  favorite_genres: string[];
  favorite_artists: string[];
  instagram: string;
  twitter: string;
  facebook: string;
  profile_privacy: 'public' | 'private' | 'friends';
  email_notifications: boolean;
  push_notifications: boolean;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  user: User;
  profile: Profile;
  refresh: string;
  access: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_email_verified: boolean;
}

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirm: string;
  firstName: string;
  lastName: string;
}
