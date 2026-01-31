import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateUserProfile, refineBioWithAI } from '@/services/profileService';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  Edit3,
  Save,
  X,
  Upload,
  Sparkles,
  Loader2,
  AlertCircle,
  Camera,
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ProfilePage = () => {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('view');
  const [isRefiningBio, setIsRefiningBio] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-in-out' });
  }, []);

  // Fetch profile data
  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
  });

  // Form state for editing
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    bio: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    emergencyContact: {
      name: '',
      phone: '',
    },
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [errors, setErrors] = useState({});

  // Update form data when profile loads
  useEffect(() => {
    if (profileData?.data) {
      const profile = profileData.data;
      setFormData({
        name: profile.name || '',
        avatar: profile.avatar || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
        gender: profile.gender || '',
        emergencyContact: {
          name: profile.emergencyContact?.name || '',
          phone: profile.emergencyContact?.phone || '',
        },
        address: {
          street: profile.address?.street || '',
          city: profile.address?.city || '',
          state: profile.address?.state || '',
          zipCode: profile.address?.zipCode || '',
          country: profile.address?.country || '',
        },
      });
      setAvatarPreview(profile.avatar);
    }
  }, [profileData]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (response) => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries(['userProfile']);
      setUser(response.data.data);
      setActiveTab('view');
      setErrors({});
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Refine bio with AI
  const handleRefineBio = async () => {
    if (!formData.bio.trim()) {
      toast.error('Please enter a bio first');
      return;
    }

    setIsRefiningBio(true);
    try {
      const response = await refineBioWithAI(formData.bio);
      setFormData({ ...formData, bio: response.data.refinedBio });
      toast.success('Bio refined successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to refine bio');
    } finally {
      setIsRefiningBio(false);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    updateProfileMutation.mutate(formData);
  };

  // Handle cancel
  const handleCancel = () => {
    if (profileData?.data) {
      const profile = profileData.data;
      setFormData({
        name: profile.name || '',
        avatar: profile.avatar || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
        gender: profile.gender || '',
        emergencyContact: {
          name: profile.emergencyContact?.name || '',
          phone: profile.emergencyContact?.phone || '',
        },
        address: {
          street: profile.address?.street || '',
          city: profile.address?.city || '',
          state: profile.address?.state || '',
          zipCode: profile.address?.zipCode || '',
          country: profile.address?.country || '',
        },
      });
      setAvatarPreview(profile.avatar);
    }
    setErrors({});
    setActiveTab('view');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#04642a]" />
          <span className="text-lg text-gray-700 dark:text-gray-300">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle className="w-6 h-6" />
          <span className="text-lg">Failed to load profile</span>
        </div>
      </div>
    );
  }

  const profile = profileData?.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8" data-aos="fade-down">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your personal information and preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden" data-aos="fade-up">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('view')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all ${
                activeTab === 'view'
                  ? 'text-[#04642a] border-b-2 border-[#04642a] bg-green-50 dark:bg-green-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <User className="w-5 h-5" />
                View Profile
              </div>
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all ${
                activeTab === 'edit'
                  ? 'text-[#04642a] border-b-2 border-[#04642a] bg-green-50 dark:bg-green-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Edit3 className="w-5 h-5" />
                Edit Profile
              </div>
            </button>
          </div>

          {/* View Profile Tab */}
          {activeTab === 'view' && (
            <div className="p-8">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <img
                    src={profile.avatar || 'https://i.ibb.co.com/0yrpXd6k/Blank-Pfp.webp'}
                    alt={profile.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#04642a] shadow-lg"
                  />
                  <div className="absolute bottom-0 right-0 bg-[#04642a] rounded-full p-2">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
                  {profile.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {profile.role}
                </p>
              </div>

              {/* Profile Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Mail className="w-5 h-5 text-[#04642a] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-gray-900 dark:text-white font-medium">{profile.email}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Phone className="w-5 h-5 text-[#04642a] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {profile.phone || 'Not provided'}
                    </p>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-[#04642a] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {profile.dateOfBirth
                        ? new Date(profile.dateOfBirth).toLocaleDateString()
                        : 'Not provided'}
                    </p>
                  </div>
                </div>

                {/* Gender */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <User className="w-5 h-5 text-[#04642a] mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                    <p className="text-gray-900 dark:text-white font-medium capitalize">
                      {profile.gender?.replace('_', ' ') || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Bio</p>
                  <p className="text-gray-900 dark:text-white leading-relaxed">{profile.bio}</p>
                </div>
              )}

              {/* Address */}
              {(profile.address?.street || profile.address?.city) && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#04642a] mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Address</p>
                      <p className="text-gray-900 dark:text-white">
                        {profile.address.street && <span>{profile.address.street}<br /></span>}
                        {profile.address.city && <span>{profile.address.city}</span>}
                        {profile.address.state && <span>, {profile.address.state}</span>}
                        {profile.address.zipCode && <span> {profile.address.zipCode}</span>}
                        {profile.address.country && <><br />{profile.address.country}</>}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Emergency Contact */}
              {(profile.emergencyContact?.name || profile.emergencyContact?.phone) && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-2">
                        Emergency Contact
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {profile.emergencyContact.name && (
                          <span className="block">{profile.emergencyContact.name}</span>
                        )}
                        {profile.emergencyContact.phone && (
                          <span className="block text-sm">{profile.emergencyContact.phone}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Edit Profile Tab */}
          {activeTab === 'edit' && (
            <form onSubmit={handleSubmit} className="p-8">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <img
                    src={avatarPreview || 'https://i.ibb.co.com/0yrpXd6k/Blank-Pfp.webp'}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#04642a] shadow-lg"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera className="w-8 h-8 text-white" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Click to change avatar
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.name
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-[#04642a]'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:outline-none transition-all`}
                    placeholder="Your full name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Bio with AI */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Bio (max 500 characters)
                    </label>
                    <button
                      type="button"
                      onClick={handleRefineBio}
                      disabled={isRefiningBio || !formData.bio.trim()}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-[#04642a] to-[#15a33d] rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {isRefiningBio ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Refining...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Refine with AI
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    maxLength="500"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.bio
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-[#04642a]'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:outline-none transition-all resize-none`}
                    placeholder="Tell us about yourself..."
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formData.bio.length}/500 characters
                    </p>
                    {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
                  </div>
                </div>

                {/* Phone and Date of Birth */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#04642a] focus:outline-none transition-all"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#04642a] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#04642a] focus:outline-none transition-all"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>

                {/* Emergency Contact */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Contact Name
                      </label>
                      <input
                        type="text"
                        name="emergencyContact.name"
                        value={formData.emergencyContact.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#04642a] focus:outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        name="emergencyContact.phone"
                        value={formData.emergencyContact.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#04642a] focus:outline-none transition-all"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#04642a]" />
                    Address
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#04642a] focus:outline-none transition-all"
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="address.city"
                          value={formData.address.city}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#04642a] focus:outline-none transition-all"
                          placeholder="New York"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          State/Province
                        </label>
                        <input
                          type="text"
                          name="address.state"
                          value={formData.address.state}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#04642a] focus:outline-none transition-all"
                          placeholder="NY"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          ZIP/Postal Code
                        </label>
                        <input
                          type="text"
                          name="address.zipCode"
                          value={formData.address.zipCode}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#04642a] focus:outline-none transition-all"
                          placeholder="10001"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          name="address.country"
                          value={formData.address.country}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#04642a] focus:outline-none transition-all"
                          placeholder="United States"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#04642a] to-[#15a33d] text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={updateProfileMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
