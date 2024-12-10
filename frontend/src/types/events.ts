export interface Event {
  id: string | number;
  title: string;
  description: string;
  date: string;
  location: string;
  dj?: string;
  tag?: string;
  image?: string;
  featured_image?: string;
  video?: string;
  likes?: number;
  comments?: number;
  price: string;
  featured?: boolean;
  capacity?: number;
  age_restriction?: number;
  ticket_types?: Array<{
    name: string;
    price: number;
  }>;
  djs?: Array<{
    name: string;
    artist_name: string;
    profile_image: string;
  }>;
  is_featured?: boolean;
  category?: string;
}
