import api from './api';
import { GalleryImage } from '@/types/gallery';

class GalleryService {
  async getImages(category?: string): Promise<GalleryImage[]> {
    try {
      const response = await api.get<GalleryImage[]>('/gallery/images/', {
        params: { 
          category,
          is_featured: category === 'featured' ? true : undefined
        },
      });
      
      return response.data.map(image => ({
        ...image,
        url: process.env.NEXT_PUBLIC_API_URL + image.image,
      }));
    } catch (error) {
      console.error('Failed to fetch gallery images:', error);
      throw error;
    }
  }

  async likeImage(imageId: string): Promise<GalleryImage> {
    try {
      const response = await api.post<GalleryImage>(`/gallery/images/${imageId}/like/`);
      return {
        ...response.data,
        url: process.env.NEXT_PUBLIC_API_URL + response.data.image,
      };
    } catch (error) {
      console.error('Failed to like image:', error);
      throw error;
    }
  }

  async unlikeImage(imageId: string): Promise<GalleryImage> {
    try {
      const response = await api.delete<GalleryImage>(`/gallery/images/${imageId}/like/`);
      return {
        ...response.data,
        url: process.env.NEXT_PUBLIC_API_URL + response.data.image,
      };
    } catch (error) {
      console.error('Failed to unlike image:', error);
      throw error;
    }
  }

  async downloadImage(imageId: string): Promise<Blob> {
    try {
      // Track the download
      await api.post(`/gallery/images/${imageId}/download/`);
      
      // Get the actual image
      const response = await api.get(`/gallery/images/${imageId}/download/`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Failed to download image:', error);
      throw error;
    }
  }

  async shareImage(imageId: string): Promise<{ shareUrl: string }> {
    try {
      const response = await api.post<{ shareUrl: string }>(`/gallery/images/${imageId}/share/`);
      return response.data;
    } catch (error) {
      console.error('Failed to get share URL:', error);
      throw error;
    }
  }
}

export default new GalleryService();
