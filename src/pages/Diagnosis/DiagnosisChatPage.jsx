import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { diagnosisService } from '@/services/diagnosisService';
import { useLocation } from '@/hooks/use-location';
import NearbyFacilities from './NearbyFacilities';
import {
  Stethoscope,
  Send,
  Loader2,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Plus,
  Activity,
  Shield,
  AlertCircle,
  MapPin,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

// Helper to check if a message has valid assessment data
const hasValidAssessment = (message) => {
  const assessment = message.assessment || message.diagnosis;
  if (!assessment) return false;

  // Check for new format (assessment)
  if (message.assessment) {
    return Boolean(
      assessment.possibleConditions?.length > 0 ||
      assessment.reliefSuggestions?.length > 0 ||
      assessment.urgency
    );
  }

  // Check for old format (diagnosis) - backward compatibility
  if (message.diagnosis) {
    return Boolean(
      assessment.primaryDiagnosis ||
      assessment.possibleDiseases?.length > 0
    );
  }

  return false;
};

const DiagnosisChatPage = () => {
  const { sessionId: urlSessionId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [sessionId, setSessionId] = useState(urlSessionId);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionPhase, setSessionPhase] = useState('intake');
  const [showFacilities, setShowFacilities] = useState(false);
  const [facilities, setFacilities] = useState([]);
  const [isFetchingFacilities, setIsFetchingFacilities] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [searchRadius, setSearchRadius] = useState(5000);

  const { getLocationWithAddress } = useLocation();

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-in-out' });
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      try {
        if (!sessionId || sessionId === 'new') {
          const response = await diagnosisService.createSession();
          setSessionId(response.sessionId);
          setMessages([response.greeting]);
          navigate(`/medilink/diagnosis/session/${response.sessionId}`, {
            replace: true,
          });
        } else {
          const response =
            await diagnosisService.getSessionHistory(sessionId);
          if (response.success && response.data.messages) {
            setMessages(response.data.messages);
            setSessionPhase(response.data.sessionInfo.phase || 'assessed');
          }
        }
      } catch (error) {
        console.error('Failed to initialize session:', error);
        toast.error('Failed to load session');
      }
    };

    initSession();
  }, [sessionId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMsg = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Optimistically add user message to UI
    const userMessage = {
      role: 'user',
      content: userMsg,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await diagnosisService.sendMessage(sessionId, userMsg);

      if (response.success) {
        const aiMessage = {
          role: 'assistant',
          content: response.data.message,
          timestamp: new Date(),
          assessment: response.data.assessment || undefined,
        };

        setMessages((prev) => [...prev, aiMessage]);
        setSessionPhase(response.data.sessionPhase || 'questioning');
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      // Remove optimistic user message on failure
      setMessages((prev) => prev.slice(0, -1));
      setInputMessage(userMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSession = async () => {
    try {
      const response = await diagnosisService.createSession();
      const newSessionId = response.sessionId;
      setSessionId(newSessionId);
      setMessages([response.greeting]);
      setSessionPhase('intake');
      setShowFacilities(false);
      setFacilities([]);
      setLocationError(null);
      navigate(`/medilink/diagnosis/session/${newSessionId}`);
    } catch (error) {
      toast.error('Failed to create new session');
    }
  };

  const handleFindFacilities = async (radius = 5000) => {
    setIsFetchingFacilities(true);
    setLocationError(null);
    setSearchRadius(radius);

    try {
      const locationData = await getLocationWithAddress();

      await diagnosisService.saveUserLocation(sessionId, {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        address: locationData.address,
      });

      const response = await diagnosisService.getNearbyFacilities(
        locationData.latitude,
        locationData.longitude,
        radius
      );

      if (response.success) {
        setFacilities(response.data.facilities);
        setShowFacilities(true);
        
        if (response.data.facilities.length === 0) {
          toast.error('No facilities found nearby. Try expanding the search or use Google Maps.');
        }
      } else {
        // Handle timeout or API errors
        setLocationError(response.data.error || 'Unable to fetch facilities');
        if (response.data.errorType === 'timeout') {
          toast.error('Search timed out. Please try again or use Google Maps search.');
        }
      }
    } catch (error) {
      const isTimeout = error.code === 'ECONNABORTED' || error.message.includes('timeout');
      setLocationError(
        isTimeout 
          ? 'The search is taking too long. Please try again or enable location access in your browser.'
          : error.message || 'Unable to get your location. Please enable location access in your browser.'
      );
      toast.error(isTimeout ? 'Search timed out. Please try again.' : 'Failed to find facilities');
    } finally {
      setIsFetchingFacilities(false);
    }
  };

  const handleExpandSearch = () => {
    handleFindFacilities(10000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#04642a] to-[#15a33d] py-6 px-4 sm:px-6 lg:px-8 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/medilink/diagnosis')}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Sessions</span>
            </button>
            <button
              onClick={handleNewSession}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all border border-white/20"
            >
              <Plus className="w-4 h-4" />
              New Session
            </button>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Messages */}
        <div className="space-y-6 mb-6">
          {messages.length === 0 && !isLoading && (
            <div className="text-center py-12" data-aos="fade-up">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#04642a] to-[#15a33d] rounded-full mb-4">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Health Assessment Assistant
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                I'll ask you a series of questions to understand your health
                concern, then provide guidance on next steps.
              </p>
              <div className="max-w-md mx-auto p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  <strong>Important:</strong> This is an AI health assistant,
                  not a doctor. I cannot diagnose conditions or prescribe
                  medications. My goal is to help you understand your symptoms
                  and guide you to appropriate care.
                </p>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index}>
              {message.role === 'user' ? (
                <div className="flex justify-end" data-aos="fade-left">
                  <div className="max-w-3xl bg-[#04642a] text-white rounded-2xl rounded-tr-sm px-6 py-4 shadow-md">
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    {message.timestamp && (
                      <span className="text-xs text-white/70 mt-2 block">
                        {format(new Date(message.timestamp), 'hh:mm a')}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex justify-start" data-aos="fade-right">
                  <div className="max-w-3xl w-full">
                    {/* Check both new assessment and old diagnosis for backward compat */}
                    {hasValidAssessment(message) ? (
                      <AssessmentCard
                        assessment={message.assessment || message.diagnosis}
                        isNewFormat={!!message.assessment}
                        onFindFacilities={handleFindFacilities}
                        isFetchingFacilities={isFetchingFacilities}
                        locationError={locationError}
                      />
                    ) : (
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-6 py-4 shadow-md">
                        <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                          {message.content}
                        </p>
                        {message.timestamp && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 block">
                            {format(new Date(message.timestamp), 'hh:mm a')}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    {sessionPhase === 'intake' ||
                    sessionPhase === 'questioning'
                      ? 'Thinking...'
                      : 'Preparing your assessment...'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Nearby Facilities Panel */}
        {showFacilities && (
          <NearbyFacilities
            facilities={facilities}
            onClose={() => setShowFacilities(false)}
            isLoading={isFetchingFacilities}
            onExpandSearch={handleExpandSearch}
          />
        )}

        {/* Input Area */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 pt-4 pb-6">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder={
                  sessionPhase === 'assessed' || sessionPhase === 'follow_up'
                    ? 'Ask a follow-up question...'
                    : 'Type your response...'
                }
                rows={3}
                disabled={isLoading}
                className="w-full px-6 py-4 pr-14 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 focus:border-[#04642a] focus:outline-none transition-all resize-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="absolute bottom-3 right-3 p-3 bg-gradient-to-r from-[#04642a] to-[#15a33d] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {sessionPhase === 'assessed' || sessionPhase === 'follow_up'
                ? 'You can ask follow-up questions or find nearby hospitals above'
                : 'Answer the questions as thoroughly as you can for the best assessment'}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

// Assessment Card Component
const AssessmentCard = ({
  assessment,
  isNewFormat = true,
  onFindFacilities,
  isFetchingFacilities,
  locationError,
}) => {
  const [expanded, setExpanded] = useState({
    conditions: true,
    warnings: true,
  });

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'mild':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-700 dark:text-green-300',
          border: 'border-green-500',
        };
      case 'moderate':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900/30',
          text: 'text-yellow-700 dark:text-yellow-300',
          border: 'border-yellow-500',
        };
      case 'severe':
        return {
          bg: 'bg-orange-100 dark:bg-orange-900/30',
          text: 'text-orange-700 dark:text-orange-300',
          border: 'border-orange-500',
        };
      case 'critical':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-700 dark:text-red-300',
          border: 'border-red-500',
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-800',
          text: 'text-gray-700 dark:text-gray-300',
          border: 'border-gray-300',
        };
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'non-urgent':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'routine':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'urgent':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'emergency':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    }
  };

  // Normalize field names for backward compat with old diagnosis format
  const conditions = isNewFormat
    ? assessment.possibleConditions
    : assessment.possibleDiseases;
  const reliefSuggestions = isNewFormat
    ? assessment.reliefSuggestions
    : assessment.recommendations;
  const warningSignsToWatch = isNewFormat
    ? assessment.warningSignsToWatch
    : assessment.whenToSeekHelp;
  const shouldVisitDoctor = isNewFormat
    ? assessment.shouldVisitDoctor
    : assessment.needsDoctorImmediately;
  const visitTimeframe = isNewFormat ? assessment.visitTimeframe : null;

  const severityColors = getSeverityColor(assessment.severity);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-[#04642a] to-[#15a33d] rounded-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Health Assessment
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Based on your consultation responses
            </p>
            {/* Severity & Urgency badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {assessment.severity && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${severityColors.bg} ${severityColors.text}`}
                >
                  {assessment.severity}
                </span>
              )}
              {assessment.urgency && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${getUrgencyColor(assessment.urgency)}`}
                >
                  {assessment.urgency}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Possible Conditions */}
        {conditions && conditions.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() =>
                setExpanded({
                  ...expanded,
                  conditions: !expanded.conditions,
                })
              }
              className="flex items-center justify-between w-full text-left py-2"
            >
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase">
                Possible Conditions ({conditions.length})
              </h4>
              {expanded.conditions ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {expanded.conditions && (
              <ul className="mt-2 space-y-1">
                {conditions.map((condition, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <CheckCircle className="w-4 h-4 text-[#04642a] flex-shrink-0 mt-0.5" />
                    <span>{condition}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Self-Care & Relief Suggestions — always expanded */}
        {reliefSuggestions && reliefSuggestions.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase mb-2">
              Self-Care & Relief Suggestions
            </h4>
            <ul className="space-y-2">
              {reliefSuggestions.map((suggestion, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 py-2 px-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                >
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* When to See a Doctor */}
        {(shouldVisitDoctor || visitTimeframe) && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 uppercase mb-1">
                  When to See a Doctor
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {visitTimeframe ||
                    (shouldVisitDoctor
                      ? 'It is recommended that you consult a healthcare professional.'
                      : 'Monitor your symptoms. See a doctor if they persist or worsen.')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Warning Signs to Watch */}
        {warningSignsToWatch && warningSignsToWatch.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() =>
                setExpanded({ ...expanded, warnings: !expanded.warnings })
              }
              className="flex items-center justify-between w-full text-left py-2"
            >
              <h4 className="text-sm font-semibold text-red-900 dark:text-red-300 uppercase flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Warning Signs to Watch
              </h4>
              {expanded.warnings ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {expanded.warnings && (
              <ul className="mt-2 space-y-2">
                {warningSignsToWatch.map((warning, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-red-700 dark:text-red-300 py-2 px-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                  >
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Find Nearby Hospitals Button */}
        {shouldVisitDoctor && (
          <div className="mb-4">
            <button
              onClick={() => onFindFacilities(5000)}
              disabled={isFetchingFacilities}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-[#04642a] to-[#15a33d] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 font-medium"
            >
              {isFetchingFacilities ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Finding nearby facilities...
                </>
              ) : (
                <>
                  <MapPin className="w-5 h-5" />
                  Find Nearby Hospitals & Clinics
                </>
              )}
            </button>
            {locationError && (
              <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">
                  {locationError}
                </p>
                <a
                  href="https://www.google.com/maps/search/hospitals+near+me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-red-600 dark:text-red-400 underline mt-1 inline-flex items-center gap-1"
                >
                  Search on Google Maps instead
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* Disclaimer */}
        {assessment.disclaimer && (
          <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 italic">
              {assessment.disclaimer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosisChatPage;
