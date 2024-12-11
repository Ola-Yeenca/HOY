import { Event } from '@/types/event';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Summer Beach Party',
    slug: 'summer-beach-party',
    description: 'Join us for an unforgettable summer beach party with amazing DJs and great vibes!',
    date: '2024-07-15',
    start_time: '14:00',
    location: {
      name: 'Sunset Beach Club',
      address: 'Beach Road 123',
      city: 'Amsterdam',
      latitude: 52.3676,
      longitude: 4.9041
    },
    featured_image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80',
    djs: [
      {
        id: 'dj1',
        name: 'DJ Mike',
        artist_name: 'Mike Wave'
      }
    ],
    capacity: 500,
    ticket_types: [
      {
        name: 'Early Bird',
        price: 25,
        description: 'Limited early bird tickets',
        available: 100
      },
      {
        name: 'Regular',
        price: 35,
        description: 'Regular admission',
        available: 400
      }
    ],
    status: 'published',
    is_featured: true,
    category: 'Beach Party'
  },
  {
    id: '2',
    title: 'Underground Techno Night',
    slug: 'underground-techno-night',
    description: 'Experience the best underground techno music in a unique industrial setting.',
    date: '2024-08-20',
    start_time: '22:00',
    location: {
      name: 'The Factory',
      address: 'Industrial Zone 45',
      city: 'Amsterdam',
      latitude: 52.3822,
      longitude: 4.8995
    },
    featured_image: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?auto=format&fit=crop&q=80',
    djs: [
      {
        id: 'dj2',
        name: 'Sarah Tech',
        artist_name: 'Techno Sarah'
      },
      {
        id: 'dj3',
        name: 'Max Beat',
        artist_name: 'Maximum Beats'
      }
    ],
    capacity: 300,
    ticket_types: [
      {
        name: 'Standard',
        price: 30,
        description: 'Standard entry',
        available: 300
      }
    ],
    status: 'published',
    is_featured: false,
    category: 'Techno'
  }
];
