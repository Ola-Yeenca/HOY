export interface DJ {
  id: string;
  name: string;
  artist_name: string;
  bio: string;
  profile_image: string;
  genres: string[];
  social_media: Record<string, string>;
  website?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  slug: string;
  start_time: string;
  location: {
    name: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  image: string;
  featured_image: string;
  capacity: number;
  age_restriction?: string;
  ticket_types: Array<{
    name: string;
    price: number;
    description?: string;
    available?: number;
  }>;
  djs: DJ[];
  status?: 'draft' | 'published' | 'cancelled' | 'completed';
  is_featured: boolean;
  category?: string;
}
