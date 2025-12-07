import React, { useEffect } from 'react';
import {
  ArrowRight,
  CheckSquare,
  Bell,
  BarChart2,
  Star,
  Users,
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import heroImage from '../../assets/Logo/Banner Image.webp';
import { Link } from 'react-router';
import QuickStats from './QuickStats';

const HeroSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 80,
      easing: 'ease-in-out',
    });
  }, []);

  const features = [
    {
      title: 'Mental Wellness',
      desc: 'AI-powered mental health insights and interventions',
      icon: (
        <CheckSquare className="w-8 h-8 sm:w-10 sm:h-10 text-[#15a33d] dark:text-[#0d9132]" />
      ),
      path: '/wellness-monitoring',
    },
    {
      title: 'Inclusive Communication',
      desc: 'Real-time chat with sign language-to-text and speech translation',
      icon: (
        <Star className="w-8 h-8 sm:w-10 sm:h-10 text-[#15a33d] dark:text-[#0d9132]" />
      ),
      path: '/inclusive-chat',
    },
    {
      title: 'Collaborative Learning',
      desc: 'Collaborative whiteboard space and file sharing with AI-enhanced notes',
      icon: (
        <Bell className="w-8 h-8 sm:w-10 sm:h-10 text-[#15a33d] dark:text-[#0d9132]" />
      ),
      path: '/collaborative-learning',
    },
    {
      title: 'Campus Engagement',
      desc: 'Stay informed with real-time campus events and updates',
      icon: (
        <BarChart2 className="w-8 h-8 sm:w-10 sm:h-10 text-[#15a33d] dark:text-[#0d9132]" />
      ),
      path: '/campus-engagement',
    },
  ];

  return (
    <section
      className="relative flex items-center overflow-hidden transition-all duration-500 min-h-[calc(100vh-70px)]"
      aria-labelledby="hero-heading"
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Hero background"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />

        {/* DYNAMIC OVERLAY:
            Light Mode: White gradient Left->Right
            Dark Mode: Custom red gradient (rgba 10,30,15) Left->Right
        */}
        <div
          className="absolute inset-0 
          bg-gradient-to-r from-white/90 via-white/50 to-white/30
          dark:bg-[linear-gradient(90deg,rgba(10,30,15,0.98)_0%,rgba(10,30,15,0.85)_50%,rgba(10,30,15,0.4)_100%)]
          transition-colors duration-500"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* LEFT SIDE */}
          <div className="text-center lg:text-left" data-aos="fade-up">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mt-10 mb-5 border backdrop-blur-sm shadow-sm
              bg-white/50 border-gray-200 text-gray-700
              dark:bg-[rgba(10,30,15,0.6)] dark:border-white/20 dark:text-gray-200
              transition-all duration-300"
            >
              <Users className="w-4 h-4 text-[#15a33d] dark:text-[#0d9132]" />
              <span className="text-sm font-medium">
                Synapse — Wellness, collaboration, connection
              </span>
            </div>

            {/* Title */}
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-snug sm:leading-tight 
              text-gray-900 dark:text-white transition-colors duration-300"
              data-aos="fade-right"
            >
              Build Progress, <br />
              <span className="text-[#15a33d] dark:text-[#0d9132]">
                Foster Growth
              </span>
            </h1>

            {/* Description */}
            <p
              className="text-base sm:text-lg md:text-xl mb-8 max-w-xl mx-auto lg:mx-0 
              text-gray-600 dark:text-gray-300 transition-colors duration-300"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Track your well-being, engage in collaborative goals, and stay
              connected with easy-to-use tools — every step forward creates
              lasting growth.
            </p>

            {/* Buttons */}
            <div
              className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-10"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              <Link to="/add-habit" aria-label="Add a habit">
                <button className="flex items-center justify-center gap-2 text-white text-lg px-8 py-4 bg-[#097133] hover:bg-[#04642a] rounded-lg font-semibold transition-all duration-300 w-full shadow-lg hover:shadow-green-500/25">
                  Add Note
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>

              <Link to="/browse" aria-label="Browse public habits">
                <button
                  className="text-lg px-8 py-4 rounded-lg transition-all duration-300 w-full backdrop-blur-sm border
                  bg-white/50 text-gray-700 border-gray-300 hover:bg-white hover:text-[#097133] hover:border-[#097133]
                  dark:bg-white/10 dark:text-white dark:border-white/30 dark:hover:bg-[#097133] dark:hover:border-[#097133]"
                >
                  Browse Public Habits
                </button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="max-w-md mx-auto lg:mx-0" data-aos="fade-up">
              <QuickStats />
            </div>
          </div>

          {/* RIGHT SIDE (Features) */}
          <div
            className="mt-10 lg:mt-0"
            data-aos="fade-left"
            data-aos-delay="200"
          >
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-5 lg:gap-6">
              {features.map((feature, idx) => (
                <Link
                  key={idx}
                  to={feature.path}
                  data-aos="zoom-in"
                  data-aos-delay={idx * 100}
                  aria-label={feature.title}
                >
                  <div
                    className="rounded-2xl p-5 sm:p-6 backdrop-blur-md transition-all duration-300 transform hover:scale-105 flex flex-col items-start
                    bg-white/60 border border-gray-200 shadow-xl hover:shadow-2xl
                    dark:bg-[rgba(10,30,15,0.4)] dark:border-white/10 dark:shadow-none dark:hover:bg-[rgba(10,30,15,0.6)]
                    hover:border-[#EF4444]/30"
                  >
                    <div className="mb-3 p-2 rounded-lg bg-green-50 dark:bg-transparent">
                      {feature.icon}
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {feature.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade (Matching the specific red) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 z-10 
        bg-gradient-to-t from-white via-white/50 to-transparent
        dark:from-[rgba(10,30,15,1)] dark:via-[rgba(10,30,15,0.8)] dark:to-transparent"
      />
    </section>
  );
};

export default HeroSection;
