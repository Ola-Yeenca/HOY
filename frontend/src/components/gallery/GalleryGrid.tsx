'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiDownload, FiShare2 } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import galleryService from '@/services/galleryService';
import { GalleryImage } from '@/types/gallery';

interface GalleryGridProps {
  category: string;
}

export function GalleryGrid({ category }: GalleryGridProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingImageId, setProcessingImageId] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, [category]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const fetchedImages = await galleryService.getImages(category);
      setImages(fetchedImages);
    } catch (error) {
      console.error('Failed to fetch images:', error);
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (imageId: string) => {
    if (processingImageId) return;
    
    try {
      setProcessingImageId(imageId);
      const updatedImage = await galleryService.likeImage(imageId);
      
      setImages(prevImages =>
        prevImages.map(img =>
          img.id === imageId ? { ...img, likes_count: updatedImage.likes_count, is_liked: true } : img
        )
      );
      
      toast.success('Image liked!');
    } catch (error) {
      console.error('Failed to like image:', error);
      toast.error('Failed to like image');
    } finally {
      setProcessingImageId(null);
    }
  };

  const handleUnlike = async (imageId: string) => {
    if (processingImageId) return;
    
    try {
      setProcessingImageId(imageId);
      const updatedImage = await galleryService.unlikeImage(imageId);
      
      setImages(prevImages =>
        prevImages.map(img =>
          img.id === imageId ? { ...img, likes_count: updatedImage.likes_count, is_liked: false } : img
        )
      );
      
      toast.success('Image unliked');
    } catch (error) {
      console.error('Failed to unlike image:', error);
      toast.error('Failed to unlike image');
    } finally {
      setProcessingImageId(null);
    }
  };

  const handleDownload = async (imageId: string) => {
    if (processingImageId) return;
    
    try {
      setProcessingImageId(imageId);
      const blob = await galleryService.downloadImage(imageId);
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `image-${imageId}.jpg`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Download started');
    } catch (error) {
      console.error('Failed to download image:', error);
      toast.error('Failed to download image');
    } finally {
      setProcessingImageId(null);
    }
  };

  const handleShare = async (imageId: string) => {
    if (processingImageId) return;
    
    try {
      setProcessingImageId(imageId);
      const { shareUrl } = await galleryService.shareImage(imageId);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    } catch (error) {
      console.error('Failed to share image:', error);
      toast.error('Failed to share image');
    } finally {
      setProcessingImageId(null);
    }
  };

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
      <AnimatePresence>
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
              alt={image.caption}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={images.indexOf(image) <= 3}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-coffee-bean/90 via-coffee-bean/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-gold font-semibold mb-2">{image.caption}</h3>
                {image.photographer && (
                  <p className="text-white-plum text-sm mb-2">📸 {image.photographer}</p>
                )}
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => image.is_liked ? handleUnlike(image.id) : handleLike(image.id)}
                    disabled={processingImageId === image.id}
                    className={`flex items-center gap-1 transition-colors ${
                      image.is_liked ? 'text-red-500' : 'text-white-plum hover:text-red-500'
                    }`}
                  >
                    {image.is_liked ? <FaHeart /> : <FiHeart />}
                    <span>{image.likes_count}</span>
                  </button>
                  <button 
                    onClick={() => handleDownload(image.id)}
                    disabled={processingImageId === image.id}
                    className="flex items-center gap-1 text-white-plum hover:text-gold transition-colors"
                  >
                    <FiDownload />
                    <span>{image.downloads_count}</span>
                  </button>
                  <button 
                    onClick={() => handleShare(image.id)}
                    disabled={processingImageId === image.id}
                    className="text-white-plum hover:text-gold transition-colors"
                  >
                    <FiShare2 />
                  </button>
                </div>
                {image.tags && image.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {image.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-coffee-bean/50 text-white-plum px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}