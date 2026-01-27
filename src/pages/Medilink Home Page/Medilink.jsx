import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Heart,
  Shield,
  Sparkles,
  ArrowRight,
  HeartPulse,
  Lightbulb,
  Lock,
  MessageSquareHeart,
  Waves,
  Brain,
  X,
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import MedilinkChat from '@/components/Medilink/MedilinkChat';

export default function MedilinkHome() {
  const navigate = useNavigate();
  const [emotion, setEmotion] = useState(50);
  // eslint-disable-next-line no-unused-vars
  const [mounted, setMounted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const emotions = [
    { value: 0, label: '😔 Down', color: 'from-blue-500/50' },
    { value: 25, label: '😊 Content', color: 'from-green-500/50' },
    { value: 50, label: '😌 Peaceful', color: 'from-purple-500/50' },
    { value: 75, label: '🤗 Happy', color: 'from-yellow-500/50' },
    { value: 100, label: '✨ Excited', color: 'from-pink-500/50' },
  ];

  const welcomeSteps = [
    {
      title: "Hi, I'm Medilink 👋",
      description:
        "Your AI companion for emotional well-being. I'm here to provide a safe, judgment-free space for you to express yourself.",
      icon: Waves,
    },
    {
      title: 'Personalized Support 🌱',
      description:
        'I adapt to your needs and emotional state, offering evidence-based techniques and gentle guidance when you need it most.',
      icon: Brain,
    },
    {
      title: 'Your Privacy Matters 🛡️',
      description:
        'Our conversations are completely private and secure. I follow strict ethical guidelines and respect your boundaries.',
      icon: Shield,
    },
  ];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-in-out',
      mirror: false,
    });
  }, []);

  const currentEmotion = emotions.reduce((prev, curr) =>
    Math.abs(curr.value - emotion) < Math.abs(prev.value - emotion)
      ? curr
      : prev,
  );

  const features = [
    {
      icon: HeartPulse,
      title: '24/7 Support',
      description: 'Always here to listen and support you, any time of day',
      color: 'from-rose-500/20',
      delay: 200,
    },
    {
      icon: Lightbulb,
      title: 'Smart Insights',
      description: 'Personalized guidance powered by emotional intelligence',
      color: 'from-amber-500/20',
      delay: 400,
    },
    {
      icon: Lock,
      title: 'Private & Secure',
      description: 'Your conversations are always confidential and encrypted',
      color: 'from-emerald-500/20',
      delay: 600,
    },
    {
      icon: MessageSquareHeart,
      title: 'Evidence-Based',
      description: 'Therapeutic techniques backed by clinical research',
      color: 'from-blue-500/20',
      delay: 800,
    },
  ];

  const handleBegin = async () => {
    if (currentStep < welcomeSteps.length - 1) {
      setCurrentStep((c) => c + 1);
    } else {
      setShowDialog(false);
      // Navigate to session selection page
      navigate('/medilink/sessions');
    }
  };

  const closeDialog = () => {
    setShowDialog(false);
    setCurrentStep(0);
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-white dark:bg-gray-900 transition-colors duration-500">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center py-12 px-4">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div
            className={`absolute w-[500px] h-[500px] rounded-full blur-3xl top-0 -left-20 transition-all duration-1000 ease-in-out
            bg-gradient-to-r ${currentEmotion.color} to-transparent opacity-60`}
          />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-[#04642a]/10 blur-3xl bottom-0 right-0 animate-pulse" />
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-3xl" />
        </div>

        <div className="relative space-y-8 text-center" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm border border-[#04642a]/20 bg-[#04642a]/5 backdrop-blur-sm">
            <Waves className="w-4 h-4 text-[#04642a]" />
            <span className="text-gray-900 dark:text-white font-medium">
              Your AI Mental Health Companion
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white">
            <span className="bg-gradient-to-r from-[#04642a] via-[#15a33d] to-[#04642a] bg-clip-text text-transparent">
              Find Peace
            </span>
            <br />
            of Mind
          </h1>

          <p className="max-w-[600px] mx-auto text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Experience a new way of emotional support. Our AI companion is here
            to listen, understand, and guide you through life's journey.
          </p>

          {/* Emotion Slider */}
          <div className="w-full max-w-[600px] mx-auto space-y-6 py-8">
            <div className="flex justify-between items-center px-2">
              {emotions.map((em) => (
                <button
                  key={em.value}
                  onClick={() => setEmotion(em.value)}
                  className={`flex flex-col items-center transition-all duration-300 ${
                    currentEmotion.value === em.value
                      ? 'scale-110 opacity-100'
                      : 'scale-90 opacity-40'
                  }`}
                >
                  <span className="text-3xl mb-1">
                    {em.label.split(' ')[0]}
                  </span>
                  <span className="text-xs font-semibold dark:text-gray-300">
                    {em.label.split(' ')[1]}
                  </span>
                </button>
              ))}
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={emotion}
              onChange={(e) => setEmotion(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#04642a]"
            />
          </div>

          <button
            onClick={() => setShowDialog(true)}
            className="group h-14 px-10 rounded-full bg-gradient-to-r from-[#04642a] to-[#15a33d] text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            Begin Your Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How Medilink Helps You
            </h2>
            <div className="h-1.5 w-20 bg-[#04642a] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                data-aos="fade-up"
                data-aos-delay={feature.delay}
                className="p-8 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-6 h-6 text-[#04642a]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mood Tracker Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Your Therapy Journey
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Track your progress and insights with Medilink AI
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-aos="fade-up" data-aos-delay="200">
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#04642a]/10 flex items-center justify-center">
                  <MessageSquareHeart className="w-6 h-6 text-[#04642a]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  AI-Powered Support
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Get personalized therapeutic responses using advanced AI trained on evidence-based techniques.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#04642a]/10 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-[#04642a]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Emotional Analysis
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Real-time analysis of your emotional state, risk levels, and conversation themes.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#04642a]/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#04642a]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Private & Secure
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                All your conversations are encrypted and stored securely. Your privacy is our priority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button
              onClick={closeDialog}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-6 text-center">
              <div className="mx-auto w-20 h-20 rounded-full bg-[#04642a]/10 flex items-center justify-center">
                {React.createElement(welcomeSteps[currentStep].icon, {
                  className: 'w-10 h-10 text-[#04642a]',
                })}
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {welcomeSteps[currentStep].title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {welcomeSteps[currentStep].description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-6">
                <div className="flex gap-2">
                  {welcomeSteps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-full transition-all ${i === currentStep ? 'bg-[#04642a] w-8' : 'bg-gray-200 dark:bg-gray-700 w-2'}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleBegin}
                  className="px-8 py-2.5 bg-[#04642a] text-white rounded-lg font-bold hover:bg-[#034d20] transition-colors flex items-center gap-2"
                >
                  {currentStep === welcomeSteps.length - 1 ? 'Start' : 'Next'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <MedilinkChat />
    </div>
  );
}
