'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { FaSpinner, FaLock, FaBell, FaUserShield, FaToggleOn, FaToggleOff, FaCheck, FaImage, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import api from '@/services/api';

interface SettingsState {
  emailNotifications: boolean;
  eventReminders: boolean;
  profileVisibility: 'public' | 'private';
  marketingEmails: boolean;
  bio: string;
  location: string;
  favorite_genres: string[];
  favorite_artists: string[];
}

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

export default function SettingsPage() {
  const { user, isAuthenticated, checkAuth, updateUser } = useAuth();
  const router = useRouter();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useParallax(scrollYProgress, 100);

  const [isLoading, setIsLoading] = useState(true);  
  const [isUploading, setIsUploading] = useState(false);
  const [updatingSettings, setUpdatingSettings] = useState<{ [key: string]: boolean }>({});
  const [settings, setSettings] = useState<SettingsState>({
    emailNotifications: false,
    eventReminders: false,
    profileVisibility: 'public',
    marketingEmails: false,
    bio: '',
    location: '',
    favorite_genres: [],
    favorite_artists: [],
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successfulUpdates, setSuccessfulUpdates] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchSettings();
  }, [isAuthenticated, router]);

  const fetchSettings = async () => {
    try {
      const [settingsResponse, profileResponse] = await Promise.all([
        api.get('/settings/me'),
        api.get('/profiles/me')
      ]);

      if (!settingsResponse.data || !profileResponse.data) {
        throw new Error('Failed to fetch settings data');
      }

      setSettings({
        emailNotifications: settingsResponse.data.email_notifications ?? false,
        eventReminders: settingsResponse.data.event_reminders ?? false,
        profileVisibility: settingsResponse.data.profile_visibility ?? 'public',
        marketingEmails: settingsResponse.data.marketing_emails ?? false,
        bio: profileResponse.data.bio ?? '',
        location: profileResponse.data.location ?? '',
        favorite_genres: profileResponse.data.favorite_genres ?? [],
        favorite_artists: profileResponse.data.favorite_artists ?? [],
      });
    } catch (error: any) {
      console.error('Failed to fetch settings:', error);
      toast.error(error.response?.data?.message || 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSetting = async (key: keyof SettingsState) => {
    try {
      setUpdatingSettings(prev => ({ ...prev, [key]: true }));
      
      const newValue = !settings[key];
      
      const response = await api.patch('/settings/update_me/', {
        [key]: newValue
      });
      
      setSettings(prev => ({
        ...prev,
        [key]: newValue
      }));
      
      setSuccessfulUpdates(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setSuccessfulUpdates(prev => ({ ...prev, [key]: false }));
      }, 2000);
      
      toast.success('Setting updated successfully');
    } catch (error: any) {
      console.error('Failed to update setting:', error);
      setSettings(prev => ({
        ...prev,
        [key]: !settings[key]
      }));
      toast.error(error.response?.data?.message || 'Failed to update setting');
    } finally {
      setUpdatingSettings(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleVisibilityChange = async (visibility: 'public' | 'private') => {
    if (settings.profileVisibility === visibility) return;
    
    try {
      setUpdatingSettings(prev => ({ ...prev, profileVisibility: true }));
      
      const response = await api.patch('/settings/update_me/', {
        profileVisibility: visibility
      });
      
      setSettings(prev => ({
        ...prev,
        profileVisibility: visibility
      }));
      
      setSuccessfulUpdates(prev => ({ ...prev, profileVisibility: true }));
      setTimeout(() => {
        setSuccessfulUpdates(prev => ({ ...prev, profileVisibility: false }));
      }, 2000);
      
      toast.success('Profile visibility updated successfully');
    } catch (error: any) {
      console.error('Failed to update profile visibility:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile visibility');
    } finally {
      setUpdatingSettings(prev => ({ ...prev, profileVisibility: false }));
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Failed to update password:', error);
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      await api.patch('/settings/update_me/', settings);
      toast.success('Settings updated successfully');
      await fetchSettings(); // Refresh settings after update
    } catch (error: any) {
      console.error('Failed to update settings:', error);
      toast.error(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/profiles/me/image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (user) {
        updateUser({
          ...user,
          profile: {
            ...user.profile,
            profile_image: response.data.image_url,
          },
        });
      }
      toast.success('Profile image updated successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setIsUploading(true);
      await api.delete('/profiles/me/image/');

      if (user) {
        updateUser({
          ...user,
          profile: {
            ...user.profile,
            profile_image: null,
          },
        });
      }
      toast.success('Profile image removed successfully');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    } finally {
      setIsUploading(false);
    }
  };

  const SettingToggle = ({ label, value, onChange, settingKey }: { label: string; value: boolean; onChange: () => void; settingKey: string }) => {
    // Get the actual value from settings state
    const currentValue = settings[settingKey as keyof SettingsState];
    
    return (
      <div className="flex items-center justify-between py-4">
        <span className="text-white">{label}</span>
        <div className="flex items-center gap-2">
          {successfulUpdates[settingKey] && (
            <FaCheck className="text-green-500" />
          )}
          <button
            onClick={onChange}
            disabled={updatingSettings[settingKey]}
            className="text-2xl text-gold hover:text-gold/80 transition-colors disabled:opacity-50 relative"
          >
            {updatingSettings[settingKey] ? (
              <FaSpinner className="animate-spin" />
            ) : currentValue ? (
              <FaToggleOn />
            ) : (
              <FaToggleOff />
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-jet-black via-coffee-bean to-jet-black py-12 px-4 sm:px-6 lg:px-8 perspective-1000">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.h1
          style={{ y }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-white text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-gold via-amber-500 to-gold"
        >
          Settings
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Section */}
          <motion.section
            initial={{ opacity: 0, rotateX: -10 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 transform hover:scale-[1.02] transition-transform duration-300 hover:shadow-2xl hover:shadow-gold/20"
          >
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <FaImage className="text-gold" />
              Profile
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={settings.bio}
                  onChange={(e) => setSettings(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold focus:border-transparent h-24 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={settings.location}
                  onChange={(e) => setSettings(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Your location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                    className="hidden"
                    id="profile-image"
                  />
                  <label
                    htmlFor="profile-image"
                    className="px-4 py-2 bg-gold text-jet-black rounded-lg cursor-pointer hover:bg-gold/90 transition-colors flex items-center gap-2"
                  >
                    <FaImage /> Upload Image
                  </label>
                  {user?.profile?.profile_image && (
                    <button
                      onClick={handleRemoveImage}
                      className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2"
                    >
                      <FaTrash /> Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Account Security */}
          <motion.section
            initial={{ opacity: 0, rotateX: -10 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 transform hover:scale-[1.02] transition-transform duration-300 hover:shadow-2xl hover:shadow-gold/20"
          >
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <FaLock className="text-gold" />
              Account Security
            </h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gold text-jet-black px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gold/90 transition-colors disabled:opacity-50"
              >
                {isLoading ? <FaSpinner className="animate-spin" /> : 'Update Password'}
              </button>
            </form>
          </motion.section>

          {/* Notification Preferences */}
          <motion.section
            initial={{ opacity: 0, rotateX: -10 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 transform hover:scale-[1.02] transition-transform duration-300 hover:shadow-2xl hover:shadow-gold/20"
          >
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <FaBell className="text-gold" />
              Notification Preferences
            </h2>
            <div className="space-y-2">
              <SettingToggle
                label="Email Notifications"
                value={settings.emailNotifications}
                onChange={() => handleToggleSetting('emailNotifications')}
                settingKey="emailNotifications"
              />
              <SettingToggle
                label="Event Reminders"
                value={settings.eventReminders}
                onChange={() => handleToggleSetting('eventReminders')}
                settingKey="eventReminders"
              />
              <SettingToggle
                label="Marketing Emails"
                value={settings.marketingEmails}
                onChange={() => handleToggleSetting('marketingEmails')}
                settingKey="marketingEmails"
              />
            </div>
          </motion.section>

          {/* Privacy Settings */}
          <motion.section
            initial={{ opacity: 0, rotateX: -10 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 transform hover:scale-[1.02] transition-transform duration-300 hover:shadow-2xl hover:shadow-gold/20"
          >
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <FaUserShield className="text-gold" />
              Privacy Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Profile Visibility</span>
                <div className="flex items-center gap-2">
                  {successfulUpdates.profileVisibility && (
                    <FaCheck className="text-green-500" />
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVisibilityChange('public')}
                      disabled={updatingSettings.profileVisibility}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        settings.profileVisibility === 'public'
                          ? 'bg-gold text-jet-black'
                          : 'bg-white/5 text-white'
                      } disabled:opacity-50`}
                    >
                      {updatingSettings.profileVisibility ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        'Public'
                      )}
                    </button>
                    <button
                      onClick={() => handleVisibilityChange('private')}
                      disabled={updatingSettings.profileVisibility}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        settings.profileVisibility === 'private'
                          ? 'bg-gold text-jet-black'
                          : 'bg-white/5 text-white'
                      } disabled:opacity-50`}
                    >
                      {updatingSettings.profileVisibility ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        'Private'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Save All Changes Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mt-12"
        >
          <button
            onClick={handleSaveSettings}
            disabled={isLoading}
            className="bg-gold text-jet-black px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 hover:bg-gold/90 transition-colors disabled:opacity-50 transform hover:scale-105 transition-transform duration-300"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <FaCheck />
                Save All Changes
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
