import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/store/authStore';
import blogService from '@/services/blogService';
import noteService from '@/services/noteService';
import scheduleService from '@/services/scheduleService';
import eventService from '@/services/eventService';
import { medilinkService } from '@/services/medilinkService';
import {
  FileText,
  StickyNote,
  CalendarDays,
  Calendar,
  Plus,
  ArrowRight,
  Loader2,
  Clock,
  MapPin,
  User,
  TrendingUp,
  Brain,
  Heart,
  Activity,
  Upload,
  MessageCircle,
  Stethoscope,
  CalendarPlus,
} from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Fetch all data in parallel
  const { data: blogsData, isLoading: blogsLoading } = useQuery({
    queryKey: ['my-blogs-summary'],
    queryFn: blogService.getMyBlogs,
    select: (data) => ({
      total: data.data?.length || 0,
      recent: data.data?.slice(0, 5) || [],
    }),
  });

  const { data: notesData, isLoading: notesLoading } = useQuery({
    queryKey: ['my-notes-summary'],
    queryFn: noteService.getMyNotes,
    select: (data) => ({
      total: data.data?.length || 0,
      recent: data.data?.slice(0, 5) || [],
    }),
  });

  const { data: scheduleData, isLoading: scheduleLoading } = useQuery({
    queryKey: ['my-schedule-summary'],
    queryFn: scheduleService.getMySchedule,
    retry: false,
  });

  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['my-events-summary'],
    queryFn: eventService.getMyEvents,
    select: (data) => ({
      total: data.data?.length || 0,
      upcoming: data.data?.slice(0, 5) || [],
    }),
  });

  const { data: wellnessData } = useQuery({
    queryKey: ['wellness-summary-dashboard'],
    queryFn: () => medilinkService.getWellnessSummary(7),
    retry: false,
  });

  // Helper functions
  const getTodaysClasses = () => {
    if (!scheduleData?.data?.weeklySchedule) return [];
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const daySchedule = scheduleData.data.weeklySchedule.find((d) => d.day === today);
    return daySchedule?.slots || [];
  };

  const getNextClass = (slots) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    return slots.find((slot) => {
      if (!slot.timeRange) return false;
      const startTime = timeToMinutes(slot.timeRange.split(' - ')[0]);
      return startTime > currentTime;
    });
  };

  const timeToMinutes = (time) => {
    const [hours, mins] = time.split(':').map(Number);
    return hours * 60 + mins;
  };

  const isValidDate = (date) => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d);
  };

  const formatSafeDate = (date, formatStr) => {
    if (!date || !isValidDate(date)) return 'Invalid date';
    return format(new Date(date), formatStr);
  };

  const todaysClasses = getTodaysClasses();
  const nextClass = getNextClass(todaysClasses);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Stat Card Component
  const StatCard = ({ icon: Icon, title, count, label, color, action, loading }) => (
    <div
      onClick={action}
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all cursor-pointer group ${color}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-opacity-10`}>
          <Icon className="w-6 h-6" />
        </div>
        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
        </div>
      ) : (
        <>
          <div className="text-3xl font-bold mb-1">{count}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{title}</div>
        </>
      )}
    </div>
  );

  // Quick Action Button Component
  const QuickActionBtn = ({ icon: Icon, label, onClick, color = 'bg-[#04642a]' }) => (
    <button
      onClick={onClick}
      className={`${color} hover:opacity-90 text-white p-4 rounded-lg flex items-center gap-3 transition-all hover:scale-105 shadow-sm`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-[#04642a] to-[#058a38] text-white rounded-lg p-8 shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-lg opacity-90">
            {format(new Date(), 'EEEE, MMMM do, yyyy')}
          </p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={FileText}
            title="My Blogs"
            count={blogsData?.total || 0}
            color="text-blue-600"
            action={() => navigate('/dashboard/my-blogs')}
            loading={blogsLoading}
          />
          <StatCard
            icon={StickyNote}
            title="My Notes"
            count={notesData?.total || 0}
            color="text-purple-600"
            action={() => navigate('/dashboard/notes')}
            loading={notesLoading}
          />
          <StatCard
            icon={CalendarDays}
            title="My Events"
            count={eventsData?.total || 0}
            color="text-orange-600"
            action={() => navigate('/dashboard/my-events')}
            loading={eventsLoading}
          />
          <StatCard
            icon={Calendar}
            title="Schedule"
            count={scheduleData?.data ? 'Active' : 'Not Set'}
            color="text-green-600"
            action={() => navigate(scheduleData?.data ? '/dashboard/schedule' : '/dashboard/schedule/upload')}
            loading={scheduleLoading}
          />
        </div>

        {/* Today's Schedule Widget */}
        {scheduleData?.data && todaysClasses.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-6 h-6 text-[#04642a]" />
                Today's Schedule
              </h2>
              <button
                onClick={() => navigate('/dashboard/schedule')}
                className="text-[#04642a] hover:text-[#035a24] font-medium flex items-center gap-1"
              >
                View Full <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {todaysClasses.map((slot, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    slot === nextClass
                      ? 'border-[#04642a] bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {slot.timeRange}
                        </span>
                        {slot === nextClass && (
                          <span className="px-2 py-1 bg-[#04642a] text-white text-xs rounded-full">
                            Next Class
                          </span>
                        )}
                      </div>
                      <div className="ml-7 space-y-1">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {slot.course}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          {slot.room && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {slot.room}
                            </span>
                          )}
                          {slot.teacher && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {slot.teacher}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Notes Widget */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-purple-600" />
                Recent Notes
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/dashboard/notes/create')}
                  className="text-[#04642a] hover:text-[#035a24] font-medium flex items-center gap-1 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  New
                </button>
                <button
                  onClick={() => navigate('/dashboard/notes')}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium flex items-center gap-1 text-sm"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            {notesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                ))}
              </div>
            ) : notesData?.recent.length > 0 ? (
              <div className="space-y-3">
                {notesData.recent.map((note) => (
                  <div
                    key={note._id}
                    onClick={() => navigate(`/dashboard/notes/${note._id}`)}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#04642a] transition-colors">
                          {note.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {formatSafeDate(note.createdAt, 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          note.visibility === 'public'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                        }`}
                      >
                        {note.visibility}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <StickyNote className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">No notes yet</p>
                <button
                  onClick={() => navigate('/dashboard/notes/create')}
                  className="px-4 py-2 bg-[#04642a] text-white rounded-lg hover:bg-[#035a24] transition-colors"
                >
                  Create Your First Note
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#04642a]" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              <QuickActionBtn
                icon={FileText}
                label="Create Blog"
                onClick={() => navigate('/blog/blogs/create')}
                color="bg-blue-600"
              />
              <QuickActionBtn
                icon={StickyNote}
                label="Create Note"
                onClick={() => navigate('/dashboard/notes/create')}
                color="bg-purple-600"
              />
              <QuickActionBtn
                icon={CalendarPlus}
                label="Add Event"
                onClick={() => navigate('/dashboard/create-event')}
                color="bg-orange-600"
              />
              <QuickActionBtn
                icon={Upload}
                label="Upload Schedule"
                onClick={() => navigate('/dashboard/schedule/upload')}
                color="bg-green-600"
              />
              <QuickActionBtn
                icon={MessageCircle}
                label="Wellness Chat"
                onClick={() => navigate('/medilink/sessions')}
                color="bg-teal-600"
              />
              <QuickActionBtn
                icon={Stethoscope}
                label="Medical Diagnosis"
                onClick={() => navigate('/medilink/diagnosis')}
                color="bg-red-600"
              />
            </div>
          </div>
        </div>

        {/* Two Column Layout - Blogs & Wellness */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Blogs Widget */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Recent Blogs
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/blog/blogs/create')}
                  className="text-[#04642a] hover:text-[#035a24] font-medium flex items-center gap-1 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  New
                </button>
                <button
                  onClick={() => navigate('/dashboard/my-blogs')}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium flex items-center gap-1 text-sm"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            {blogsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                ))}
              </div>
            ) : blogsData?.recent.length > 0 ? (
              <div className="space-y-3">
                {blogsData.recent.map((blog) => (
                  <div
                    key={blog._id}
                    onClick={() => navigate(`/blog/BlogDetail/${blog._id}`)}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all cursor-pointer group"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#04642a] transition-colors line-clamp-1">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {formatSafeDate(blog.createdAt, 'MMM dd, yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">No blogs yet</p>
                <button
                  onClick={() => navigate('/blog/blogs/create')}
                  className="px-4 py-2 bg-[#04642a] text-white rounded-lg hover:bg-[#035a24] transition-colors"
                >
                  Write Your First Blog
                </button>
              </div>
            )}
          </div>

          {/* Wellness Overview Widget */}
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-lg border border-teal-200 dark:border-teal-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-teal-600" />
                Wellness Overview
              </h2>
              <button
                onClick={() => navigate('/dashboard/wellness')}
                className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 text-sm"
              >
                Details <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {wellnessData?.data ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-pink-500" />
                    <span className="text-gray-700 dark:text-gray-300">Mood Score</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {wellnessData.data.summary?.averageMood?.toFixed(1) || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-orange-500" />
                    <span className="text-gray-700 dark:text-gray-300">Stress Level</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {wellnessData.data.summary?.averageStress?.toFixed(1) || 'N/A'}
                  </span>
                </div>
                <button
                  onClick={() => navigate('/medilink/sessions')}
                  className="w-full px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Start Wellness Session
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain className="w-16 h-16 text-teal-300 dark:text-teal-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Start tracking your wellness
                </p>
                <button
                  onClick={() => navigate('/medilink/sessions')}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Begin Journey
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Events Widget */}
        {eventsData && eventsData.upcoming.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-orange-600" />
                Upcoming Events
              </h2>
              <button
                onClick={() => navigate('/dashboard/my-events')}
                className="text-[#04642a] hover:text-[#035a24] font-medium flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {eventsData.upcoming.map((event) => (
                <div
                  key={event._id}
                  onClick={() => navigate(`/blog/EventDetail/${event._id}`)}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all cursor-pointer group"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#04642a] transition-colors line-clamp-2 mb-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatSafeDate(event.eventDate, 'MMM dd, yyyy')}
                  </p>
                  {event.eventType && (
                    <span className="inline-block mt-2 px-2 py-1 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 text-xs rounded-full">
                      {event.eventType}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
