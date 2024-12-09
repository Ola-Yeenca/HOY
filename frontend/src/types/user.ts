export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  profile?: {
    id: string;
    bio?: string;
    profile_image?: string;
    phone_number?: string;
    birth_date?: string;
    location?: string;
    is_phone_verified: boolean;
  };
}

export interface UserProfile extends User {
  profile: NonNullable<User['profile']>;
}
