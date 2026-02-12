import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { diagnosisService } from '@/services/diagnosisService';
import {
  Stethoscope,
  Plus,
  Calendar,
  AlertCircle,
  Clock,
  MessageSquare,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { format } from 'date-fns';

const DiagnosisSessionsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-in-out' });
  }, []);

  const {
    data: sessionsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['diagnosisSessions'],
    queryFn: diagnosisService.getAllSessions,
  });

  const sessions = sessionsData?.data || [];

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'mild':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'moderate':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'severe':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case 'critical':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'immediate':
        return 'text-red-600 dark:text-red-400';
      case 'urgent':
        return 'text-orange-600 dark:text-orange-400';
      case 'routine':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center" data-aos="fade-up">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Error Loading Sessions
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error.response?.data?.message || 'Failed to load diagnosis sessions'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#04642a] to-[#15a33d] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto" data-aos="fade-up">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Health Assessments
                  </h1>
                  <p className="text-white/90 mt-1">
                    Your consultation history and health guidance
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/medilink/diagnosis/new')}
              className="flex items-center gap-2 px-6 py-3 bg-white text-[#04642a] rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              New Diagnosis
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#04642a]" />
            <span className="ml-3 text-gray-700 dark:text-gray-300">
              Loading sessions...
            </span>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12" data-aos="fade-up">
            <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Health Assessments Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start your first health consultation to get AI-powered guidance
              and assessment
            </p>
            <button
              onClick={() => navigate('/medilink/diagnosis/new')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#04642a] to-[#15a33d] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Start New Diagnosis
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session, index) => (
              <div
                key={session.sessionId}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden hover:border-[#04642a] dark:hover:border-[#15a33d] transition-all cursor-pointer group"
                onClick={() =>
                  navigate(`/medilink/diagnosis/session/${session.sessionId}`)
                }
              >
                {/* Header with Date */}
                <div className="p-4 bg-gradient-to-r from-[#04642a]/5 to-[#15a33d]/5 dark:from-[#04642a]/10 dark:to-[#15a33d]/10 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(session.startTime), 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      {format(new Date(session.startTime), 'hh:mm a')}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Main Concern Preview */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                      Main Concern
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                      {session.preview.mainConcern || session.preview.symptoms || 'No details recorded'}
                    </p>
                  </div>

                  {/* Assessment */}
                  {(session.preview.primaryCondition || session.preview.diagnosis) && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                        Assessment
                      </h4>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {session.preview.primaryCondition || session.preview.diagnosis}
                      </p>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {session.phase && session.phase !== 'assessed' && session.phase !== 'follow_up' && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                        In Progress
                      </span>
                    )}
                    {session.preview.severity && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(
                          session.preview.severity
                        )}`}
                      >
                        {session.preview.severity}
                      </span>
                    )}
                    {session.preview.urgency && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(
                          session.preview.urgency
                        )}`}
                      >
                        {session.preview.urgency}
                      </span>
                    )}
                    {session.preview.shouldVisitDoctor && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">
                        Doctor Visit Recommended
                      </span>
                    )}
                  </div>

                  {/* Messages Count */}
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {session.messageCount} messages
                    </span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosisSessionsPage;
