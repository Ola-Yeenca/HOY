export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  start_time: string;
  location: {
    name: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  featured_image: string;
  djs: Array<{
    id: string;
    name: string;
    artist_name?: string;
  }>;
  capacity: number;
  ticket_types: Array<{
    name: string;
    price: number;
    description?: string;
    available: number;
  }>;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  is_featured: boolean;
  category?: string;
}
