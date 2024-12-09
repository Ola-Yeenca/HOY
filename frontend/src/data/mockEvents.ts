import { Event } from '@/types/events';

export const mockEvents: Event[] = [
  {
    id: '1',
    slug: 'luxury-wine-tasting',
    title: 'Luxury Wine Tasting',
    description: 'Experience the finest wines from around the world in an intimate setting with expert sommeliers.',
    date: '2024-02-15',
    start_time: '19:00',
    end_time: '22:00',
    location: {
      name: 'Beverly Hills Wine Club',
      address: '9876 Wilshire Blvd, Beverly Hills, CA 90210',
      coordinates: {
        latitude: 34.0736,
        longitude: -118.4004
      }
    },
    featured_image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80',
    capacity: 45,
    age_restriction: 21,
    ticket_types: [
      {
        name: 'General Admission',
        price: 150
      },
      {
        name: 'VIP Experience',
        price: 250
      }
    ],
    djs: [],
    is_featured: true,
    category: 'food'
  },
  {
    id: '2',
    slug: 'modern-art-exhibition',
    title: 'Modern Art Exhibition',
    description: 'Contemporary masterpieces by emerging artists showcasing the future of modern art.',
    date: '2024-02-18',
    start_time: '10:00',
    end_time: '18:00',
    location: {
      name: 'Downtown Gallery',
      address: '456 Arts District, Los Angeles, CA 90013',
      coordinates: {
        latitude: 34.0407,
        longitude: -118.2468
      }
    },
    featured_image: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?auto=format&fit=crop&q=80',
    capacity: 120,
    age_restriction: 0,
    ticket_types: [
      {
        name: 'General Admission',
        price: 25
      },
      {
        name: 'Guided Tour',
        price: 45
      }
    ],
    djs: [],
    is_featured: false,
    category: 'art'
  },
  {
    id: '3',
    slug: 'tech-startup-conference',
    title: 'Tech Startup Conference',
    description: 'Connect with innovators and industry leaders in the heart of Silicon Beach.',
    date: '2024-02-20',
    start_time: '09:00',
    end_time: '17:00',
    location: {
      name: 'Silicon Beach Conference Center',
      address: '123 Tech Way, Santa Monica, CA 90401',
      coordinates: {
        latitude: 34.0194,
        longitude: -118.4912
      }
    },
    featured_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80',
    capacity: 500,
    age_restriction: 18,
    ticket_types: [
      {
        name: 'Early Bird',
        price: 299
      },
      {
        name: 'Regular',
        price: 399
      },
      {
        name: 'VIP Pass',
        price: 699
      }
    ],
    djs: [],
    is_featured: true,
    category: 'tech'
  },
  {
    id: '4',
    slug: 'beachside-yoga-retreat',
    title: 'Beachside Yoga Retreat',
    description: 'Find your inner peace with ocean views and expert-led yoga sessions.',
    date: '2024-02-22',
    start_time: '07:00',
    end_time: '11:00',
    location: {
      name: 'Santa Monica Beach',
      address: 'Ocean Avenue, Santa Monica, CA 90401',
      coordinates: {
        latitude: 34.0190,
        longitude: -118.4814
      }
    },
    featured_image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80',
    capacity: 30,
    age_restriction: 16,
    ticket_types: [
      {
        name: 'Single Session',
        price: 35
      },
      {
        name: 'Full Retreat Pass',
        price: 120
      }
    ],
    djs: [],
    is_featured: false,
    category: 'wellness'
  }
];
