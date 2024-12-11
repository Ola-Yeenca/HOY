'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaSpinner, FaEdit, FaCamera, FaMapMarkerAlt, FaEnvelope, FaTrash, FaMusic } from 'react-icons/fa';
import { MdMusicNote } from 'react-icons/md';
import ProfileEditModal from '@/components/profile/ProfileEditModal';
import api from '@/services/api';
import { toast } from 'react-hot-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Profile } from '@/types/auth';

interface MusicPreference {
  genre: string;
  subgenres?: string[];
}

export default function ProfilePage() {
  const { user, profile, isAuthenticated, isLoading, checkAuth } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const musicGenres = [
    'House', 'Techno', 'Trance', 'EDM', 'Deep House', 'Progressive House',
    'Drum & Bass', 'Dubstep', 'Ambient', 'Electronica', 'Disco'
  ];

  useEffect(() => {
    const initializePage = async () => {
      try {
        // Wait for authentication check to complete
        if (isLoading) return;

        // Redirect if not authenticated
        if (!isAuthenticated) {
          router.push('/login?redirect=/profile');
          return;
        }

        // Fetch user profile data
        await fetchUserProfile();
      } catch (error) {
        console.error('Error initializing profile page:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsPageLoading(false);
      }
    };

    initializePage();
  }, [isLoading, isAuthenticated, router]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/profiles/me');
      setUserProfile(response.data);
      if (response.data.favorite_genres) {
        setSelectedGenres(response.data.favorite_genres);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      toast.error('Failed to load profile data');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/profiles/me/image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.image_url) {
        // Update the user profile with the new image URL
        if (user?.profile) {
          user.profile.profile_image = response.data.image_url;
        }
        toast.success('Profile image updated successfully');
      } else {
        throw new Error('No image URL received from server');
      }
    } catch (error: any) {
      console.error('Failed to upload image:', error);
      if (error.response?.status === 413) {
        toast.error('Image size too large. Please choose a smaller image.');
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to upload image. Please try again.');
      }
    } finally {
      setUploadingImage(false);
      // Reset the file input
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleRemoveImage = async () => {
    if (!user?.profile?.profile_image) return;

    setUploadingImage(true);
    try {
      await api.delete('/profiles/me/image/');
      
      // Update the user profile to remove the image
      if (user?.profile) {
        user.profile.profile_image = undefined;
      }
      toast.success('Profile image removed successfully');
    } catch (error: any) {
      console.error('Error removing image:', error);
      toast.error(error.response?.data?.error || 'Failed to remove image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGenreToggle = async (genre: string) => {
    try {
      const newGenres = selectedGenres.includes(genre)
        ? selectedGenres.filter(g => g !== genre)
        : [...selectedGenres, genre];
      
      setSelectedGenres(newGenres);

      await api.patch('/profiles/me/', {
        favorite_genres: newGenres
      });

      toast.success('Music preferences updated');
    } catch (error) {
      console.error('Failed to update music preferences:', error);
      toast.error('Failed to update music preferences');
      // Revert the local state on error
      setSelectedGenres(selectedGenres);
    }
  };

  const handleProfileUpdate = async (data: Partial<Profile>) => {
    try {
      await api.patch('/profiles/me/', data);
      await fetchUserProfile();
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    }
  };

  // Show loading spinner while checking authentication or loading page data
  if (isLoading || isPageLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-coffee-bean to-jet-black">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Return null if not authenticated (redirect will happen)
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-jet-black via-coffee-bean to-jet-black py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Profile Header */}
        <div className="relative">
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="relative w-32 h-32">
                {uploadingImage ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <FaSpinner className="animate-spin text-2xl text-gold" />
                  </div>
                ) : (
                  <>
                    {user.profile?.profile_image ? (
                      <Image
                        src={user.profile.profile_image}
                        alt="Profile"
                        width={128}
                        height={128}
                        className="rounded-full object-cover border-4 border-gold"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gold/20 flex items-center justify-center text-4xl text-gold border-4 border-gold">
                        {user.first_name[0]}
                      </div>
                    )}
                    <label className="absolute bottom-0 right-0 bg-gold text-black p-2 rounded-full cursor-pointer hover:bg-gold/90 transition-colors">
                      <FaCamera className="w-5 h-5" />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-0 right-0 bg-gold text-black p-2 rounded-full cursor-pointer hover:bg-gold/90 transition-colors"
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-white">
              {user.first_name} {user.last_name}
            </h1>
            <p className="text-gold mt-2">{user.email}</p>
          </div>
        </div>

        {/* Profile Content */}
        <div className="bg-jet-black/50 rounded-xl p-6 space-y-6">
          {/* Bio Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">About Me</h2>
              <button
                onClick={() => setIsEditing(true)}
                className="text-gold hover:text-gold/80"
              >
                <FaEdit className="w-5 h-5" />
              </button>
            </div>
            <p className="text-white-plum/80">
              {userProfile?.bio || 'Add a bio to tell people about yourself...'}
            </p>
          </div>

          {/* Music Preferences */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FaMusic className="mr-2" />
              Music Preferences
            </h2>
            <div className="flex flex-wrap gap-2">
              {musicGenres.map(genre => (
                <button
                  key={genre}
                  onClick={() => handleGenreToggle(genre)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedGenres.includes(genre)
                      ? 'bg-gold text-black'
                      : 'bg-black/30 text-white-plum/80 hover:bg-black/50'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center text-white-plum/80">
            <FaMapMarkerAlt className="mr-2 text-gold" />
            <span>{userProfile?.location || 'Add your location...'}</span>
          </div>
        </div>
      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && userProfile && (
          <ProfileEditModal
            profile={userProfile}
            onClose={() => setIsEditing(false)}
            onSave={handleProfileUpdate}
            isLoading={isPageLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
