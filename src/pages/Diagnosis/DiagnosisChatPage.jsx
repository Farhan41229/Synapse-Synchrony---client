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
  Star,
  User,
  Phone,
  Mail,
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

// ── Hardcoded doctor data ─────────────────────────────────────────────────────

const HARDCODED_DOCTORS = [
  { id: 1,  name: 'Dr. Arjun Mehta',    specialty: 'General Medicine', hospital: 'Square Hospital, Dhaka',                       experience: 12, rating: 4.8, fee: 800,  available: 'today',     phone: '+880 1711-234567', email: 'arjun.mehta@squarehospital.com.bd'    },
  { id: 2,  name: 'Dr. Priya Nair',     specialty: 'General Medicine', hospital: 'United Hospital, Dhaka',                       experience: 8,  rating: 4.6, fee: 700,  available: 'tomorrow',  phone: '+880 1812-345678', email: 'priya.nair@uhbd.com'                  },
  { id: 3,  name: 'Dr. Rajan Pillai',   specialty: 'Pulmonology',      hospital: 'Evercare Hospital, Dhaka',                     experience: 15, rating: 4.9, fee: 1200, available: 'today',     phone: '+880 1913-456789', email: 'rajan.pillai@evercarebd.com'          },
  { id: 4,  name: 'Dr. Sonal Desai',    specialty: 'Pulmonology',      hospital: 'Dhaka Medical College Hospital',               experience: 10, rating: 4.7, fee: 1000, available: 'this week', phone: '+880 1614-567890', email: 'sonal.desai@dmch.gov.bd'              },
  { id: 5,  name: 'Dr. Karthik Iyer',   specialty: 'Cardiology',       hospital: 'National Heart Foundation Hospital, Dhaka',    experience: 18, rating: 4.9, fee: 1800, available: 'tomorrow',  phone: '+880 1715-678901', email: 'karthik.iyer@nhfh.org.bd'             },
  { id: 6,  name: 'Dr. Ananya Reddy',   specialty: 'Cardiology',       hospital: 'BIRDEM General Hospital, Dhaka',               experience: 11, rating: 4.7, fee: 1500, available: 'today',     phone: '+880 1816-789012', email: 'ananya.reddy@birdem.ac.bd'            },
  { id: 7,  name: 'Dr. Neha Kapoor',    specialty: 'Dermatology',      hospital: 'Green Life Medical College & Hospital, Dhaka', experience: 7,  rating: 4.5, fee: 900,  available: 'today',     phone: '+880 1917-890123', email: 'neha.kapoor@greenlifebd.com'          },
  { id: 8,  name: 'Dr. Vivek Srinivas', specialty: 'Neurology',        hospital: 'National Institute of Neurosciences, Dhaka',   experience: 14, rating: 4.8, fee: 1600, available: 'this week', phone: '+880 1618-901234', email: 'vivek.srinivas@nins.gov.bd'           },
  { id: 9,  name: 'Dr. Meera Krishnan', specialty: 'Gastroenterology', hospital: 'Popular Medical College Hospital, Dhaka',      experience: 16, rating: 4.9, fee: 1100, available: 'tomorrow',  phone: '+880 1719-012345', email: 'meera.krishnan@popularmedical.com.bd' },
  { id: 10, name: 'Dr. Suresh Babu',    specialty: 'Orthopedics',      hospital: 'Ibn Sina Hospital, Dhaka',                     experience: 13, rating: 4.7, fee: 1000, available: 'today',     phone: '+880 1820-123456', email: 'suresh.babu@ibnsinahospital.com.bd'   },
  { id: 11, name: 'Dr. Lakshmi Patel',  specialty: 'Endocrinology',    hospital: 'BSMMU (PG Hospital), Dhaka',                   experience: 9,  rating: 4.6, fee: 1200, available: 'today',     phone: '+880 1921-234567', email: 'lakshmi.patel@bsmmu.ac.bd'            },
  { id: 12, name: 'Dr. Arun Thomas',    specialty: 'ENT',              hospital: 'Comfort Nursing Home & Hospital, Dhaka',       experience: 11, rating: 4.8, fee: 850,  available: 'tomorrow',  phone: '+880 1622-345678', email: 'arun.thomas@comfortbd.com'            },
  { id: 13, name: 'Dr. Deepa Varma',    specialty: 'Psychiatry',       hospital: 'National Mental Health Institute, Dhaka',      experience: 12, rating: 4.9, fee: 1300, available: 'this week', phone: '+880 1723-456789', email: 'deepa.varma@nmhi.gov.bd'              },
  { id: 14, name: 'Dr. Rajesh Gupta',   specialty: 'Urology',          hospital: 'Holy Family Red Crescent Hospital, Dhaka',     experience: 17, rating: 4.8, fee: 1200, available: 'today',     phone: '+880 1824-567890', email: 'rajesh.gupta@holyfamilybd.com'        },
  { id: 15, name: 'Dr. Sunita Ahuja',   specialty: 'Ophthalmology',    hospital: 'Chittagong Eye Infirmary & Training Complex',  experience: 14, rating: 4.9, fee: 1000, available: 'tomorrow',  phone: '+880 1925-678901', email: 'sunita.ahuja@ceitc.org.bd'            },
];

