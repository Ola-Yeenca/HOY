'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiHeart, FiDownload, FiShare2 } from 'react-icons/fi';

interface GalleryImage {
  id: number;
  url: string;
  title: string;
  likes: number;
  category: string;
}

interface GalleryGridProps {
  category: string;
}

export function GalleryGrid({ category }: GalleryGridProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulated image data - replace with actual API call
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockImages: GalleryImage[] = [
        { id: 1, url: '/images/gallery/IMG_2797.jpg', title: 'Event Image 1', likes: 856, category: 'all' },
        { id: 2, url: '/images/gallery/IMG_2798.jpg', title: 'Event Image 2', likes: 743, category: 'recent' },
        { id: 3, url: '/images/gallery/IMG_2799.jpg', title: 'Event Image 3', likes: 921, category: 'popular' },
        { id: 4, url: '/images/gallery/IMG_2800.jpg', title: 'Event Image 4', likes: 677, category: 'featured' },
        { id: 5, url: '/images/gallery/IMG_2801.jpg', title: 'Event Image 5', likes: 544, category: 'all' },
        { id: 6, url: '/images/gallery/IMG_2802.jpg', title: 'Event Image 6', likes: 812, category: 'recent' },
        { id: 7, url: '/images/gallery/IMG_2803.jpg', title: 'Event Image 7', likes: 933, category: 'popular' },
        { id: 8, url: '/images/gallery/IMG_2804.jpg', title: 'Event Image 8', likes: 755, category: 'featured' },
        { id: 9, url: '/images/gallery/IMG_2805.jpg', title: 'Event Image 9', likes: 644, category: 'all' },
        { id: 10, url: '/images/gallery/IMG_2806.jpg', title: 'Event Image 10', likes: 888, category: 'recent' },
        { id: 11, url: '/images/gallery/IMG_2807.jpg', title: 'Event Image 11', likes: 766, category: 'popular' },
        { id: 12, url: '/images/gallery/IMG_2808.jpg', title: 'Event Image 12', likes: 899, category: 'featured' },
        { id: 13, url: '/images/gallery/IMG_2809.jpg', title: 'Event Image 13', likes: 544, category: 'all' },
        { id: 14, url: '/images/gallery/IMG_2810.jpg', title: 'Event Image 14', likes: 812, category: 'recent' },
        { id: 15, url: '/images/gallery/IMG_2811.jpg', title: 'Event Image 15', likes: 933, category: 'popular' },
      ];

      setImages(mockImages.filter(img => category === 'all' || img.category === category));
      setLoading(false);
    };

    fetchImages();
  }, [category]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] bg-coffee-bean/50 border border-dark-gray rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      layout
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {images.map((image) => (
        <motion.div
          key={image.id}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-dark-gray hover:border-gold transition-colors duration-200"
        >
          <Image
            src={image.url}
            alt={image.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={image.id <= 3}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-coffee-bean/90 via-coffee-bean/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-gold font-semibold mb-2">{image.title}</h3>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-white-plum hover:text-gold transition-colors">
                  <FiHeart />
                  <span>{image.likes}</span>
                </button>
                <button className="text-white-plum hover:text-gold transition-colors">
                  <FiDownload />
                </button>
                <button className="text-white-plum hover:text-gold transition-colors">
                  <FiShare2 />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}