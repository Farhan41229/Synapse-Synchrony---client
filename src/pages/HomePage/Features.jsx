import React, { useEffect } from 'react';
import {
  CheckSquare,
  Bell,
  LineChart,
  Target,
  Award,
  Users,
  BookOpen,
  Settings,
  MessageSquare,
  FileText,
  Book,
  MessageCircle,
} from 'lucide-react';

import AOS from 'aos';
import 'aos/dist/aos.css';

const features = [
  {
    icon: CheckSquare,
    path: '/add-habit',
    title: 'Habit Creation',
    desc: 'Add new habits to start building routines and consistency.',
  },
  {
    icon: Bell,
    path: '/reminders',
    title: 'Daily Reminders',
    desc: 'Set smart reminders so you never miss your daily habits.',
  },
  {
    icon: LineChart,
    path: '/dashboard/analytics',
    title: 'Progress Analytics',
    desc: 'Visualize your performance with weekly and monthly charts.',
  },
  {
    icon: Target,
    path: '/streaks',
    title: 'Streak Tracker',
    desc: 'Track your longest streaks and daily consistency milestones.',
  },
  {
    icon: Award,
    path: '/achievements',
    title: 'Achievement Badges',
    desc: 'Earn badges and rewards for reaching consistency goals.',
  },
  {
    icon: Users,
    path: '/community',
    title: 'Community Feed',
    desc: 'Share your progress and get inspired by others’ journeys.',
  },
  {
    icon: BookOpen,
    path: '/journal',
    title: 'Journal & Notes',
    desc: 'Reflect daily and log thoughts alongside your habit progress.',
  },
  {
    icon: Settings,
    path: '/settings',
    title: 'Settings',
    desc: 'Manage your preferences, notifications, and account options.',
  },
  // New features
  {
    icon: MessageCircle,
    path: '/chat',
    title: 'Messaging',
    desc: 'Chat with friends or mentors to stay motivated and share tips.',
  },
  {
    icon: FileText,
    path: '/blog',
    title: 'Habit Blog',
    desc: 'Read and share articles, tips, and success stories.',
  },
  {
    icon: MessageSquare,
    path: '/community-questions',
    title: 'Community Q&A',
    desc: 'Ask questions and get answers from experienced users.',
  },
  {
    icon: Book,
    path: '/resources',
    title: 'Resources Library',
    desc: 'Access guides, templates, and other helpful materials.',
  },
];

const Features = () => {
  useEffect(() => {
    AOS.init({ duration: 900, once: true, easing: 'ease-in-out' });
  }, []);

  const handleClick = (path, e) => {
    e.preventDefault();
    if (path === 'reviews') {
      const section = document.getElementById('Latest-reviews');
      section?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = path;
    }
  };

  return (
    <div className="min-h-screen py-16 md:py-24 flex items-center transition-colors duration-300 ease-in-out bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
            Tools to Build Better Habits
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
            Everything you need — from habit tracking to progress analytics — in
            one beautiful dashboard.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
          {features.map(({ icon: Icon, title, desc, path }, i) => (
            <div
              key={i}
              onClick={(e) => handleClick(path, e)}
              data-aos="zoom-in"
              data-aos-delay={i * 100}
              className="cursor-pointer rounded-2xl p-6 sm:p-8 bg-white/5 dark:bg-white/10 border border-white/10 dark:border-white/20 
              backdrop-blur-md shadow-sm hover:shadow-[0_10px_30px_rgba(239,68,68,0.2)] 
              hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-[#EF4444] flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 group-hover:text-[#EF4444] transition-colors duration-300">
                {title}
              </h3>
              <p className="text-sm md:text-base flex-grow text-gray-700 dark:text-gray-300">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
