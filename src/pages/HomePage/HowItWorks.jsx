import React, { useEffect } from 'react';
import {
  CheckSquare,
  Bell,
  LineChart,
  Target,
  Award,
  Users,
  MessageSquare,
  BookOpen,
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const steps = [
  {
    step: 1,
    icon: CheckSquare,
    title: 'Create Habits',
    description:
      'Start by adding new habits to build your daily routine and consistency.',
  },
  {
    step: 2,
    icon: Bell,
    title: 'Set Reminders',
    description: 'Never miss a habit by scheduling smart daily notifications.',
  },
  {
    step: 3,
    icon: LineChart,
    title: 'Track Progress',
    description:
      'Visualize your performance with daily, weekly, and monthly progress charts.',
  },
  {
    step: 4,
    icon: Target,
    title: 'Streak Tracking',
    description:
      'Monitor your longest streaks and stay motivated to keep consistency.',
  },
];

const HowItWorks = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-in-out',
      offset: 100,
    });
  }, []);

  return (
    <div
      id="how-it-works"
      className="md:py-24 py-16 min-h-screen flex items-center overflow-hidden bg-white dark:bg-[#111827] text-gray-900 dark:text-gray-100"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16" data-aos="fade-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-snug">
            How Habitude Works
          </h2>
          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
            Build better habits in four simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                data-aos="zoom-in-up"
                data-aos-delay={index * 150}
                className="relative z-10 group flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2"
              >
                {/* Step Number */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#EF4444] flex items-center justify-center text-xl sm:text-2xl font-extrabold text-white shadow-md group-hover:scale-110 transition-transform duration-300 z-20">
                  {step.step}
                </div>

                {/* Card */}
                <div className="rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-between bg-white/5 dark:bg-white/10 border border-white/10 dark:border-white/20 backdrop-blur-md">
                  {/* Icon */}
                  <div className="mt-8 mb-6 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-2xl border-2 border-[#EF4444] shadow-md group-hover:bg-[#EF4444] transition-colors duration-300">
                    <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-[#EF4444] group-hover:text-white transition-colors duration-300" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl md:text-xl font-bold mb-3 group-hover:text-[#EF4444] transition-colors duration-300">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base md:text-base leading-relaxed max-w-xs flex-grow text-gray-700 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
