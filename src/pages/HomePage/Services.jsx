import React, { useEffect } from 'react';

import communityImage from '../../assets/Logo/marketplace.webp';
import wellnessImage from '../../assets/Logo/success.jpg';

import AOS from 'aos';
import 'aos/dist/aos.css';
import ServiceCard from './ServiceCard';
import FeaturedShowcase from './FeaturedShowcase';
import { Users, MessageCircle, Calendar, BarChart2 } from 'lucide-react';

const services = [
  {
    icon: Users,
    title: 'Community Connection',
    description:
      'Connect with peers, mentors, and communities to foster support and collaboration.',
    features: [
      'Peer-to-peer Networking',
      'Mentorship Opportunities',
      'Study Groups',
      'Community Events',
    ],
    color: 'bg-green-500',
  },
  {
    icon: MessageCircle,
    title: 'Real-Time Messaging',
    description:
      'Engage in meaningful conversations and stay connected with real-time chat functionality.',
    features: [
      'Direct Messaging',
      'Group Chats',
      'Mentor Support',
      'Instant Notifications',
    ],
    color: 'bg-blue-500',
  },
  {
    icon: Calendar,
    title: 'Campus Updates',
    description:
      'Stay informed with real-time updates about campus events, deadlines, and activities.',
    features: [
      'Real-Time Notifications',
      'Event Reminders',
      'Personalized Schedules',
      'Important Alerts',
    ],
    color: 'bg-yellow-500',
  },
  {
    icon: BarChart2,
    title: 'Wellness & Progress Tracking',
    description:
      'Track your mental well-being, academic progress, and overall growth with visual analytics.',
    features: [
      'Mood & Stress Analytics',
      'Academic Performance Tracking',
      'Goal Progression Charts',
      'Engagement Insights',
    ],
    color: 'bg-purple-500',
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
            Empowering Students for Success
          </h2>
          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
            From community building to progress tracking — discover the tools
            designed for student wellness, collaboration, and growth.
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
            marketplaceImage={communityImage}
            farmersImage={wellnessImage}
          />
        </div>
      </div>
    </div>
  );
};

export default Services;
