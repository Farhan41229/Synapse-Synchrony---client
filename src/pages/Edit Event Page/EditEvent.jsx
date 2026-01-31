import { useAuthStore } from '@/store/authStore';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import eventService from '@/services/eventService';
import toast from 'react-hot-toast';
import {
  Upload,
  X,
  Image as ImageIcon,
  Calendar,
  MapPin,
  Users,
  Briefcase,
  Save,
  ArrowLeft,
  Sparkles,
  Loader2,
  Clock,
  Tag,
  AlertCircle,
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const EditEvent = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { id: eventId } = useParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-in-out' });
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: '',
    startDate: '',
    endDate: '',
    location: '',
    capacity: '',
    tags: '',
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiTitle, setAiTitle] = useState('');
  const [aiContext, setAiContext] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Event Types
  const eventTypes = [
    { value: 'workshop', label: 'Workshop', description: 'Hands-on learning session' },
    { value: 'seminar', label: 'Seminar', description: 'Educational talk' },
    { value: 'extracurricular', label: 'Extracurricular', description: 'Club activities' },
    { value: 'academic', label: 'Academic', description: 'Academic events' },
    { value: 'social', label: 'Social', description: 'Social gathering' },
  ];

  // Fetch existing event
  const { data: eventData, isLoading: isFetchingEvent, error: fetchError } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventService.getEventById(eventId),
    onError: (error) => {
      if (error.response?.status === 404) {
        toast.error('Event not found');
        navigate('/dashboard/my-events');
      } else if (error.response?.status === 403) {
        toast.error('You are not authorized to edit this event');
        navigate('/dashboard/my-events');
      }
    },
  });

  // Format dates for datetime-local input (YYYY-MM-DDTHH:mm)
  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Pre-fill form when data loads
  useEffect(() => {
    if (eventData?.data) {
      const event = eventData.data;
      
      // Check if user is the creator
      if (event.createdBy._id !== user?._id && event.createdBy !== user?._id) {
        toast.error('You are not authorized to edit this event');
        navigate('/dashboard/my-events');
        return;
      }

      setFormData({
        title: event.title,
        description: event.description,
        eventType: event.eventType,
        startDate: formatDateForInput(event.startDate),
        endDate: formatDateForInput(event.endDate),
        location: event.location,
        capacity: event.capacity?.toString() || '',
        tags: event.tags.join(', '),
        image: event.image,
      });
      setImagePreview(event.image);
    }
  }, [eventData, user, navigate]);

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: (data) => eventService.updateEvent(eventId, data),
    onSuccess: () => {
      toast.success('Event updated successfully!');
      queryClient.invalidateQueries(['event', eventId]);
      queryClient.invalidateQueries(['myEvents']);
      setTimeout(() => {
        navigate(`/blog/EventDetail/${eventId}`);
      }, 1500);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update event');
    },
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadstart = () => {
      toast.loading('Processing image...', { id: 'image-upload' });
    };
    reader.onloadend = () => {
      const base64String = reader.result;
      setFormData((prev) => ({
        ...prev,
        image: base64String,
      }));
      setImagePreview(base64String);
      toast.success('Image uploaded successfully!', { id: 'image-upload' });
    };
    reader.onerror = () => {
      toast.error('Failed to process image', { id: 'image-upload' });
    };
    reader.readAsDataURL(file);
  };

  // Remove image
  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
    toast.success('Image removed');
  };

  // Handle Generate with AI
  const handleGenerateWithAI = async () => {
    if (!aiTitle.trim()) {
      toast.error('Please enter an event title');
      return;
    }

    setIsGeneratingAI(true);
    try {
      const response = await eventService.generateEventWithAI({
        title: aiTitle,
        additionalContext: aiContext,
      });

      const aiData = response.data;
      
      // Populate form with AI-generated data
      setFormData((prev) => ({
        ...prev,
        title: aiTitle,
        description: aiData.description,
        eventType: aiData.suggestedType || prev.eventType,
        tags: aiData.suggestedTags?.join(', ') || prev.tags,
        capacity: aiData.suggestedCapacity?.toString() || prev.capacity,
      }));

      toast.success('Event details generated successfully!');
      setShowAIDialog(false);
      setAiTitle('');
      setAiContext('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate event details');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    if (!formData.eventType) {
      newErrors.eventType = 'Please select an event type';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    // Process tags
    const tagsArray = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const eventUpdateData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      eventType: formData.eventType,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      location: formData.location.trim(),
      capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
      tags: tagsArray,
      image: formData.image,
    };

    updateEventMutation.mutate(eventUpdateData);
  };

  // Loading state
  if (isFetchingEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#04642a]" />
          <span className="text-lg text-gray-700 dark:text-gray-300">Loading event...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Failed to load event
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {fetchError.response?.data?.message || 'Something went wrong'}
          </p>
          <button
            onClick={() => navigate('/dashboard/my-events')}
            className="px-6 py-3 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all"
          >
            Back to My Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#04642a] to-[#15a33d] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto" data-aos="fade-up">
          <button
            onClick={() => navigate(`/blog/EventDetail/${eventId}`)}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Event</span>
          </button>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-white/10 border border-white/20">
              <Calendar className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">
                Edit Mode
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Edit Event
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-6">
              Update your event details and information
            </p>
            
            {/* AI Regenerate Button */}
            <button
              onClick={() => setShowAIDialog(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#04642a] rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              Regenerate with AI
            </button>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Organizer Info */}
        <div
          className="mb-8 p-6 bg-gradient-to-r from-[#04642a]/5 to-[#15a33d]/5 dark:from-[#04642a]/10 dark:to-[#15a33d]/10 rounded-xl border border-[#04642a]/20"
          data-aos="fade-up"
        >
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://i.ibb.co.com/0yrpXd6k/Blank-Pfp.webp'}
              alt={user?.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#04642a]"
            />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Editing as
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {user?.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div data-aos="fade-up">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
              <Briefcase className="w-4 h-4 text-[#04642a]" />
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter an engaging title for your event..."
              className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 ${
                errors.title
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-200 dark:border-gray-700 focus:border-[#04642a]'
              } focus:outline-none transition-all`}
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Event Type */}
          <div data-aos="fade-up">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3">
              <Briefcase className="w-4 h-4 text-[#04642a]" />
              Event Type <span className="text-red-500">*</span>
            </label>
            <div className="grid md:grid-cols-5 gap-3">
              {eventTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, eventType: type.value }));
                    if (errors.eventType) {
                      setErrors((prev) => ({ ...prev, eventType: '' }));
                    }
                  }}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    formData.eventType === type.value
                      ? 'border-[#04642a] bg-[#04642a]/5 dark:bg-[#04642a]/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-[#04642a]/50'
                  }`}
                >
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">
                    {type.label}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {type.description}
                  </p>
                </button>
              ))}
            </div>
            {errors.eventType && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.eventType}
              </p>
            )}
          </div>

          {/* Description */}
          <div data-aos="fade-up">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
              <Briefcase className="w-4 h-4 text-[#04642a]" />
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={8}
              placeholder="Describe your event in detail..."
              className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 ${
                errors.description
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-200 dark:border-gray-700 focus:border-[#04642a]'
              } focus:outline-none transition-all resize-none`}
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-6" data-aos="fade-up">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                <Calendar className="w-4 h-4 text-[#04642a]" />
                Start Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 ${
                  errors.startDate
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-200 dark:border-gray-700 focus:border-[#04642a]'
                } focus:outline-none transition-all`}
              />
              {errors.startDate && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <X className="w-4 h-4" />
                  {errors.startDate}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                <Clock className="w-4 h-4 text-[#04642a]" />
                End Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 ${
                  errors.endDate
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-200 dark:border-gray-700 focus:border-[#04642a]'
                } focus:outline-none transition-all`}
              />
              {errors.endDate && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <X className="w-4 h-4" />
                  {errors.endDate}
                </p>
              )}
            </div>
          </div>

          {/* Location & Capacity */}
          <div className="grid md:grid-cols-2 gap-6" data-aos="fade-up">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                <MapPin className="w-4 h-4 text-[#04642a]" />
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Event venue or location"
                className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 ${
                  errors.location
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-200 dark:border-gray-700 focus:border-[#04642a]'
                } focus:outline-none transition-all`}
              />
              {errors.location && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <X className="w-4 h-4" />
                  {errors.location}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                <Users className="w-4 h-4 text-[#04642a]" />
                Capacity (Optional)
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Maximum attendees"
                min="1"
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 focus:border-[#04642a] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div data-aos="fade-up">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3">
              <ImageIcon className="w-4 h-4 text-[#04642a]" />
              Event Image (Optional)
            </label>

            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-12 text-center hover:border-[#04642a] dark:hover:border-[#15a33d] transition-all bg-gray-50 dark:bg-gray-800/50">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-900 dark:text-white font-semibold mb-2">
                    Click to upload event image
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    PNG, JPG, WEBP up to 5MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Tags */}
          <div data-aos="fade-up">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
              <Tag className="w-4 h-4 text-[#04642a]" />
              Tags (Optional)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="react, nodejs, workshop (separate with commas)"
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 focus:border-[#04642a] focus:outline-none transition-all"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6" data-aos="fade-up">
            <button
              type="submit"
              disabled={updateEventMutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#04642a] text-white rounded-lg font-semibold text-lg hover:bg-[#15a33d] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {updateEventMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Update Event
                </>
              )}
            </button>
          </div>

          {/* Update Info */}
          <div
            className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
            data-aos="fade-up"
          >
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Note:</strong> Your changes will be saved immediately. All registered users will see the updated information.
            </p>
          </div>
        </form>
      </div>

      {/* AI Generation Dialog */}
      {showAIDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6 shadow-2xl"
            data-aos="zoom-in"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Regenerate Event with AI
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Let AI recreate your event details
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAIDialog(false)}
                disabled={isGeneratingAI}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={aiTitle}
                  onChange={(e) => setAiTitle(e.target.value)}
                  placeholder="e.g., Python for Beginners Workshop"
                  disabled={isGeneratingAI}
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 focus:border-[#04642a] focus:outline-none transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Additional Context (Optional)
                </label>
                <textarea
                  value={aiContext}
                  onChange={(e) => setAiContext(e.target.value)}
                  placeholder="Any specific details you want to include..."
                  disabled={isGeneratingAI}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 focus:border-[#04642a] focus:outline-none transition-all resize-none disabled:opacity-50"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAIDialog(false)}
                  disabled={isGeneratingAI}
                  className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateWithAI}
                  disabled={isGeneratingAI || !aiTitle.trim()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isGeneratingAI ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditEvent;
