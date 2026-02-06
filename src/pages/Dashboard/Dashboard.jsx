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
  const StatCard = ({ icon: Icon, title, count, iconBg, action, loading }) => (
    <button
      type="button"
      onClick={action}
      className="w-full text-left bg-white dark:bg-gray-800 rounded-xl border border-gray-200/80 dark:border-gray-700/80 p-6 hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#04642a]/30 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
    >
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${iconBg} shrink-0`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#04642a] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
      </div>
      {loading ? (
        <div className="mt-5 space-y-2">
          <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
        </div>
      ) : (
        <div className="mt-5">
          <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{count}</div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">{title}</div>
        </div>
      )}
    </button>
  );

  // Quick Action Button Component
  const QuickActionBtn = ({ icon: Icon, label, onClick, color }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full ${color} hover:opacity-95 text-white py-3.5 px-4 rounded-xl flex items-center gap-3 transition-all duration-200 hover:shadow-lg active:scale-[0.98] font-medium text-sm`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100/80 dark:bg-gray-950 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Welcome Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#04642a] via-[#057a32] to-[#04642a] text-white rounded-2xl px-6 py-8 sm:px-8 sm:py-10 shadow-xl">
          <div className="relative z-10">
            <p className="text-white/90 text-sm font-medium uppercase tracking-wider mb-1">
              {format(new Date(), 'EEEE, MMMM do')}
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}
            </h1>
            <p className="mt-2 text-white/80 text-base sm:text-lg">
              Here&apos;s what&apos;s happening today.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" aria-hidden />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" aria-hidden />
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          <StatCard
            icon={FileText}
            title="My Blogs"
            count={blogsData?.total ?? 0}
            iconBg="bg-blue-500"
            action={() => navigate('/dashboard/my-blogs')}
            loading={blogsLoading}
          />
          <StatCard
            icon={StickyNote}
            title="My Notes"
            count={notesData?.total ?? 0}
            iconBg="bg-violet-500"
            action={() => navigate('/dashboard/notes')}
            loading={notesLoading}
          />
          <StatCard
            icon={CalendarDays}
            title="My Events"
            count={eventsData?.total ?? 0}
            iconBg="bg-amber-500"
            action={() => navigate('/dashboard/my-events')}
            loading={eventsLoading}
          />
          <StatCard
            icon={Calendar}
            title="Schedule"
            count={scheduleData?.data ? 'Active' : 'Not set'}
            iconBg="bg-emerald-600"
            action={() => navigate(scheduleData?.data ? '/dashboard/schedule' : '/dashboard/schedule/upload')}
            loading={scheduleLoading}
          />
        </div>

        {/* Today's Schedule Widget */}
        {scheduleData?.data && todaysClasses.length > 0 && (
          <div className="bg-white dark:bg-gray-800/95 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                  <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </span>
                Today&apos;s Schedule
              </h2>
              <button
                type="button"
                onClick={() => navigate('/dashboard/schedule')}
                className="text-sm font-medium text-[#04642a] hover:text-[#035a24] dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center gap-1 transition-colors"
              >
                View full <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2.5">
              {todaysClasses.map((slot, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border-l-4 transition-colors ${
                    slot === nextClass
                      ? 'border-l-[#04642a] bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/50'
                      : 'border-l-gray-200 dark:border-l-gray-600 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                        <Clock className="w-4 h-4 text-gray-500 shrink-0" />
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">
                          {slot.timeRange}
                        </span>
                        {slot === nextClass && (
                          <span className="px-2.5 py-0.5 bg-[#04642a] text-white text-xs font-medium rounded-full">
                            Next
                          </span>
                        )}
                      </div>
                      <p className="text-base font-bold text-gray-900 dark:text-white ml-6">
                        {slot.course}
                      </p>
                      <div className="ml-6 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {slot.room && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {slot.room}
                          </span>
                        )}
                        {slot.teacher && (
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {slot.teacher}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* Recent Notes Widget */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800/95 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/40">
                  <StickyNote className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </span>
                Recent Notes
              </h2>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/notes/create')}
                  className="text-sm font-medium text-[#04642a] hover:text-[#035a24] dark:text-emerald-500 flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                >
                  <Plus className="w-4 h-4" /> New
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/notes')}
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  View all <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            {notesLoading ? (
              <div className="space-y-2.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-100 dark:bg-gray-700/50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : notesData?.recent.length > 0 ? (
              <div className="space-y-2.5">
                {notesData.recent.map((note) => (
                  <button
                    type="button"
                    key={note._id}
                    onClick={() => navigate(`/dashboard/notes/${note._id}`)}
                    className="w-full text-left p-4 rounded-xl border border-gray-200/80 dark:border-gray-700/80 hover:border-violet-200 dark:hover:border-violet-700/50 hover:bg-violet-50/50 dark:hover:bg-violet-900/10 transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors truncate">
                          {note.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                          {formatSafeDate(note.createdAt, 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 px-2.5 py-1 text-xs font-medium rounded-full ${
                          note.visibility === 'public'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        }`}
                      >
                        {note.visibility}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-4">
                  <StickyNote className="w-7 h-7 text-violet-500 dark:text-violet-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">No notes yet</p>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/notes/create')}
                  className="px-5 py-2.5 bg-[#04642a] hover:bg-[#035a24] text-white rounded-xl font-medium transition-colors shadow-sm"
                >
                  Create your first note
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white dark:bg-gray-800/95 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-[#04642a]/10 dark:bg-emerald-900/40">
                <TrendingUp className="w-5 h-5 text-[#04642a] dark:text-emerald-400" />
              </span>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              <QuickActionBtn
                icon={FileText}
                label="Create Blog"
                onClick={() => navigate('/blog/blogs/create')}
                color="bg-blue-500 hover:bg-blue-600"
              />
              <QuickActionBtn
                icon={StickyNote}
                label="Create Note"
                onClick={() => navigate('/dashboard/notes/create')}
                color="bg-violet-500 hover:bg-violet-600"
              />
              <QuickActionBtn
                icon={CalendarPlus}
                label="Add Event"
                onClick={() => navigate('/dashboard/create-event')}
                color="bg-amber-500 hover:bg-amber-600"
              />
              <QuickActionBtn
                icon={Upload}
                label="Upload Schedule"
                onClick={() => navigate('/dashboard/schedule/upload')}
                color="bg-emerald-600 hover:bg-emerald-700"
              />
              <QuickActionBtn
                icon={MessageCircle}
                label="Wellness Chat"
                onClick={() => navigate('/medilink/sessions')}
                color="bg-teal-500 hover:bg-teal-600"
              />
              <QuickActionBtn
                icon={Stethoscope}
                label="Medical Diagnosis"
                onClick={() => navigate('/medilink/diagnosis')}
                color="bg-rose-500 hover:bg-rose-600"
              />
            </div>
          </div>
        </div>

        {/* Two Column Layout - Blogs & Wellness */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {/* Recent Blogs Widget */}
          <div className="bg-white dark:bg-gray-800/95 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </span>
                Recent Blogs
              </h2>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => navigate('/blog/blogs/create')}
                  className="text-sm font-medium text-[#04642a] hover:text-[#035a24] dark:text-emerald-500 flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                >
                  <Plus className="w-4 h-4" /> New
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/my-blogs')}
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  View all <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            {blogsLoading ? (
              <div className="space-y-2.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700/50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : blogsData?.recent.length > 0 ? (
              <div className="space-y-2.5">
                {blogsData.recent.map((blog) => (
                  <button
                    type="button"
                    key={blog._id}
                    onClick={() => navigate(`/blog/BlogDetail/${blog._id}`)}
                    className="w-full text-left p-4 rounded-xl border border-gray-200/80 dark:border-gray-700/80 hover:border-blue-200 dark:hover:border-blue-700/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-200 group"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {formatSafeDate(blog.createdAt, 'MMM dd, yyyy')}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-7 h-7 text-blue-500 dark:text-blue-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">No blogs yet</p>
                <button
                  type="button"
                  onClick={() => navigate('/blog/blogs/create')}
                  className="px-5 py-2.5 bg-[#04642a] hover:bg-[#035a24] text-white rounded-xl font-medium transition-colors shadow-sm"
                >
                  Write your first blog
                </button>
              </div>
            )}
          </div>

          {/* Wellness Overview Widget */}
          <div className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50/50 to-teal-100 dark:from-teal-950/50 dark:via-gray-900 dark:to-teal-950/50 rounded-2xl border border-teal-200/80 dark:border-teal-800/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5 relative z-10">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-teal-200/80 dark:bg-teal-800/50">
                  <Brain className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </span>
                Wellness Overview
              </h2>
              <button
                type="button"
                onClick={() => navigate('/dashboard/wellness')}
                className="text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 flex items-center gap-1 transition-colors"
              >
                Details <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {wellnessData?.data ? (
              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-xl border border-teal-100 dark:border-teal-800/50">
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-rose-500" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Mood Score</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
                    {wellnessData.data.summary?.averageMood?.toFixed(1) || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-xl border border-teal-100 dark:border-teal-800/50">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-amber-500" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Stress Level</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
                    {wellnessData.data.summary?.averageStress?.toFixed(1) || 'N/A'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/medilink/sessions')}
                  className="w-full px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-5 h-5" />
                  Start Wellness Session
                </button>
              </div>
            ) : (
              <div className="text-center py-8 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-teal-200/80 dark:bg-teal-800/50 flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">Start tracking your wellness</p>
                <button
                  type="button"
                  onClick={() => navigate('/medilink/sessions')}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-colors shadow-sm"
                >
                  Begin journey
                </button>
              </div>
            )}
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-200/30 dark:bg-teal-500/10 rounded-full -translate-y-1/2 translate-x-1/2" aria-hidden />
          </div>
        </div>

        {/* Upcoming Events Widget */}
        {eventsData && eventsData.upcoming.length > 0 && (
          <div className="bg-white dark:bg-gray-800/95 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40">
                  <CalendarDays className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </span>
                Upcoming Events
              </h2>
              <button
                type="button"
                onClick={() => navigate('/dashboard/my-events')}
                className="text-sm font-medium text-[#04642a] hover:text-[#035a24] dark:text-emerald-400 flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {eventsData.upcoming.map((event) => (
                <button
                  type="button"
                  key={event._id}
                  onClick={() => navigate(`/blog/EventDetail/${event._id}`)}
                  className="text-left p-4 rounded-xl border border-gray-200/80 dark:border-gray-700/80 hover:border-amber-200 dark:hover:border-amber-700/50 hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-all duration-200 group"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-2 mb-1.5">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatSafeDate(event.eventDate, 'MMM dd, yyyy')}
                  </p>
                  {event.eventType && (
                    <span className="inline-block mt-2 px-2.5 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-medium rounded-full">
                      {event.eventType}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
