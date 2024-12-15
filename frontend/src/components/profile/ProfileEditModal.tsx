import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaCamera } from 'react-icons/fa';
import { Profile } from '@/types/auth';
import authService from '@/services/authService';
import Image from 'next/image';

interface ProfileEditModalProps {
  profile: Profile;
  onClose: () => void;
  onSave: (updatedProfile: Partial<Profile>) => Promise<void>;
  isLoading: boolean;
}

export default function ProfileEditModal({
  profile,
  onClose,
  onSave,
  isLoading,
}: ProfileEditModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [formData, setFormData] = useState({
    bio: profile.bio || '',
    location: profile.location || '',
    favorite_genres: profile.favorite_genres.join(', '),
    favorite_artists: profile.favorite_artists.join(', '),
    instagram: profile.instagram || '',
    twitter: profile.twitter || '',
    facebook: profile.facebook || '',
    profile_privacy: profile.profile_privacy,
    email_notifications: profile.email_notifications,
    push_notifications: profile.push_notifications,
  });

  const handlePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPicture(true);
      await authService.updateProfilePicture(file);
      // The profile picture will be updated in the UI through the user context
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
      // Handle error (show toast notification, etc.)
    } finally {
      setUploadingPicture(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile = {
      ...formData,
      favorite_genres: formData.favorite_genres
        .split(',')
        .map((genre) => genre.trim())
        .filter(Boolean),
      favorite_artists: formData.favorite_artists
        .split(',')
        .map((artist) => artist.trim())
        .filter(Boolean),
    };
    await onSave(updatedProfile);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-coffee-bean rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold text-gold mb-6">Edit Profile</h2>
        
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32 mb-4">
            <Image
              src={profile.profile_picture || '/images/default-avatar.png'}
              alt="Profile"
              fill
              className="rounded-full object-cover"
            />
            <button
              onClick={handlePictureClick}
              disabled={uploadingPicture}
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity"
            >
              {uploadingPicture ? (
                <FaSpinner className="animate-spin text-2xl text-gold" />
              ) : (
                <FaCamera className="text-2xl text-gold" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePictureChange}
              className="hidden"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bio */}
          <div>
            <label className="block text-chalk mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-coffee-bean/20 text-chalk rounded-lg p-3 focus:ring-2 focus:ring-gold outline-none"
              rows={4}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-chalk mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full bg-coffee-bean/20 text-chalk rounded-lg p-3 focus:ring-2 focus:ring-gold outline-none"
            />
          </div>

          {/* Favorite Genres */}
          <div>
            <label className="block text-chalk mb-2">
              Favorite Genres (comma-separated)
            </label>
            <input
              type="text"
              value={formData.favorite_genres}
              onChange={(e) =>
                setFormData({ ...formData, favorite_genres: e.target.value })
              }
              className="w-full bg-coffee-bean/20 text-chalk rounded-lg p-3 focus:ring-2 focus:ring-gold outline-none"
            />
          </div>

          {/* Favorite Artists */}
          <div>
            <label className="block text-chalk mb-2">
              Favorite Artists (comma-separated)
            </label>
            <input
              type="text"
              value={formData.favorite_artists}
              onChange={(e) =>
                setFormData({ ...formData, favorite_artists: e.target.value })
              }
              className="w-full bg-coffee-bean/20 text-chalk rounded-lg p-3 focus:ring-2 focus:ring-gold outline-none"
            />
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gold">Social Media</h3>
            <div>
              <label className="block text-chalk mb-2">Instagram Username</label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) =>
                  setFormData({ ...formData, instagram: e.target.value })
                }
                className="w-full bg-coffee-bean/20 text-chalk rounded-lg p-3 focus:ring-2 focus:ring-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-chalk mb-2">Twitter Username</label>
              <input
                type="text"
                value={formData.twitter}
                onChange={(e) =>
                  setFormData({ ...formData, twitter: e.target.value })
                }
                className="w-full bg-coffee-bean/20 text-chalk rounded-lg p-3 focus:ring-2 focus:ring-gold outline-none"
              />
            </div>
            <div>
              <label className="block text-chalk mb-2">Facebook Username</label>
              <input
                type="text"
                value={formData.facebook}
                onChange={(e) =>
                  setFormData({ ...formData, facebook: e.target.value })
                }
                className="w-full bg-coffee-bean/20 text-chalk rounded-lg p-3 focus:ring-2 focus:ring-gold outline-none"
              />
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gold">Settings</h3>
            <div>
              <label className="block text-chalk mb-2">Profile Privacy</label>
              <select
                value={formData.profile_privacy}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profile_privacy: e.target.value as Profile['profile_privacy'],
                  })
                }
                className="w-full bg-coffee-bean/20 text-chalk rounded-lg p-3 focus:ring-2 focus:ring-gold outline-none"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="friends">Friends Only</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-chalk">
                <input
                  type="checkbox"
                  checked={formData.email_notifications}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email_notifications: e.target.checked,
                    })
                  }
                  className="form-checkbox text-gold rounded focus:ring-gold"
                />
                Email Notifications
              </label>
              <label className="flex items-center gap-2 text-chalk">
                <input
                  type="checkbox"
                  checked={formData.push_notifications}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      push_notifications: e.target.checked,
                    })
                  }
                  className="form-checkbox text-gold rounded focus:ring-gold"
                />
                Push Notifications
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-full border border-gold text-gold hover:bg-gold/10 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-gold text-jet-black hover:bg-gold/80 transition-colors flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
