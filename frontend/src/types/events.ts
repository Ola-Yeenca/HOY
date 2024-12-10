export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  coverImage?: string;
  featured_image?: string;
  video?: string;
  dj?: string;
  tag?: string;
  price: string;
  is_featured?: boolean;
  capacity?: number;
  age_restriction?: number;
  likes?: number;
  comments?: number;
  ticket_types?: Array<{
    name: string;
    price: number;
  }>;
  category?: string;
}
