import React, { useEffect } from 'react';

import marketplaceImage from '../../assets/Logo/marketplace.webp';
import farmersImage from '../../assets/Logo/success.jpg';

import AOS from 'aos';
import 'aos/dist/aos.css';
import ServiceCard from './ServiceCard';
import FeaturedShowcase from './FeaturedShowcase';
import { Bell, CheckSquare, LineChart, Target } from 'lucide-react';

const services = [
  {
    icon: CheckSquare,
    title: 'Habit Creation',
    description:
      'Add new habits to your daily routine and start building consistency and productivity.',
    features: [
      'Custom Habit Setup',
      'Multiple Categories',
      'Daily / Weekly Goals',
      'Quick Add',
    ],
    color: 'bg-red-500',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    description:
      'Never miss a habit with intelligent notifications and scheduling options.',
    features: [
      'Daily Reminders',
      'Push Notifications',
      'Custom Schedules',
      'Snooze / Repeat',
    ],
    color: 'bg-yellow-500',
  },
  {
    icon: LineChart,
    title: 'Progress Analytics',
    description:
      'Track your progress and visualize your performance with insightful charts and graphs.',
    features: [
      'Daily / Weekly Stats',
      'Completion Charts',
      'Streak Analysis',
      'Habit Trends',
    ],
    color: 'bg-blue-500',
  },
  {
    icon: Target,
    title: 'Streak Tracking',
    description:
      'Monitor streaks and milestones to stay motivated and maintain long-term consistency.',
    features: [
      'Longest Streaks',
      'Goal Milestones',
      'Achievements & Badges',
      'Motivational Alerts',
    ],
    color: 'bg-green-500',
  },
];

const Services = () => {
  // Initialize AOS with the same config as HowItWorks for consistency
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
      id="services"
      className="md:py-24 py-16 min-h-screen flex items-center overflow-hidden bg-white dark:bg-[#111827] text-gray-900 dark:text-gray-100"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16" data-aos="fade-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-snug">
            Empowering Every Step of Agriculture
          </h2>
          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
            From marketplace to smart farming — discover our complete ecosystem
            built for modern agriculture.
          </p>
        </div>

        {/* Service Cards */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 mb-20">
          {services.map((service, idx) => (
            <div key={idx} data-aos="zoom-in" data-aos-delay={idx * 150}>
              <ServiceCard {...service} />
            </div>
          ))}
        </div>

        {/* Showcase Section */}
        <div data-aos="fade-up" data-aos-delay={100}>
          <FeaturedShowcase
            marketplaceImage={marketplaceImage}
            farmersImage={farmersImage}
          />
        </div>
      </div>
    </div>
  );
};

export default Services;
