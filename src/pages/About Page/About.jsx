import React, { useEffect } from 'react';
import {
  Target,
  Users,
  MessageCircle,
  BookOpen,
  Heart,
  Brain,
  Calendar,
  FileText,
  Zap,
  Shield,
  Globe,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 900, once: true, easing: 'ease-in-out' });
  }, []);

  const currentFeatures = [
    {
      icon: Users,
      title: 'Real-Time Chat',
      desc: 'Secure, encrypted messaging with support for text, images, and replies.',
    },
    {
      icon: MessageCircle,
      title: 'AI Assistant',
      desc: 'Chat with Whoop AI powered by Groq LLaMA 3.3 70B for instant help and answers.',
    },
    {
      icon: Shield,
      title: 'Secure Authentication',
      desc: 'JWT-based authentication with email verification and password reset functionality.',
    },
    {
      icon: Zap,
      title: 'Real-Time Updates',
      desc: 'Socket.IO powered real-time message delivery and online presence tracking.',
    },
    {
      icon: FileText,
      title: 'File Sharing',
      desc: 'Share images and files seamlessly with cloud storage integration.',
    },
    {
      icon: Globe,
      title: 'Responsive Design',
      desc: 'Beautiful dark/light theme with full mobile and desktop support.',
    },
  ];

  const futureFeatures = [
    {
      icon: Brain,
      title: 'AI Mental Wellness Monitoring',
      desc: 'Non-invasive assessment of student mental health with proactive insights and interventions.',
      status: 'Coming Soon',
    },
    {
      icon: BookOpen,
      title: 'SynapseWorkspace',
      desc: 'Collaborative file-sharing portal with whiteboard channels, version control, and AI summarization.',
      status: 'In Development',
    },
    {
      icon: Heart,
      title: 'Accessibility Features',
      desc: 'Sign language-to-text translation and speech-to-text for inclusive communication.',
      status: 'Planned',
    },
    {
      icon: Calendar,
      title: 'SynapsePortal',
      desc: 'Campus events feed, lost-and-found, blogs, and announcements hub.',
      status: 'Planned',
    },
    {
      icon: Target,
      title: 'Goal Tracking',
      desc: 'Personal and collaborative goal setting with progress analytics.',
      status: 'Planned',
    },
    {
      icon: Sparkles,
      title: 'Advanced AI Features',
      desc: 'Context-aware recommendations, stress detection, and personalized interventions.',
      status: 'Research Phase',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#04642a]/10 to-transparent dark:from-[#04642a]/20" />
        
        <div className="max-w-7xl mx-auto relative z-10" data-aos="fade-up">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[#04642a] to-[#15a33d] bg-clip-text text-transparent">
              Synapse Synchrony
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-4">
              A unified platform for academic, social, and mental well-being
            </p>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Empowering students with AI-powered wellness monitoring, inclusive communication, 
              collaborative learning spaces, and centralized campus engagement.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                Modern campuses are hubs of learning, social interaction, and personal growth. 
                However, students face significant challenges including rising stress and anxiety, 
                fragmented collaboration tools, distracting communication platforms, and scattered campus information.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Synapse Synchrony addresses these challenges by providing a comprehensive platform 
                that integrates mental wellness support, inclusive communication, collaborative workspaces, 
                and centralized campus engagement—all in one place.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4" data-aos="fade-left">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <Target className="w-12 h-12 text-[#04642a] mb-4" />
                <h3 className="font-semibold text-xl mb-2 text-gray-900 dark:text-white">Goal Oriented</h3>
                <p className="text-gray-600 dark:text-gray-400">Focused on student success and well-being</p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <Shield className="w-12 h-12 text-[#04642a] mb-4" />
                <h3 className="font-semibold text-xl mb-2 text-gray-900 dark:text-white">Secure</h3>
                <p className="text-gray-600 dark:text-gray-400">Privacy-first with end-to-end encryption</p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <Users className="w-12 h-12 text-[#04642a] mb-4" />
                <h3 className="font-semibold text-xl mb-2 text-gray-900 dark:text-white">Inclusive</h3>
                <p className="text-gray-600 dark:text-gray-400">Accessible to all students and abilities</p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <Sparkles className="w-12 h-12 text-[#04642a] mb-4" />
                <h3 className="font-semibold text-xl mb-2 text-gray-900 dark:text-white">AI-Powered</h3>
                <p className="text-gray-600 dark:text-gray-400">Intelligent features for better outcomes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Current Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Already live and helping students connect, collaborate, and grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentFeatures.map((feature, index) => (
              <div
                key={index}
                data-aos="zoom-in"
                data-aos-delay={index * 100}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-[#04642a]/10 dark:bg-[#04642a]/20 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-8 h-8 text-[#04642a]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Future Roadmap
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Exciting features we're building to enhance your experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {futureFeatures.map((feature, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#04642a]/10 text-[#04642a] dark:bg-[#04642a]/20">
                    {feature.status}
                  </span>
                </div>
                <div className="w-14 h-14 bg-[#04642a]/10 dark:bg-[#04642a]/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-[#04642a]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Four Core Pillars
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The foundation of our comprehensive platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div
              data-aos="flip-left"
              className="bg-gradient-to-br from-[#04642a]/10 to-[#15a33d]/5 dark:from-[#04642a]/20 dark:to-[#15a33d]/10 rounded-2xl p-8 border border-[#04642a]/20"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-[#04642a] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">MediLink</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    AI-powered mental wellness monitoring with non-invasive assessment, 
                    stress/mood analytics, and proactive interventions.
                  </p>
                </div>
              </div>
            </div>

            <div
              data-aos="flip-left"
              data-aos-delay="100"
              className="bg-gradient-to-br from-[#04642a]/10 to-[#15a33d]/5 dark:from-[#04642a]/20 dark:to-[#15a33d]/10 rounded-2xl p-8 border border-[#04642a]/20"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-[#04642a] rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">SynapseChat</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Real-time encrypted chat with accessibility features including sign language-to-text 
                    and speech translation for inclusive communication.
                  </p>
                </div>
              </div>
            </div>

            <div
              data-aos="flip-left"
              data-aos-delay="200"
              className="bg-gradient-to-br from-[#04642a]/10 to-[#15a33d]/5 dark:from-[#04642a]/20 dark:to-[#15a33d]/10 rounded-2xl p-8 border border-[#04642a]/20"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-[#04642a] rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">SynapseWorkspace</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Collaborative whiteboard channels with file sharing, version control, 
                    inline comments, and AI-powered note summarization.
                  </p>
                </div>
              </div>
            </div>

            <div
              data-aos="flip-left"
              data-aos-delay="300"
              className="bg-gradient-to-br from-[#04642a]/10 to-[#15a33d]/5 dark:from-[#04642a]/20 dark:to-[#15a33d]/10 rounded-2xl p-8 border border-[#04642a]/20"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-[#04642a] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">SynapsePortal</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Dynamic campus hub for events, lost-and-found, announcements, and blogs 
                    to foster community engagement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#04642a] to-[#15a33d]">
        <div className="max-w-4xl mx-auto text-center" data-aos="zoom-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Join the Synapse Community
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Experience a platform designed to enhance your academic journey, 
            foster meaningful connections, and support your mental well-being.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/auth/signup'}
              className="btn bg-white text-[#04642a] hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => window.location.href = '/contact'}
              className="btn bg-transparent text-white border-2 border-white hover:bg-white/10 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