const CONDITION_TO_SPECIALTY = {
  'fever':        ['General Medicine'],
  'viral':        ['General Medicine'],
  'infection':    ['General Medicine'],
  'cold':         ['ENT', 'General Medicine'],
  'throat':       ['ENT'],
  'ear':          ['ENT'],
  'sinus':        ['ENT'],
  'cough':        ['Pulmonology', 'ENT'],
  'respiratory':  ['Pulmonology'],
  'breathing':    ['Pulmonology'],
  'asthma':       ['Pulmonology'],
  'chest':        ['Cardiology', 'Pulmonology'],
  'heart':        ['Cardiology'],
  'hypertension': ['Cardiology'],
  'headache':     ['Neurology', 'General Medicine'],
  'migraine':     ['Neurology'],
  'seizure':      ['Neurology'],
  'skin':         ['Dermatology'],
  'rash':         ['Dermatology'],
  'acne':         ['Dermatology'],
  'stomach':      ['Gastroenterology', 'General Medicine'],
  'gastro':       ['Gastroenterology'],
  'abdomen':      ['Gastroenterology'],
  'diarrhea':     ['Gastroenterology', 'General Medicine'],
  'vomit':        ['Gastroenterology', 'General Medicine'],
  'joint':        ['Orthopedics'],
  'bone':         ['Orthopedics'],
  'muscle':       ['Orthopedics'],
  'back pain':    ['Orthopedics'],
  'diabetes':     ['Endocrinology'],
  'thyroid':      ['Endocrinology'],
  'anxiety':      ['Psychiatry'],
  'depression':   ['Psychiatry'],
  'mental':       ['Psychiatry'],
  'eye':          ['Ophthalmology'],
  'vision':       ['Ophthalmology'],
  'urine':        ['Urology'],
  'kidney':       ['Urology'],
};

const getRecommendedDoctors = (conditions = []) => {
  if (!conditions.length) {
    return HARDCODED_DOCTORS.filter((d) => d.specialty === 'General Medicine');
  }

  const specialtySet = new Set();
  conditions.forEach((condition) => {
    const lower = condition.toLowerCase();
    Object.entries(CONDITION_TO_SPECIALTY).forEach(([keyword, specialties]) => {
      if (lower.includes(keyword)) specialties.forEach((s) => specialtySet.add(s));
    });
  });

  if (specialtySet.size === 0) specialtySet.add('General Medicine');

  const matched = HARDCODED_DOCTORS.filter((d) => specialtySet.has(d.specialty));
  return matched
    .sort((a, b) => (a.available === 'today' ? -1 : b.available === 'today' ? 1 : 0))
    .slice(0, 3);
};

const AVATAR_COLORS = ['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500'];

const getInitials = (name) =>
  name
    .split(' ')
    .filter((_, i) => i === 1 || i === 2) // Dr. [FirstName] [Last]
    .map((n) => n[0])
    .join('');

// ── Helper ────────────────────────────────────────────────────────────────────

const hasValidAssessment = (message) => {
  const assessment = message.assessment || message.diagnosis;
  if (!assessment) return false;

  if (message.assessment) {
    return Boolean(
      assessment.possibleConditions?.length > 0 ||
      assessment.reliefSuggestions?.length > 0 ||
      assessment.urgency
    );
  }

  if (message.diagnosis) {
    return Boolean(
      assessment.primaryDiagnosis ||
      assessment.possibleDiseases?.length > 0
    );
  }

  return false;
};

