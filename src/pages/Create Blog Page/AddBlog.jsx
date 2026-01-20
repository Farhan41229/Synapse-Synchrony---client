import { useAuthStore } from '@/store/authStore';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import toast from 'react-hot-toast';
import {
  Upload,
  X,
  Image as ImageIcon,
  FileText,
  Tag,
  Folder,
  Send,
  ArrowLeft,
  Sparkles,
  Eye,
  Loader2,
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AddBlog = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-in-out' });
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    image: null,
    tags: '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [charCount, setCharCount] = useState(0);

  // Categories
  const categories = [
    {
      value: 'experience',
      label: 'Experience',
      description: 'Share your personal journey',
    },
    {
      value: 'academic',
      label: 'Academic',
      description: 'Educational insights',
    },
    {
      value: 'campus-life',
      label: 'Campus Life',
      description: 'Daily campus experiences',
    },
    { value: 'tips', label: 'Tips', description: 'Helpful advice and guides' },
    { value: 'story', label: 'Story', description: 'Tell your story' },
  ];

  // Create blog mutation
  const createBlogMutation = useMutation({
    mutationFn: async (blogData) => {
      const response = await axiosInstance.post('/portal/blogs', blogData);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Blog published successfully!');
      setTimeout(() => {
        navigate(`/blog/BlogDetail/${data.data._id}`);
      }, 1500);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to publish blog');
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

    // Update character count for content
    if (name === 'content') {
      setCharCount(value.length);
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Convert to base64
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

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 100) {
      newErrors.content = 'Content must be at least 100 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
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

    const blogData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      category: formData.category,
      image: formData.image,
      tags: tagsArray,
    };

    createBlogMutation.mutate(blogData);
  };

  // Handle preview
  const handlePreview = () => {
    if (!formData.title || !formData.content) {
      toast.error('Please fill in title and content to preview');
      return;
    }
    toast.success('Preview feature coming soon!');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#04642a] to-[#15a33d] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto" data-aos="fade-up">
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Portal</span>
          </button>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-white/10 border border-white/20">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">
                Share Your Story
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Create a Blog Post
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Share your experiences, insights, and stories with the campus
              community
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Author Info */}
        <div
          className="mb-8 p-6 bg-gradient-to-r from-[#04642a]/5 to-[#15a33d]/5 dark:from-[#04642a]/10 dark:to-[#15a33d]/10 rounded-xl border border-[#04642a]/20"
          data-aos="fade-up"
        >
          <div className="flex items-center gap-4">
            <img
              src={
                user?.avatar || 'https://i.ibb.co.com/0yrpXd6k/Blank-Pfp.webp'
              }
              alt={user?.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#04642a]"
            />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Publishing as
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
              <FileText className="w-4 h-4 text-[#04642a]" />
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a captivating title for your blog..."
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

          {/* Category */}
          <div data-aos="fade-up">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3">
              <Folder className="w-4 h-4 text-[#04642a]" />
              Category <span className="text-red-500">*</span>
            </label>
            <div className="grid md:grid-cols-5 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, category: cat.value }));
                    if (errors.category) {
                      setErrors((prev) => ({ ...prev, category: '' }));
                    }
                  }}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    formData.category === cat.value
                      ? 'border-[#04642a] bg-[#04642a]/5 dark:bg-[#04642a]/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-[#04642a]/50'
                  }`}
                >
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">
                    {cat.label}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {cat.description}
                  </p>
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Content */}
          <div data-aos="fade-up">
            <label className="flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-white mb-2">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#04642a]" />
                Content <span className="text-red-500">*</span>
              </span>
              <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                {charCount} characters
              </span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={12}
              placeholder="Write your blog content here... Share your experiences, insights, and stories with the community."
              className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 ${
                errors.content
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-200 dark:border-gray-700 focus:border-[#04642a]'
              } focus:outline-none transition-all resize-none`}
            />
            {errors.content && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.content}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Minimum 100 characters required
            </p>
          </div>

          {/* Image Upload */}
          <div data-aos="fade-up">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3">
              <ImageIcon className="w-4 h-4 text-[#04642a]" />
              Featured Image (Optional)
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
                <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/70 text-white rounded-lg text-sm font-medium">
                  Featured Image
                </div>
              </div>
            ) : (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-12 text-center hover:border-[#04642a] dark:hover:border-[#15a33d] transition-all bg-gray-50 dark:bg-gray-800/50">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-900 dark:text-white font-semibold mb-2">
                    Click to upload featured image
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    PNG, JPG, WEBP up to 5MB
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Image will be converted to base64 for storage
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
              placeholder="freshman, university-life, tips (separate with commas)"
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 focus:border-[#04642a] focus:outline-none transition-all"
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Add relevant tags separated by commas to help readers find your
              blog
            </p>
          </div>

          {/* Action Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 pt-6"
            data-aos="fade-up"
          >
            <button
              type="submit"
              disabled={createBlogMutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#04642a] text-white rounded-lg font-semibold text-lg hover:bg-[#15a33d] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {createBlogMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Publish Blog
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handlePreview}
              disabled={createBlogMutation.isPending}
              className="flex-1 sm:flex-none px-6 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              Preview
            </button>
          </div>

          {/* Publishing Info */}
          <div
            className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
            data-aos="fade-up"
          >
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Note:</strong> Your blog will be published immediately and
              visible to all students on the platform. Make sure to review your
              content before publishing.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;
