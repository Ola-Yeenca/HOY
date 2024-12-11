'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useAuth from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { BentoGrid, BentoGridItem } from '@/components/ui/design-system/BentoGrid';
import { FaHeart, FaRegHeart, FaDownload, FaShare } from 'react-icons/fa';
import { format } from 'date-fns';
import api from '@/services/api';

interface GalleryImage {
  id: string;
  image: string;
  caption: string;
  photographer: string;
  is_featured: boolean;
  created_at: string;
  likes_count: number;
  downloads_count: number;
  has_user_liked: boolean;
  gallery: {
    id: string;
    title: string;
    event: {
      id: string;
      title: string;
    };
  };
}

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: GalleryImage[];
}

export default function GalleryPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [lastTap, setLastTap] = useState<{ [key: string]: number }>({});
  const DOUBLE_TAP_DELAY = 300; // milliseconds

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/gallery');
    }
  }, [isLoading, isAuthenticated, router]);

  // Load local images immediately without API call
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const localImages: GalleryImage[] = Array.from({ length: 15 }, (_, i) => ({
      id: String(i + 1),
      image: `/images/gallery/IMG_${2797 + i}.jpg`,
      caption: `Gallery Image ${i + 1}`,
      photographer: 'House Of Young',
      is_featured: false,
      created_at: new Date().toISOString(),
      likes_count: 0,
      downloads_count: 0,
      has_user_liked: false,
      gallery: {
        id: '1',
        title: 'Local Gallery',
        event: {
          id: '1',
          title: 'House Of Young Events'
        }
      }
    }));
    
    setImages(localImages);
    setHasMore(false);
    setIsLoadingImages(false);
  }, [isAuthenticated]);

  const fetchImages = async (pageNum: number) => {
    if (!isAuthenticated) return;
    
    try {
      const response = await api.get<PaginatedResponse>('/api/gallery/images/', {
        params: {
          page: pageNum,
          ordering: '-created_at',
          page_size: 12
        }
      });

      if (pageNum === 1) {
        setImages(response.data.results);
      } else {
        setImages(prev => [...prev, ...response.data.results]);
      }
      
      setHasMore(!!response.data.next);
    } catch (error) {
      // Fallback to local images
      const localImages: GalleryImage[] = Array.from({ length: 15 }, (_, i) => ({
        id: String(i + 1),
        image: `/images/gallery/IMG_${2797 + i}.jpg`,
        caption: `Gallery Image ${i + 1}`,
        photographer: 'House Of Young',
        is_featured: false,
        created_at: new Date().toISOString(),
        likes_count: 0,
        downloads_count: 0,
        has_user_liked: false,
        gallery: {
          id: '1',
          title: 'Local Gallery',
          event: {
            id: '1',
            title: 'House Of Young Events'
          }
        }
      }));
      
      setImages(localImages);
      setHasMore(false); // No more pages for local images
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleLike = async (imageId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      // Update local state
      setImages(prevImages => 
        prevImages.map(img => 
          img.id === imageId 
            ? {
                ...img,
                likes_count: img.has_user_liked ? img.likes_count - 1 : img.likes_count + 1,
                has_user_liked: !img.has_user_liked
              }
            : img
        )
      );

      // If we're in development with local data, don't make API call
      if (process.env.NODE_ENV === 'development') {
        return;
      }

      // Make API call to update like status
      try {
        const response = await api.post(`/api/gallery/images/${imageId}/like/`);
        
        // If the API call fails, revert the optimistic update
        if (!response.data.success) {
          setImages(prevImages => 
            prevImages.map(img => 
              img.id === imageId 
                ? {
                    ...img,
                    likes_count: img.has_user_liked ? img.likes_count - 1 : img.likes_count + 1,
                    has_user_liked: !img.has_user_liked
                  }
                : img
            )
          );
          throw new Error('Failed to update like status');
        }
      } catch (error) {
        // Revert optimistic update on API error
        setImages(prevImages => 
          prevImages.map(img => 
            img.id === imageId 
              ? {
                  ...img,
                  likes_count: img.has_user_liked ? img.likes_count - 1 : img.likes_count + 1,
                  has_user_liked: !img.has_user_liked
                }
              : img
          )
        );
        throw error;
      }
    } catch (error) {
      console.error('Failed to update like status:', error);
      toast.error('Failed to update like status');
    }
  };

  const handleDoubleTap = (imageId: string, e: React.TouchEvent | React.MouseEvent) => {
    e.stopPropagation();
    const currentTime = new Date().getTime();
    const tapTime = lastTap[imageId] || 0;
    
    if (currentTime - tapTime < DOUBLE_TAP_DELAY) {
      // Double tap detected
      handleLike(imageId);
      // Show heart animation
      const element = e.currentTarget as HTMLElement;
      const rect = element.getBoundingClientRect();
      const heart = document.createElement('div');
      heart.className = 'absolute transform -translate-x-1/2 -translate-y-1/2 text-white text-6xl animate-like-heart';
      heart.innerHTML = '❤️';

      // Calculate position based on event type and view mode
      let x, y;
      if (e.type === 'touchstart') {
        const touch = (e as React.TouchEvent).touches[0];
        x = touch.clientX - rect.left;
        y = touch.clientY - rect.top;
      } else {
        const mouseEvent = e as React.MouseEvent;
        x = mouseEvent.clientX - rect.left;
        y = mouseEvent.clientY - rect.top;
      }

      heart.style.left = `${x}px`;
      heart.style.top = `${y}px`;
      element.appendChild(heart);
      setTimeout(() => heart.remove(), 1000);
      setLastTap(prev => ({ ...prev, [imageId]: 0 }));
    } else {
      setLastTap(prev => ({ ...prev, [imageId]: currentTime }));
    }
  };

  const handleDownload = async (imageId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const image = images.find(img => img.id === imageId);
      if (image) {
        const link = document.createElement('a');
        link.href = image.image;
        link.download = image.caption || 'hoy-event-image';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setImages(prevImages => 
          prevImages.map(img => 
            img.id === imageId 
              ? { ...img, downloads_count: img.downloads_count + 1 }
              : img
          )
        );
      }
    } catch (error) {
      console.error('Failed to download image:', error);
      toast.error('Failed to download image');
    }
  };

  const handleShare = async (image: GalleryImage) => {
    try {
      // Get the full URL of the image
      const imageUrl = new URL(image.image, window.location.origin).href;
      
      // Check if the Web Share API is available
      if (navigator.share) {
        await navigator.share({
          title: image.caption || 'House Of Young Event Photo',
          text: `Check out this photo from ${image.gallery.event.title}`,
          url: imageUrl
        });
      } else {
        // Fallback to copying the link
        await navigator.clipboard.writeText(imageUrl);
        toast.success('Image link copied to clipboard!');
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') { // Ignore if user cancelled share
        console.error('Failed to share image:', error);
        toast.error('Failed to share image');
      }
    }
  };

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleNextImage = () => {
    if (!selectedImage) return;
    const currentIndex = images.findIndex(img => img.id === selectedImage.id);
    if (currentIndex < images.length - 1) {
      setSelectedImage(images[currentIndex + 1]);
    }
  };

  const handlePreviousImage = () => {
    if (!selectedImage) return;
    const currentIndex = images.findIndex(img => img.id === selectedImage.id);
    if (currentIndex > 0) {
      setSelectedImage(images[currentIndex - 1]);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedImage) return;

      switch (e.key.toLowerCase()) {
        case 'arrowleft':
        case 'p':
          handlePreviousImage();
          break;
        case 'arrowright':
        case 'n':
          handleNextImage();
          break;
        case 'escape':
          handleCloseModal();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage, images]);

  const loadMore = () => {
    if (hasMore && !isLoadingImages) {
      setPage(prev => prev + 1);
      fetchImages(page + 1);
    }
  };

  if (isLoading || isLoadingImages && page === 1) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-jet-black via-coffee-bean to-jet-black py-24 px-4 sm:px-6 lg:px-8">
      <style jsx global>{`
        .modal-content {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
        @keyframes likeHeart {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          15% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
          }
          30% {
            transform: translate(-50%, -50%) scale(1);
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        .animate-like-heart {
          animation: likeHeart 1s ease-out forwards;
          pointer-events: none;
          color: #FFD700;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
          z-index: 60;
          position: absolute;
          user-select: none;
        }
        @keyframes shimmer {
          0% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.3);
          }
          100% {
            filter: brightness(1);
          }
        }
        .animate-pulse {
          animation: shimmer 2s infinite;
        }
      `}</style>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gold">Event Gallery</h1>
            <p className="mt-2 text-lg text-chalk">Relive the magic of our unforgettable nights</p>
          </div>

          {images.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-chalk">No images in your gallery yet.</p>
              <p className="mt-2 text-chalk/80">Images from your events will appear here.</p>
            </div>
          ) : (
            <>
              <BentoGrid className="mx-auto">
                {images.map((image, index) => (
                  <BentoGridItem
                    key={image.id}
                    title={image.caption || 'Untitled'}
                    description={`${image.gallery.event.title} • ${format(new Date(image.created_at), 'MMMM d, yyyy')}`}
                    header={
                      <motion.div 
                        className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer"
                        onClick={() => handleImageClick(image)}
                        onDoubleClick={(e) => handleDoubleTap(image.id, e)}
                        onTouchStart={(e) => handleDoubleTap(image.id, e)}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Image
                          src={image.image}
                          alt={image.caption || 'Untitled'}
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    }
                    className="relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(image.id);
                          }}
                          className="text-white-plum hover:text-gold transition-colors"
                        >
                          {image.has_user_liked ? <FaHeart className="text-gold" /> : <FaRegHeart />}
                        </button>
                        <span className="text-sm text-white-plum">{image.likes_count}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(image.id);
                          }}
                          className="text-white-plum hover:text-gold transition-colors"
                        >
                          <FaDownload />
                        </button>
                        <span className="text-sm text-white-plum">{image.downloads_count}</span>
                      </div>
                    </div>
                  </BentoGridItem>
                ))}
              </BentoGrid>

              {/* Image Modal */}
              {selectedImage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 select-none"
                  onClick={handleCloseModal}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative max-w-7xl w-full h-[85vh] select-none modal-content"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Navigation Buttons */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviousImage();
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl p-2 bg-black/20 rounded-full transition-all hover:bg-black/40"
                      aria-label="Previous image"
                    >
                      ←
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage();
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl p-2 bg-black/20 rounded-full transition-all hover:bg-black/40"
                      aria-label="Next image"
                    >
                      →
                    </button>

                    <div className="relative h-full rounded-xl overflow-hidden">
                      <motion.div 
                        className="relative h-full w-full select-none"
                        onDoubleClick={(e) => handleDoubleTap(selectedImage.id, e)}
                        onTouchStart={(e) => {
                          // Prevent zooming on double tap
                          e.preventDefault();
                          handleDoubleTap(selectedImage.id, e);
                        }}
                        style={{ touchAction: 'none' }}
                      >
                        <Image
                          src={selectedImage.image}
                          alt={selectedImage.caption || 'Event image'}
                          fill
                          className="object-contain select-none"
                          quality={85}
                          priority
                          sizes="100vw"
                          style={{ pointerEvents: 'none', userSelect: 'none' }}
                          draggable={false}
                        />
                      </motion.div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {selectedImage.caption || 'Untitled'}
                      </h3>
                      <p className="text-white/80">
                        {selectedImage.gallery.event.title} • {format(new Date(selectedImage.created_at), 'MMMM d, yyyy')}
                      </p>
                      <div className="flex items-center gap-6 mt-4">
                        <button 
                          onClick={() => handleLike(selectedImage.id)}
                          className={`flex items-center gap-2 transition-colors ${
                            selectedImage.has_user_liked 
                              ? 'text-gold hover:text-gold/80' 
                              : 'text-white hover:text-gold'
                          }`}
                          title={selectedImage.has_user_liked ? 'Unlike photo' : 'Like photo'}
                        >
                          <FaHeart className={`text-2xl transform transition-transform ${
                            selectedImage.has_user_liked ? 'scale-110 animate-pulse' : 'scale-100'
                          }`} />
                          <span>{selectedImage.likes_count}</span>
                        </button>
                        <button 
                          onClick={() => handleDownload(selectedImage.id)}
                          className="flex items-center gap-2 text-white hover:text-gold transition-colors"
                        >
                          <FaDownload className="text-2xl" />
                          <span>{selectedImage.downloads_count}</span>
                        </button>
                        <button 
                          onClick={() => handleShare(selectedImage)}
                          className="flex items-center gap-2 text-white hover:text-gold transition-colors"
                        >
                          <FaShare className="text-2xl" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={handleCloseModal}
                      className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl"
                    >
                      ×
                    </button>
                  </motion.div>
                </motion.div>
              )}

              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={loadMore}
                    className="px-6 py-3 bg-gold/10 hover:bg-gold/20 text-gold rounded-lg transition-colors"
                    disabled={isLoadingImages}
                  >
                    {isLoadingImages ? (
                      <LoadingSpinner size="small" />
                    ) : (
                      'Load More Images'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}