export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  location: {
    name: string;
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  featured_image: string;
  capacity: number;
  age_restriction: number;
  ticket_types: Array<{
    name: string;
    price: number;
  }>;
  djs: Array<{
    name: string;
    artist_name: string;
    profile_image: string;
  }>;
  is_featured: boolean;
  category?: string; // Optional for backward compatibility
}
