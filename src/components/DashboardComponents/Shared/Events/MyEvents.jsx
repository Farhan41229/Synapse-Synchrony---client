import { useAuthStore } from '@/store/authStore';
import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import eventService from '@/services/eventService';
import { Link } from 'react-router';
import toast from 'react-hot-toast';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit,
  Trash2,
  Plus,
  CalendarDays,
  AlertCircle,
  Loader2,
  Search,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { format } from 'date-fns';
import AISummarySheet from '@/components/AI/AISummarySheet';

const MyEvents = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // AI Summary Sheet state
  const [summarySheetOpen, setSummarySheetOpen] = useState(false);
  const [selectedEventForSummary, setSelectedEventForSummary] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [summaryError, setSummaryError] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-in-out' });
  }, []);

  // Fetch user's events
  const {
    data: events,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['myEvents'],
    queryFn: async () => {
      const response = await eventService.getMyEvents();
      return response.data;
    },
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: eventService.deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries(['myEvents']);
      toast.success('Event deleted successfully!');
      setShowDeleteModal(false);
      setSelectedEvent(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete event');
    },
  });

  // Handle delete
  const handleDelete = (event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedEvent) {
      deleteEventMutation.mutate(selectedEvent._id);
    }
  };

  // Handle AI Summarize
  const handleSummarize = async (event) => {
    setSelectedEventForSummary(event);
    setSummaryData(null);
    setSummaryError(null);
    setIsLoadingSummary(true);
    setSummarySheetOpen(true);

    try {
      const response = await eventService.summarizeEventWithAI(event._id);
      setSummaryData(response.data);
    } catch (err) {
      setSummaryError(err);
      toast.error('Failed to generate summary');
    } finally {
      setIsLoadingSummary(false);
    }
  };

  // Filter events based on search
  const filteredEvents = events?.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8" data-aos="fade-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                My Events
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and view all your organized events
              </p>
            </div>
            <Link
              to="/dashboard/create-event"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Create New Event
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your events..."
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:border-[#04642a] focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Stats */}
        {!isLoading && events && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" data-aos="fade-up">
            <div className="p-4 bg-gradient-to-r from-[#04642a]/10 to-[#15a33d]/10 dark:from-[#04642a]/20 dark:to-[#15a33d]/20 rounded-xl border border-[#04642a]/20">
              <CalendarDays className="w-6 h-6 text-[#04642a] mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {events.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Events
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20">
              <Users className="w-6 h-6 text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {events.reduce((sum, event) => sum + (event.registeredCount || event.registeredUsers?.length || 0), 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Registrations
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20">
              <Calendar className="w-6 h-6 text-green-600 mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {events.filter((event) => new Date(event.startDate) > new Date()).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Upcoming
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20">
              <Clock className="w-6 h-6 text-purple-600 mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {events.filter((event) => new Date(event.endDate) < new Date()).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Completed
              </div>
            </div>
          </div>
        )}

        {/* Events Grid */}
        {isLoading ? (
          <SkeletonLoader />
        ) : error ? (
          <div className="text-center py-16" data-aos="fade-up">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Failed to load events
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please try again later or refresh the page
            </p>
          </div>
        ) : filteredEvents?.length === 0 ? (
          <div className="text-center py-16" data-aos="fade-up">
            <CalendarDays className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No events found' : 'No events yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Start organizing your first event'}
            </p>
            {!searchQuery && (
              <Link
                to="/dashboard/create-event"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all"
              >
                <Plus className="w-5 h-5" />
                Create Your First Event
              </Link>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents?.map((event, index) => (
              <div
                key={event._id}
                data-aos="fade-up"
                data-aos-delay={index * 50}
                className="group rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
              >
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image || 'https://i.ibb.co.com/rKJX4Dsp/Evening.webp'}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#04642a] text-white">
                      {event.eventType}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500 text-white">
                      {event.status || 'Active'}
                    </span>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                    {event.description}
                  </p>

                  {/* Event Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 text-[#04642a]" />
                      <span>{format(new Date(event.startDate), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <MapPin className="w-4 h-4 text-[#04642a]" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>
                        {event.registeredCount || event.registeredUsers?.length || 0}
                        {event.capacity && ` / ${event.capacity}`}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mb-2">
                    <Link
                      to={`/blog/EventDetail/${event._id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View
                    </Link>
                    <Link
                      to={`/dashboard/edit-event/${event._id}`}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all text-sm"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(event)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* AI Summarize Button */}
                  <button
                    onClick={() => handleSummarize(event)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all text-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    Summarize with AI
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl"
            data-aos="zoom-in"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Delete Event?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete "<strong>{selectedEvent?.title}</strong>"?
              All registrations will also be removed.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedEvent(null);
                }}
                disabled={deleteEventMutation.isPending}
                className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteEventMutation.isPending}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteEventMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Summary Sheet */}
      <AISummarySheet
        isOpen={summarySheetOpen}
        onClose={() => setSummarySheetOpen(false)}
        summary={summaryData}
        isLoading={isLoadingSummary}
        error={summaryError}
        type="event"
        title={selectedEventForSummary?.title}
      />
    </div>
  );
};

export default MyEvents;
