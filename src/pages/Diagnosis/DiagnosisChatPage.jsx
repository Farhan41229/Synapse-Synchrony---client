import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { diagnosisService } from '@/services/diagnosisService';
import {
  Stethoscope,
  Send,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Pill,
  ArrowLeft,
  Plus,
  Activity,
  Shield,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const DiagnosisChatPage = () => {
  const { sessionId: urlSessionId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);

  const [sessionId, setSessionId] = useState(urlSessionId);
  const [messages, setMessages] = useState([]);
  const [inputSymptoms, setInputSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-in-out' });
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      try {
        if (!sessionId || sessionId === 'new') {
          const response = await diagnosisService.createSession();
          const newSessionId = response.sessionId;
          setSessionId(newSessionId);
          navigate(`/medilink/diagnosis/session/${newSessionId}`, {
            replace: true,
          });
        } else {
          const response = await diagnosisService.getSessionHistory(sessionId);
          if (response.success && response.data.messages) {
            setMessages(response.data.messages);
          }
        }
      } catch (error) {
        console.error('Failed to initialize session:', error);
        toast.error('Failed to load session');
      }
    };

    initSession();
  }, [sessionId, navigate]);

  // Submit symptoms mutation
  const submitMutation = useMutation({
    mutationFn: ({ sessionId, symptoms }) =>
      diagnosisService.submitSymptoms(sessionId, symptoms),
    onSuccess: (data) => {
      // Add user message
      const userMessage = {
        role: 'user',
        content: inputSymptoms,
        timestamp: new Date(),
      };

      // Add AI response with diagnosis
      const assistantMessage = {
        role: 'assistant',
        content: '', // We'll display diagnosis card instead
        timestamp: new Date(),
        diagnosis: data.data.diagnosis,
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setInputSymptoms('');
      setIsAnalyzing(false);
      
      // Invalidate sessions list
      queryClient.invalidateQueries(['diagnosisSessions']);
      
      toast.success('Diagnosis complete!');
    },
    onError: (error) => {
      setIsAnalyzing(false);
      toast.error(
        error.response?.data?.message || 'Failed to process symptoms'
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!inputSymptoms.trim()) {
      toast.error('Please describe your symptoms');
      return;
    }

    if (inputSymptoms.trim().length < 10) {
      toast.error('Please provide more details about your symptoms');
      return;
    }

    setIsAnalyzing(true);
    submitMutation.mutate({ sessionId, symptoms: inputSymptoms });
  };

  const handleNewSession = async () => {
    try {
      const response = await diagnosisService.createSession();
      const newSessionId = response.sessionId;
      setSessionId(newSessionId);
      setMessages([]);
      navigate(`/medilink/diagnosis/session/${newSessionId}`);
      toast.success('New diagnosis session started');
    } catch (error) {
      toast.error('Failed to create new session');
    }
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
          {messages.length === 0 && !isAnalyzing && (
            <div className="text-center py-12" data-aos="fade-up">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#04642a] to-[#15a33d] rounded-full mb-4">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Welcome to Medical Diagnosis
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Describe your symptoms and I'll provide an AI-powered health
                assessment
              </p>
              <div className="max-w-md mx-auto p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Note:</strong> This is an AI assessment tool for
                  informational purposes only. Always consult a healthcare
                  professional for proper medical advice.
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
                    <span className="text-xs text-white/70 mt-2 block">
                      {format(new Date(message.timestamp), 'hh:mm a')}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex justify-start" data-aos="fade-right">
                  <div className="max-w-3xl w-full">
                    {message.diagnosis ? (
                      <DiagnosisCard diagnosis={message.diagnosis} />
                    ) : (
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm px-6 py-4 shadow-md">
                        <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                          {message.content}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 block">
                          {format(new Date(message.timestamp), 'hh:mm a')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isAnalyzing && (
            <div className="flex justify-start" data-aos="fade-right">
              <div className="max-w-3xl bg-gray-100 dark:bg-gray-800 rounded-2xl px-6 py-4 shadow-md">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-[#04642a]" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Analyzing your symptoms...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 pt-4 pb-6">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="relative">
              <textarea
                value={inputSymptoms}
                onChange={(e) => setInputSymptoms(e.target.value)}
                placeholder="Describe your symptoms in detail... (e.g., I have a headache, fever, and body aches since yesterday)"
                rows={4}
                disabled={isAnalyzing}
                className="w-full px-6 py-4 pr-14 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 focus:border-[#04642a] focus:outline-none transition-all resize-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isAnalyzing || !inputSymptoms.trim()}
                className="absolute bottom-3 right-3 p-3 bg-gradient-to-r from-[#04642a] to-[#15a33d] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Describe your symptoms, duration, severity, and any other relevant
              information
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

// Diagnosis Card Component
const DiagnosisCard = ({ diagnosis }) => {
  const [expanded, setExpanded] = useState({
    diseases: false,
    recommendations: false,
    warnings: false,
  });

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

  const severityColors = getSeverityColor(diagnosis.severity);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
      {/* Emergency Alert */}
      {diagnosis.needsDoctorImmediately && (
        <div className="bg-red-600 text-white p-4 flex items-center gap-3 animate-pulse">
          <AlertTriangle className="w-6 h-6 flex-shrink-0" />
          <div>
            <p className="font-bold">URGENT: Immediate Medical Attention Required!</p>
            <p className="text-sm">Please visit the nearest hospital or call emergency services</p>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-[#04642a] to-[#15a33d] rounded-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Medical Assessment
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered diagnosis based on your symptoms
            </p>
          </div>
        </div>

        {/* Primary Diagnosis */}
        <div className={`p-4 rounded-lg border-2 ${severityColors.border} ${severityColors.bg} mb-4`}>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase">
              Primary Diagnosis
            </h4>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${severityColors.bg} ${severityColors.text}`}>
                {diagnosis.severity}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                {diagnosis.confidence} confidence
              </span>
            </div>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {diagnosis.primaryDiagnosis}
          </p>
        </div>

        {/* Possible Diseases */}
        <div className="mb-4">
          <button
            onClick={() => setExpanded({ ...expanded, diseases: !expanded.diseases })}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase">
              Possible Conditions ({diagnosis.possibleDiseases?.length || 0})
            </h4>
            <TrendingUp className={`w-4 h-4 transition-transform ${expanded.diseases ? 'rotate-180' : ''}`} />
          </button>
          {expanded.diseases && (
            <ul className="mt-2 space-y-1">
              {diagnosis.possibleDiseases?.map((disease, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <CheckCircle className="w-4 h-4 text-[#04642a] flex-shrink-0 mt-0.5" />
                  <span>{disease}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Medications */}
        {diagnosis.medications && diagnosis.medications.length > 0 && (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-3">
              <Pill className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 uppercase">
                Recommended Medications (Bangladesh)
              </h4>
            </div>
            <ul className="space-y-2">
              {diagnosis.medications.map((med, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200"
                >
                  <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-blue-600 dark:bg-blue-500 text-white rounded-full text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="font-medium">{med}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-3 italic">
              All medications are available in Bangladesh pharmacies
            </p>
          </div>
        )}

        {/* Recommendations */}
        {diagnosis.recommendations && diagnosis.recommendations.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setExpanded({ ...expanded, recommendations: !expanded.recommendations })}
              className="flex items-center justify-between w-full text-left mb-2"
            >
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase">
                Self-Care Recommendations
              </h4>
              <CheckCircle className={`w-4 h-4 transition-transform ${expanded.recommendations ? 'rotate-180' : ''}`} />
            </button>
            {expanded.recommendations && (
              <ul className="space-y-2">
                {diagnosis.recommendations.map((rec, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 py-2 px-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                  >
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Warning Signs */}
        {diagnosis.whenToSeekHelp && diagnosis.whenToSeekHelp.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setExpanded({ ...expanded, warnings: !expanded.warnings })}
              className="flex items-center justify-between w-full text-left mb-2"
            >
              <h4 className="text-sm font-semibold text-red-900 dark:text-red-300 uppercase flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                When to Seek Help
              </h4>
              <AlertTriangle className={`w-4 h-4 transition-transform ${expanded.warnings ? 'rotate-180' : ''}`} />
            </button>
            {expanded.warnings && (
              <ul className="space-y-2">
                {diagnosis.whenToSeekHelp.map((warning, i) => (
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

        {/* Warning Box */}
        {diagnosis.warning && (
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg mb-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
              <p className="text-sm text-orange-800 dark:text-orange-200">
                <strong>Important:</strong> {diagnosis.warning}
              </p>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        {diagnosis.disclaimer && (
          <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 italic">
              ⚕️ {diagnosis.disclaimer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosisChatPage;
