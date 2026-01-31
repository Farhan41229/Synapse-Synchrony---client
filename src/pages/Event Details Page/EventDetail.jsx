import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import eventService from '@/services/eventService';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  ArrowLeft,
  Share2,
  Bookmark,
  CheckCircle,
  XCircle,
  Tag,
  Building,
  Mail,
  AlertCircle,
  UserPlus,
  UserMinus,
  Sparkles,
  Volume2,
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { format, isPast, isFuture } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';
import AISummarySheet from '@/components/AI/AISummarySheet';
import TextToSpeechPlayer from '@/components/Audio/TextToSpeechPlayer';
import toast from 'react-hot-toast';

const EventDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [registrationStatus, setRegistrationStatus] = useState(null);
  
  // AI Summary Sheet state
  const [summarySheetOpen, setSummarySheetOpen] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [summaryError, setSummaryError] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  
  // TTS Player state
  const [showTTSPlayer, setShowTTSPlayer] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-in-out' });
  }, []);

  // Fetch event details
  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const response = await eventService.getEventById(id);
      return response.data;
    },
    enabled: !!id,
  });

  // Handle AI Summarize
  const handleSummarize = async () => {
    setSummaryData(null);
    setSummaryError(null);
    setIsLoadingSummary(true);
    setSummarySheetOpen(true);

    try {
      const response = await eventService.summarizeEventWithAI(id);
      setSummaryData(response.data);
    } catch (err) {
      setSummaryError(err);
      toast.error('Failed to generate summary');
    } finally {
      setIsLoadingSummary(false);
    }
  };

  // Register for event mutation
  const registerMutation = useMutation({
    mutationFn: () => eventService.registerForEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['event', id]);
      setRegistrationStatus('success');
      setTimeout(() => setRegistrationStatus(null), 3000);
    },
    onError: (error) => {
      setRegistrationStatus('error');
      setTimeout(() => setRegistrationStatus(null), 3000);
    },
  });

  // Unregister from event mutation
  const unregisterMutation = useMutation({
    mutationFn: () => eventService.unregisterFromEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['event', id]);
      setRegistrationStatus('unregistered');
      setTimeout(() => setRegistrationStatus(null), 3000);
    },
    onError: (error) => {
      setRegistrationStatus('error');
      setTimeout(() => setRegistrationStatus(null), 3000);
    },
  });

  // Check if current user is registered (you'll need to get current user from auth context)
  const isUserRegistered = () => {
    // TODO: Replace with actual user ID from auth context
    // For now, just checking if registeredUsers array exists
    return false; // event?.registeredUsers?.some(user => user._id === currentUser._id);
  };

  const handleRegistration = () => {
    if (isUserRegistered()) {
      unregisterMutation.mutate();
    } else {
      registerMutation.mutate();
    }
  };

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button Skeleton */}
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg mb-8 animate-pulse" />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Skeleton */}
            <div className="space-y-4">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>

            {/* Image Skeleton */}
            <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />

            {/* Content Skeleton */}
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center" data-aos="fade-up">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Event Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portal
          </Link>
        </div>
      </div>
    );
  }

  // Loading State
  if (isLoading) {
    return <SkeletonLoader />;
  }

  const isEventPast = isPast(new Date(event.endDate));
  const isEventFull = event.capacity && event.isFull;
  const registeredCount = event.registeredCount || event.registeredUsers?.length || 0;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#04642a] dark:hover:text-[#15a33d] transition-colors mb-8 group"
          data-aos="fade-right"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Portal</span>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2" data-aos="fade-up">
            {/* Event Header */}
            <div className="mb-6">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-block px-4 py-1.5 text-sm font-semibold rounded-full bg-[#04642a]/10 dark:bg-[#04642a]/20 text-[#04642a] dark:text-[#15a33d] border border-[#04642a]/20">
                  {event.eventType}
                </span>
                <span
                  className={`inline-block px-4 py-1.5 text-sm font-semibold rounded-full ${
                    event.status === 'upcoming'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : event.status === 'ongoing'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : event.status === 'completed'
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  }`}
                >
                  {event.status}
                </span>
                {isEventFull && (
                  <span className="inline-block px-4 py-1.5 text-sm font-semibold rounded-full bg-red-500 text-white">
                    Full
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {event.title}
              </h1>

              {/* Quick Info */}
              <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#04642a]" />
                  <span className="font-medium">
                    {format(new Date(event.startDate), 'MMMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#04642a]" />
                  <span className="font-medium">
                    {format(new Date(event.startDate), 'hh:mm a')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#04642a]" />
                  <span className="font-medium">
                    {registeredCount}
                    {event.capacity && ` / ${event.capacity}`} registered
                  </span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {event.image && (
              <div
                className="mb-8 rounded-xl overflow-hidden"
                data-aos="zoom-in"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-auto max-h-[500px] object-cover"
                />
              </div>
            )}

            {/* Registration Status Message */}
            {registrationStatus && (
              <div
                className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                  registrationStatus === 'success'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                    : registrationStatus === 'unregistered'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                }`}
                data-aos="fade-down"
              >
                {registrationStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">
                      Successfully registered for this event!
                    </span>
                  </>
                ) : registrationStatus === 'unregistered' ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">
                      Successfully unregistered from this event.
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    <span className="font-medium">
                      Failed to process registration. Please try again.
                    </span>
                  </>
                )}
              </div>
            )}

            {/* AI Summarize Button & Listen Button */}
            <div className="mb-6 flex flex-col gap-3" data-aos="fade-up">
              <button
                onClick={handleSummarize}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
              >
                <Sparkles className="w-5 h-5" />
                Summarize with AI
              </button>
              
              <button
                onClick={() => setShowTTSPlayer(!showTTSPlayer)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#04642a] to-[#15a33d] text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                <Volume2 className="w-5 h-5" />
                {showTTSPlayer ? 'Hide Player' : 'Listen to Event'}
              </button>
            </div>
            
            {/* TTS Player */}
            {showTTSPlayer && (
              <div className="mb-8" data-aos="fade-down">
                <TextToSpeechPlayer 
                  content={event.description}
                  title={event.title}
                />
              </div>
            )}

            {/* Event Description with Markdown Rendering */}
            <div className="mb-8" data-aos="fade-up">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                About This Event
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="text-4xl font-bold mb-4 mt-8 text-gray-900 dark:text-white" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-3xl font-bold mb-3 mt-6 text-gray-900 dark:text-white" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-2xl font-semibold mb-2 mt-4 text-gray-900 dark:text-white" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed" {...props} />
                    ),
                    code: ({ node, inline, className, children, ...props }) => {
                      if (inline) {
                        return (
                          <code
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 rounded text-sm font-mono"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      }
                      return (
                        <code
                          className={`${className} block p-4 bg-gray-900 dark:bg-gray-950 rounded-lg text-sm overflow-x-auto`}
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props} />
                    ),
                    a: ({ node, ...props }) => (
                      <a
                        className="text-[#04642a] dark:text-[#15a33d] hover:underline font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-4 border-[#04642a] dark:border-[#15a33d] pl-4 py-2 my-4 italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-r"
                        {...props}
                      />
                    ),
                  }}
                >
                  {event.description}
                </ReactMarkdown>
              </div>
            </div>

            {/* Event Details Grid */}
            <div className="mb-8" data-aos="fade-up">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Event Details
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#04642a] mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Start Date & Time
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {format(
                          new Date(event.startDate),
                          'EEEE, MMMM dd, yyyy'
                        )}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {format(new Date(event.startDate), 'hh:mm a')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#04642a] mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        End Date & Time
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {format(new Date(event.endDate), 'EEEE, MMMM dd, yyyy')}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {format(new Date(event.endDate), 'hh:mm a')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#04642a] mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Location
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {event.location}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-[#04642a] mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        Capacity
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {event.capacity
                          ? `${registeredCount} / ${event.capacity} registered`
                          : `${registeredCount} registered (Unlimited)`}
                      </p>
                      {event.capacity && (
                        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-[#04642a] h-2 rounded-full transition-all"
                            style={{
                              width: `${(registeredCount / event.capacity) * 100}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="mb-8" data-aos="fade-up">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tags:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Organizer Info */}
            <div
              className="p-6 bg-gradient-to-r from-[#04642a]/5 to-[#15a33d]/5 dark:from-[#04642a]/10 dark:to-[#15a33d]/10 rounded-xl border border-[#04642a]/20"
              data-aos="fade-up"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Organized By
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-[#04642a]" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {event.organizer.name}
                  </span>
                </div>
                {event.organizer.contact && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#04642a]" />
                    <a
                      href={`mailto:${event.organizer.contact}`}
                      className="text-[#04642a] dark:text-[#15a33d] hover:underline"
                    >
                      {event.organizer.contact}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1" data-aos="fade-up" data-aos-delay="200">
            {/* Registration Card */}
            <div className="sticky top-24 space-y-4">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Registration
                </h3>

                {/* Status Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Status:
                    </span>
                    <span
                      className={`font-semibold ${
                        isEventPast
                          ? 'text-gray-500'
                          : isEventFull
                          ? 'text-red-500'
                          : 'text-green-500'
                      }`}
                    >
                      {isEventPast
                        ? 'Event Ended'
                        : isEventFull
                        ? 'Full'
                        : 'Open'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Registered:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {registeredCount}
                      {event.capacity && ` / ${event.capacity}`}
                    </span>
                  </div>
                  {event.capacity && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Spots Left:
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {event.capacity - registeredCount}
                      </span>
                    </div>
                  )}
                </div>

                {/* Registration Button */}
                <button
                  onClick={handleRegistration}
                  disabled={
                    isEventPast ||
                    (isEventFull && !isUserRegistered()) ||
                    registerMutation.isPending ||
                    unregisterMutation.isPending
                  }
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                    isEventPast || (isEventFull && !isUserRegistered())
                      ? 'bg-gray-400 cursor-not-allowed'
                      : isUserRegistered()
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-[#04642a] hover:bg-[#15a33d]'
                  }`}
                >
                  {registerMutation.isPending || unregisterMutation.isPending ? (
                    'Processing...'
                  ) : isEventPast ? (
                    <>
                      <XCircle className="w-5 h-5" />
                      Event Ended
                    </>
                  ) : isUserRegistered() ? (
                    <>
                      <UserMinus className="w-5 h-5" />
                      Unregister
                    </>
                  ) : isEventFull ? (
                    <>
                      <XCircle className="w-5 h-5" />
                      Event Full
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Register Now
                    </>
                  )}
                </button>

                {isUserRegistered() && (
                  <p className="mt-3 text-sm text-center text-green-600 dark:text-green-400 flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    You're registered for this event
                  </p>
                )}
              </div>

              {/* Share Card */}
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Share Event
                </h3>
                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-all">
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Share</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-all">
                    <Bookmark className="w-4 h-4" />
                    <span className="text-sm font-medium">Save</span>
                  </button>
                </div>
              </div>

              {/* Created By */}
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Created By
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#04642a] to-[#15a33d] flex items-center justify-center text-white font-semibold text-lg">
                    {event.createdBy?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {event.createdBy?.name || 'Unknown User'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(event.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary Sheet */}
      <AISummarySheet
        isOpen={summarySheetOpen}
        onClose={() => setSummarySheetOpen(false)}
        summary={summaryData}
        isLoading={isLoadingSummary}
        error={summaryError}
        type="event"
        title={event?.title}
      />
    </div>
  );
};

export default EventDetail;
