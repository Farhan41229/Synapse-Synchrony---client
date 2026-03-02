import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/store/authStore';
import { reportService } from '@/services/reportService';
import { medicineScheduleService } from '@/services/medicineScheduleService';
import { medilinkService } from '@/services/medilinkService';
import {
  FileText,
  Pill,
  ArrowRight,
  TrendingUp,
  Brain,
  Heart,
  Activity,
  Upload,
  MessageCircle,
  Stethoscope,
} from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Fetch all data in parallel
  const { data: reportsData, isLoading: reportsLoading } = useQuery({
    queryKey: ['my-reports-summary'],
    queryFn: () => reportService.getMyReports(),
    select: (data) => ({
      total: data.data?.length || 0,
      recent: data.data?.slice(0, 5) || [],
    }),
  });

  const { data: medicineData, isLoading: medicineLoading } = useQuery({
    queryKey: ['my-medicine-summary'],
    queryFn: () => medicineScheduleService.getMySchedules(),
    select: (data) => ({ total: data.data?.length || 0 }),
    retry: false,
  });

  const { data: wellnessData } = useQuery({
    queryKey: ['wellness-summary-dashboard'],
    queryFn: () => medilinkService.getWellnessSummary(7),
    retry: false,
  });

  const isValidDate = (date) => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d);
  };

  const formatSafeDate = (date, formatStr) => {
    if (!date || !isValidDate(date)) return 'Invalid date';
    return format(new Date(date), formatStr);
  };

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          <StatCard
            icon={FileText}
            title="My Reports"
            count={reportsData?.total ?? 0}
            iconBg="bg-violet-500"
            action={() => navigate('/dashboard/reports')}
            loading={reportsLoading}
          />
          <StatCard
            icon={Pill}
            title="Prescriptions"
            count={medicineData?.total ?? 0}
            iconBg="bg-blue-600"
            action={() => navigate('/dashboard/medicine')}
            loading={medicineLoading}
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* Recent Reports Widget */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800/95 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
                <span className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/40">
                  <FileText className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </span>
                Recent Reports
              </h2>
              <button
                type="button"
                onClick={() => navigate('/dashboard/reports')}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                View all <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {reportsLoading ? (
              <div className="space-y-2.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-100 dark:bg-gray-700/50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : reportsData?.recent.length > 0 ? (
              <div className="space-y-2.5">
                {reportsData.recent.map((report) => (
                  <button
                    type="button"
                    key={report._id}
                    onClick={() => navigate(`/dashboard/reports/${report._id}`)}
                    className="w-full text-left p-4 rounded-xl border border-gray-200/80 dark:border-gray-700/80 hover:border-violet-200 dark:hover:border-violet-700/50 hover:bg-violet-50/50 dark:hover:bg-violet-900/10 transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors truncate">
                          {report.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                          {formatSafeDate(report.createdAt, 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 px-2.5 py-1 text-xs font-medium rounded-full ${
                          report.fileType === 'pdf'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}
                      >
                        {report.fileType?.toUpperCase() || 'FILE'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-7 h-7 text-violet-500 dark:text-violet-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">No reports yet</p>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/reports/extract')}
                  className="px-5 py-2.5 bg-[#04642a] hover:bg-[#035a24] text-white rounded-xl font-medium transition-colors shadow-sm"
                >
                  Extract your first report
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
                label="Extract Report"
                onClick={() => navigate('/dashboard/reports/extract')}
                color="bg-violet-500 hover:bg-violet-600"
              />
              <QuickActionBtn
                icon={Pill}
                label="Extract Prescription"
                onClick={() => navigate('/dashboard/medicine/extract')}
                color="bg-blue-600 hover:bg-blue-700"
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
    </div>
  );
};

export default Dashboard;