// ── Main Page ─────────────────────────────────────────────────────────────────

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    const initSession = async () => {
      try {
        if (!sessionId || sessionId === 'new') {
          const response = await diagnosisService.createSession();
          setSessionId(response.sessionId);
          setMessages([response.greeting]);
          navigate(`/medilink/diagnosis/session/${response.sessionId}`, { replace: true });
        } else {
          const response = await diagnosisService.getSessionHistory(sessionId);
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

    const userMessage = { role: 'user', content: userMsg, timestamp: new Date() };
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
                I'll ask you a series of questions to understand your health concern, then provide guidance on next steps.
              </p>
              <div className="max-w-md mx-auto p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  <strong>Important:</strong> This is an AI health assistant, not a doctor. I cannot diagnose
                  conditions or prescribe medications. My goal is to help you understand your symptoms and guide
                  you to appropriate care.
                </p>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index}>
              {message.role === 'user' ? (
                <div className="flex justify-end" data-aos="fade-left">
                  <div className="max-w-3xl bg-[#04642a] text-white rounded-2xl rounded-tr-sm px-6 py-4 shadow-md">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
                    {sessionPhase === 'intake' || sessionPhase === 'questioning'
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

// ── Assessment Card ───────────────────────────────────────────────────────────

const AssessmentCard = ({
  assessment,
  isNewFormat = true,
  onFindFacilities,
  isFetchingFacilities,
  locationError,
}) => {
  const [expanded, setExpanded] = useState({ conditions: true, warnings: true });

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'mild':
        return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', border: 'border-green-500' };
      case 'moderate':
        return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-500' };
      case 'severe':
        return { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-500' };
      case 'critical':
        return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', border: 'border-red-500' };
      default:
        return { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-300' };
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'non-urgent': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'routine':    return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'urgent':     return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'emergency':  return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default:           return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    }
  };

  const conditions = isNewFormat ? assessment.possibleConditions : assessment.possibleDiseases;
  const reliefSuggestions = isNewFormat ? assessment.reliefSuggestions : assessment.recommendations;
  const warningSignsToWatch = isNewFormat ? assessment.warningSignsToWatch : assessment.whenToSeekHelp;
  const shouldVisitDoctor = isNewFormat ? assessment.shouldVisitDoctor : assessment.needsDoctorImmediately;
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
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Health Assessment</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Based on your consultation responses</p>
            <div className="flex items-center gap-2 flex-wrap">
              {assessment.severity && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${severityColors.bg} ${severityColors.text}`}>
                  {assessment.severity}
                </span>
              )}
              {assessment.urgency && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getUrgencyColor(assessment.urgency)}`}>
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
              onClick={() => setExpanded({ ...expanded, conditions: !expanded.conditions })}
              className="flex items-center justify-between w-full text-left py-2"
            >
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase">
                Possible Conditions ({conditions.length})
              </h4>
              {expanded.conditions ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </button>
            {expanded.conditions && (
              <ul className="mt-2 space-y-1">
                {conditions.map((condition, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-[#04642a] flex-shrink-0 mt-0.5" />
                    <span>{condition}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Self-Care & Relief Suggestions */}
        {reliefSuggestions && reliefSuggestions.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase mb-2">
              Self-Care & Relief Suggestions
            </h4>
            <ul className="space-y-2">
              {reliefSuggestions.map((suggestion, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 py-2 px-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
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
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 uppercase mb-1">When to See a Doctor</h4>
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
              onClick={() => setExpanded({ ...expanded, warnings: !expanded.warnings })}
              className="flex items-center justify-between w-full text-left py-2"
            >
              <h4 className="text-sm font-semibold text-red-900 dark:text-red-300 uppercase flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Warning Signs to Watch
              </h4>
              {expanded.warnings ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </button>
            {expanded.warnings && (
              <ul className="mt-2 space-y-2">
                {warningSignsToWatch.map((warning, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-red-700 dark:text-red-300 py-2 px-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
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
                <p className="text-sm text-red-700 dark:text-red-300">{locationError}</p>
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

        {/* Recommended Specialists */}
        <DoctorRecommendations conditions={conditions || []} />

        {/* Disclaimer */}
        {assessment.disclaimer && (
          <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg mt-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 italic">{assessment.disclaimer}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Doctor Recommendations ────────────────────────────────────────────────────

const DoctorRecommendations = ({ conditions }) => {
  const doctors = getRecommendedDoctors(conditions);

  const availabilityBadge = (available) => {
    if (available === 'today')
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"><span className="w-1.5 h-1.5 rounded-full bg-green-500" />Available Today</span>;
    if (available === 'tomorrow')
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />Tomorrow</span>;
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"><span className="w-1.5 h-1.5 rounded-full bg-gray-400" />This Week</span>;
  };

  if (!doctors.length) return null;

  return (
    <>
      <div className="mb-4">
        {/* Section header */}
        <div className="flex items-center gap-2 mb-3 pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
              Recommended Specialists
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Based on your assessment</p>
          </div>
        </div>

        {/* Doctor cards */}
        <div className="space-y-3">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
            >
              {/* Avatar */}
              <div className={`w-11 h-11 rounded-full ${AVATAR_COLORS[doctor.id % AVATAR_COLORS.length]} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                {getInitials(doctor.name)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{doctor.name}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{doctor.specialty}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{doctor.hospital}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">৳{doctor.fee}</p>
                    <p className="text-xs text-gray-400">per visit</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{doctor.rating}</span>
                  </div>
                  {/* Experience */}
                  <span className="text-xs text-gray-500 dark:text-gray-400">{doctor.experience} yrs exp</span>
                  {/* Availability */}
                  {availabilityBadge(doctor.available)}
                </div>

                {/* Contact info */}
                <div className="flex items-center gap-4 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/60 flex-wrap">
                  <a
                    href={`tel:${doctor.phone}`}
                    className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {doctor.phone}
                  </a>
                  <a
                    href={`mailto:${doctor.email}`}
                    className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:underline truncate"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {doctor.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </>
  );
};

export default DiagnosisChatPage;
