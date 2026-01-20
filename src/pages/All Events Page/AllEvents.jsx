import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
  CalendarDays,
  Briefcase,
  GraduationCap,
  Sparkles,
  PartyPopper,
  AlertCircle,
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { format, isPast, isFuture, isToday, isTomorrow } from 'date-fns';

const AllEvents = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // State management
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || '',
  );
  const [selectedEventType, setSelectedEventType] = useState(
    searchParams.get('eventType') || '',
  );
  const [selectedStatus, setSelectedStatus] = useState(
    searchParams.get('status') || 'upcoming',
  );
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1'),
  );
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-in-out' });
  }, []);

  // Event Types
  const eventTypes = [
    { value: '', label: 'All Types', icon: CalendarDays },
    { value: 'workshop', label: 'Workshop', icon: Briefcase },
    { value: 'seminar', label: 'Seminar', icon: GraduationCap },
    { value: 'extracurricular', label: 'Extracurricular', icon: Sparkles },
    { value: 'academic', label: 'Academic', icon: GraduationCap },
    { value: 'social', label: 'Social', icon: PartyPopper },
  ];

  // Event Status
  const statusOptions = [
    { value: 'upcoming', label: 'Upcoming', color: 'blue' },
    { value: 'ongoing', label: 'Ongoing', color: 'green' },
    { value: 'completed', label: 'Completed', color: 'gray' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' },
  ];

  // Popular tags
  const popularTags = [
    'web-development',
    'react',
    'nodejs',
    'programming',
    'career',
    'networking',
    'tech-fest',
    'competition',
    'hackathon',
    'cultural',
  ];

  // Fetch events with filters
  const {
    data: eventsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      'events',
      currentPage,
      searchQuery,
      selectedEventType,
      selectedStatus,
      selectedTag,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
      });

      if (searchQuery) params.append('search', searchQuery);
      if (selectedEventType) params.append('eventType', selectedEventType);
      if (selectedStatus) params.append('status', selectedStatus);
      if (selectedTag) params.append('tags', selectedTag);

      const response = await axiosInstance.get(
        `/portal/events?${params.toString()}`,
      );
      return response.data.data;
    },
  });

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedEventType) params.set('eventType', selectedEventType);
    if (selectedStatus) params.set('status', selectedStatus);
    if (selectedTag) params.set('tag', selectedTag);
    if (currentPage > 1) params.set('page', currentPage.toString());
    setSearchParams(params);
  }, [
    searchQuery,
    selectedEventType,
    selectedStatus,
    selectedTag,
    currentPage,
    setSearchParams,
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleEventTypeChange = (type) => {
    setSelectedEventType(type);
    setCurrentPage(1);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleTagClick = (tag) => {
    setSelectedTag(tag === selectedTag ? '' : tag);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedEventType('');
    setSelectedStatus('upcoming');
    setSelectedTag('');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedEventType ||
    selectedTag ||
    selectedStatus !== 'upcoming';

  // Helper function to get event date badge
  const getDateBadge = (startDate) => {
    const date = new Date(startDate);
    if (isToday(date)) return { text: 'Today', color: 'bg-green-500' };
    if (isTomorrow(date)) return { text: 'Tomorrow', color: 'bg-blue-500' };
    return null;
  };

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

  const events = eventsResponse?.events || [];
  const pagination = eventsResponse?.pagination || {};

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#04642a] to-[#15a33d] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto" data-aos="fade-up">
          <button
            onClick={() => {
              navigate('/blog');
            }}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Portal</span>
          </button>
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Campus Events
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Discover and register for exciting events happening on campus
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
                placeholder="Search events by title, description, or organizer..."
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
            <div className="space-y-6">
              {/* Event Types Filter */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Event Type
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
                  {eventTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        onClick={() => handleEventTypeChange(type.value)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                          selectedEventType === type.value
                            ? 'bg-[#04642a] text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Event Status
                </h3>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => handleStatusChange(status.value)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedStatus === status.value
                          ? 'bg-[#04642a] text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Tags */}
              <div>
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
              {selectedEventType && (
                <span className="px-3 py-1 bg-[#04642a]/10 dark:bg-[#04642a]/20 text-[#04642a] dark:text-[#15a33d] rounded-full text-sm font-medium flex items-center gap-1">
                  Type:{' '}
                  {eventTypes.find((t) => t.value === selectedEventType)?.label}
                  <button
                    onClick={() => setSelectedEventType('')}
                    className="hover:bg-[#04642a]/20 dark:hover:bg-[#04642a]/30 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedStatus !== 'upcoming' && (
                <span className="px-3 py-1 bg-[#04642a]/10 dark:bg-[#04642a]/20 text-[#04642a] dark:text-[#15a33d] rounded-full text-sm font-medium flex items-center gap-1">
                  Status:{' '}
                  {statusOptions.find((s) => s.value === selectedStatus)?.label}
                  <button
                    onClick={() => setSelectedStatus('upcoming')}
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
                  {events.length}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {pagination.totalEvents || 0}
                </span>{' '}
                events
              </>
            )}
          </p>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <SkeletonLoader />
        ) : error ? (
          <div className="text-center py-16" data-aos="fade-up">
            <CalendarDays className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Failed to load events
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please try again later or refresh the page
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16" data-aos="fade-up">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No events found
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
              {events.map((event, index) => {
                const dateBadge = getDateBadge(event.startDate);
                const isEventPast = isPast(new Date(event.endDate));
                const isEventFull = event.capacity && event.isFull;
                const registeredCount =
                  event.registeredCount || event.registeredUsers?.length || 0;

                return (
                  <div
                    key={event._id}
                    data-aos="fade-up"
                    data-aos-delay={index * 50}
                    className="group cursor-pointer rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                  >
                    {/* Event Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={
                          event.image ||
                          'https://i.ibb.co.com/rKJX4Dsp/Evening.webp'
                        }
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#04642a] text-white">
                          {event.eventType}
                        </span>
                        {dateBadge && (
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${dateBadge.color} text-white`}
                          >
                            {dateBadge.text}
                          </span>
                        )}
                      </div>
                      {isEventFull && (
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-500 text-white">
                            Full
                          </span>
                        </div>
                      )}
                      {isEventPast && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold">
                            Event Ended
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Event Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#04642a] transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                        {event.description}
                      </p>

                      {/* Event Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4 text-[#04642a]" />
                          <span>
                            {format(new Date(event.startDate), 'MMM dd, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="w-4 h-4 text-[#04642a]" />
                          <span>
                            {format(new Date(event.startDate), 'hh:mm a')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <MapPin className="w-4 h-4 text-[#04642a]" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Users className="w-4 h-4" />
                          <span>
                            {registeredCount}
                            {event.capacity && ` / ${event.capacity}`}
                          </span>
                        </div>
                        <Link
                          to={`/blog/EventDetail/${event._id}`}
                          className="text-[#04642a] dark:text-[#15a33d] font-medium text-sm hover:underline flex items-center gap-1"
                        >
                          View Details
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
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

export default AllEvents;
