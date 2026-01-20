import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import {
  Search,
  Filter,
  Heart,
  Eye,
  User,
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
  TrendingUp,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { format } from 'date-fns';

const AllBlogs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // State management
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || '',
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || '',
  );
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1'),
  );
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-in-out' });
  }, []);

  // Categories
  const categories = [
    { value: '', label: 'All Categories', icon: BookOpen },
    { value: 'experience', label: 'Experience', icon: Sparkles },
    { value: 'academic', label: 'Academic', icon: BookOpen },
    { value: 'campus-life', label: 'Campus Life', icon: User },
    { value: 'tips', label: 'Tips', icon: TrendingUp },
    { value: 'story', label: 'Story', icon: Heart },
  ];

  // Popular tags
  const popularTags = [
    'freshman',
    'university-life',
    'computer-science',
    'advice',
    'exams',
    'study-tips',
    'programming',
    'internship',
    'career',
    'mental-health',
  ];

  // Fetch blogs with filters
  const {
    data: blogsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      'blogs',
      currentPage,
      searchQuery,
      selectedCategory,
      selectedTag,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
      });

      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedTag) params.append('tags', selectedTag);

      const response = await axiosInstance.get(
        `/portal/blogs?${params.toString()}`,
      );
      return response.data.data;
    },
  });

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedTag) params.set('tag', selectedTag);
    if (currentPage > 1) params.set('page', currentPage.toString());
    setSearchParams(params);
  }, [
    searchQuery,
    selectedCategory,
    selectedTag,
    currentPage,
    setSearchParams,
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleTagClick = (tag) => {
    setSelectedTag(tag === selectedTag ? '' : tag);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTag('');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedTag;

  // Skeleton Loader
  const SkeletonLoader = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 dark:bg-gray-800 h-48 rounded-t-xl" />
          <div className="bg-white dark:bg-gray-900 p-6 rounded-b-xl border border-gray-200 dark:border-gray-700">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-3" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mb-3" />
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  const blogs = blogsResponse?.blogs || [];
  const pagination = blogsResponse?.pagination || {};

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#04642a] to-[#15a33d] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto" data-aos="fade-up">
          <button
            onClick={() => {
              navigate('/blog')
            }}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Portal</span>
          </button>
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              All Blog Posts
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Explore stories, experiences, and insights from our student
              community
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs by title or content..."
                className="w-full pl-12 pr-4 py-4 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-white/20 focus:border-white focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters Section */}
        <div className="mb-8" data-aos="fade-up">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all"
            >
              <Filter className="w-5 h-5" />
              <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
          </div>

          {/* Filters Content */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Categories Filter */}
              <div className="lg:col-span-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Categories
                  </h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-[#04642a] dark:text-[#15a33d] hover:underline font-medium flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Clear All
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.value}
                        onClick={() => handleCategoryChange(category.value)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                          selectedCategory === category.value
                            ? 'bg-[#04642a] text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {category.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Popular Tags */}
              <div className="lg:col-span-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedTag === tag
                          ? 'bg-[#04642a] text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active filters:
              </span>
              {searchQuery && (
                <span className="px-3 py-1 bg-[#04642a]/10 dark:bg-[#04642a]/20 text-[#04642a] dark:text-[#15a33d] rounded-full text-sm font-medium flex items-center gap-1">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className="hover:bg-[#04642a]/20 dark:hover:bg-[#04642a]/30 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory && (
                <span className="px-3 py-1 bg-[#04642a]/10 dark:bg-[#04642a]/20 text-[#04642a] dark:text-[#15a33d] rounded-full text-sm font-medium flex items-center gap-1">
                  Category:{' '}
                  {categories.find((c) => c.value === selectedCategory)?.label}
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="hover:bg-[#04642a]/20 dark:hover:bg-[#04642a]/30 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedTag && (
                <span className="px-3 py-1 bg-[#04642a]/10 dark:bg-[#04642a]/20 text-[#04642a] dark:text-[#15a33d] rounded-full text-sm font-medium flex items-center gap-1">
                  Tag: #{selectedTag}
                  <button
                    onClick={() => setSelectedTag('')}
                    className="hover:bg-[#04642a]/20 dark:hover:bg-[#04642a]/30 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div
          className="mb-6 flex items-center justify-between"
          data-aos="fade-up"
        >
          <p className="text-gray-600 dark:text-gray-400">
            {isLoading ? (
              'Loading...'
            ) : (
              <>
                Showing{' '}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {blogs.length}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {pagination.totalBlogs || 0}
                </span>{' '}
                blog posts
              </>
            )}
          </p>
        </div>

        {/* Blogs Grid */}
        {isLoading ? (
          <SkeletonLoader />
        ) : error ? (
          <div className="text-center py-16" data-aos="fade-up">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Failed to load blogs
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please try again later or refresh the page
            </p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16" data-aos="fade-up">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No blogs found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your filters or search query
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {blogs.map((blog, index) => (
                <div
                  key={blog._id}
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                  className="group cursor-pointer rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Blog Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        blog.image || 'https://i.ibb.co.com/QvRXjjrG/Study.webp'
                      }
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#04642a] text-white">
                        {blog.category}
                      </span>
                    </div>
                  </div>

                  {/* Blog Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#04642a] transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                      {blog.content}
                    </p>

                    {/* Author & Date */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{blog.author?.name || 'Anonymous'}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>
                            {blog.likeCount || blog.likes?.length || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{blog.views || 0}</span>
                        </div>
                      </div>
                      <Link
                        to={`/blog/BlogDetail/${blog._id}`}
                        className="text-[#04642a] dark:text-[#15a33d] font-medium text-sm hover:underline flex items-center gap-1"
                      >
                        Read More
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div
                className="flex items-center justify-center gap-2"
                data-aos="fade-up"
              >
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1,
                  ).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            currentPage === page
                              ? 'bg-[#04642a] text-white'
                              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span
                          key={page}
                          className="px-2 text-gray-500 dark:text-gray-400"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(pagination.totalPages, prev + 1),
                    )
                  }
                  disabled={currentPage === pagination.totalPages}
                  className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllBlogs;
