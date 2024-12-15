export interface GalleryImage {
  id: string;
  image: string;  // Original image path from backend
  url: string;    // Full URL for frontend display
  caption: string;
  photographer?: string;
  is_featured: boolean;
  camera_info?: Record<string, any>;
  tags?: string[];
  created_at: string;
  likes_count: number;
  downloads_count: number;
  is_liked: boolean;
  gallery: string;
}
