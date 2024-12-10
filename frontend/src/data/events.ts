import { Event } from '@/types/events';

export const FEATURED_EVENTS: Event[] = [
  {
    id: "1",
    title: "New Year's Eve Gala",
    description: "Join us for an unforgettable night of luxury and celebration. Ring in the new year with an exclusive black-tie event featuring world-class entertainment, gourmet dining, and champagne toasts.",
    date: "2024-12-31",
    location: "HOY Grand Ballroom, Valencia",
    dj: "Special Guest DJ",
    tag: "VIP",
    image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=2969&auto=format&fit=crop",
    featured_image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=2969&auto=format&fit=crop",
    video: "/videos/VIDEO-2024-11-30-12-53-37.mp4",
    likes: 1200,
    comments: 45,
    price: "€250",
    is_featured: true,
    capacity: 500,
    age_restriction: 21,
    ticket_types: [
      {
        name: "VIP",
        price: 250
      },
      {
        name: "Standard",
        price: 150
      }
    ],
    category: "Gala"
  },
  {
    id: "2",
    title: "Neon Dreams",
    description: "An immersive electronic music experience featuring top international DJs",
    date: "2025-01-15",
    location: "HOY Main Hall, Valencia",
    dj: "DJ Shadow",
    tag: "Premium",
    image: "/images/event-1.jpg",
    featured_image: "/images/event-1.jpg",
    likes: 856,
    comments: 12,
    price: "€50",
    is_featured: true,
    capacity: 1000,
    age_restriction: 18,
    ticket_types: [
      {
        name: "Early Bird",
        price: 50
      },
      {
        name: "Regular",
        price: 75
      }
    ],
    category: "Electronic"
  },
  {
    id: "3",
    title: "Deep House Voyage",
    description: "Journey through the depths of house music with underground artists",
    date: "2024-02-07",
    location: "HOY Underground, Valencia",
    dj: "Maya Jane Coles",
    tag: "Exclusive",
    image: "/images/event-2.jpg",
    featured_image: "/images/event-2.jpg",
    price: "€50",
    is_featured: true,
    capacity: 300,
    age_restriction: 18,
    ticket_types: [
      {
        name: "Standard",
        price: 50
      }
    ],
    category: "House"
  },
  {
    id: "4",
    title: "Techno Fusion",
    description: "Where traditional meets modern in an explosive night of techno",
    date: "2024-11-14",
    location: "HOY Rooftop, Valencia",
    dj: "Charlotte de Witte",
    tag: "VIP",
    image: "/images/event-3.jpg",
    featured_image: "/images/event-3.jpg",
    price: "€75",
    is_featured: true,
    capacity: 400,
    age_restriction: 18,
    ticket_types: [
      {
        name: "VIP",
        price: 75
      },
      {
        name: "Regular",
        price: 50
      }
    ],
    category: "Techno"
  }
];
