import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
  Droplets,
  DollarSign,
  Zap,
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const StudentSuccessStoriesSection = () => {
  const [currentStory, setCurrentStory] = useState(0);

  const stories = [
    {
      name: 'Sarah Johnson',
      location: 'Iowa, USA',
      specialty: 'Wellness & Habit Building',
      photo:
        'https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg?auto=compress&cs=tinysrgb&w=300',
      quote:
        'Using this platform has transformed my daily routine. I’m now able to achieve both my academic and wellness goals consistently!',
      results: [
        { metric: 'Habits Created', value: '12', icon: TrendingUp },
        { metric: 'Streak Maintained', value: '7 days', icon: Droplets },
        { metric: 'Goals Achieved', value: '90%', icon: DollarSign },
        { metric: 'Time Saved', value: '5 hrs/week', icon: Zap },
      ],
    },
    {
      name: 'Miguel Rodriguez',
      location: 'California, USA',
      specialty: 'Fitness & Productivity',
      photo:
        'https://images.pexels.com/photos/1484799/pexels-photo-1484799.jpeg?auto=compress&cs=tinysrgb&w=300',
      quote:
        'This platform keeps me accountable and motivates me to stick to my daily goals. I’m more focused than ever!',
      results: [
        { metric: 'Habits Created', value: '18', icon: TrendingUp },
        { metric: 'Streak Maintained', value: '14 days', icon: Droplets },
        { metric: 'Goals Achieved', value: '85%', icon: DollarSign },
        { metric: 'Time Saved', value: '8 hrs/week', icon: Zap },
      ],
    },
    {
      name: 'Emily Chen',
      location: 'Oregon, USA',
      specialty: 'Mindfulness & Wellness',
      photo:
        'https://images.pexels.com/photos/1122868/pexels-photo-1122868.jpeg?auto=compress&cs=tinysrgb&w=300',
      quote:
        'Tracking my habits with this platform has helped me become more mindful, and I’m seeing improvements in both my studies and personal life.',
      results: [
        { metric: 'Habits Created', value: '10', icon: TrendingUp },
        { metric: 'Streak Maintained', value: '21 days', icon: Droplets },
        { metric: 'Goals Achieved', value: '95%', icon: DollarSign },
        { metric: 'Time Saved', value: '6 hrs/week', icon: Zap },
      ],
    },
    {
      name: 'James Lee',
      location: 'New York, USA',
      specialty: 'Professional Development',
      photo:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
      quote:
        'This platform helps me stay on top of my professional goals and routines. It’s an essential tool for my personal and academic success.',
      results: [
        { metric: 'Habits Created', value: '15', icon: TrendingUp },
        { metric: 'Streak Maintained', value: '30 days', icon: Droplets },
        { metric: 'Goals Achieved', value: '92%', icon: DollarSign },
        { metric: 'Time Saved', value: '10 hrs/week', icon: Zap },
      ],
    },
  ];

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      easing: 'ease-in-out',
      offset: 100,
    });
    AOS.refresh();
  }, []);

  const nextStory = () =>
    setCurrentStory((prev) => (prev + 1) % stories.length);
  const prevStory = () =>
    setCurrentStory((prev) => (prev - 1 + stories.length) % stories.length);

  const currentStudent = stories[currentStory];

  return (
    <div
      id="student-stories"
      className="bg-white dark:bg-[#111827] text-gray-900 dark:text-gray-100 py-20 md:py-24 overflow-hidden min-h-screen flex items-center transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Student Success Stories
          </h2>
          <p className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
            Real students, real results. See how our platform is transforming
            their daily routines, academic progress, and well-being.
          </p>
        </div>

        {/* Story Card */}
        <div
          className="rounded-2xl p-6 md:p-12 
          bg-white dark:bg-white/10 
          border border-gray-200 dark:border-white/10 
          shadow-xl dark:shadow-none
          backdrop-blur-md transition-all duration-300"
          data-aos="fade-up"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: User Info */}
            <div
              className="text-center lg:text-left"
              data-aos="fade-right"
              data-aos-delay="100"
            >
              <div className="flex flex-col lg:flex-row items-center lg:items-start mb-6">
                <img
                  src={currentStudent.photo}
                  alt={currentStudent.name}
                  className="w-24 h-24 rounded-full object-cover mb-4 lg:mb-0 lg:mr-6 border-4 border-[#15a33d] shadow-lg"
                />
                <div>
                  <h3 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">
                    {currentStudent.name}
                  </h3>
                  <p className="mb-1 text-gray-500 dark:text-gray-300">
                    {currentStudent.location}
                  </p>
                  <p className="text-[#15a33d] font-semibold">
                    {currentStudent.specialty}
                  </p>
                  <div className="flex items-center justify-center lg:justify-start mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      5.0 Rating
                    </span>
                  </div>
                </div>
              </div>

              <blockquote className="text-lg sm:text-xl italic mb-8 leading-relaxed text-gray-700 dark:text-gray-200">
                "{currentStudent.quote}"
              </blockquote>

              <div className="flex justify-center lg:justify-start space-x-4">
                <button
                  onClick={prevStory}
                  className="bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-600 dark:text-gray-100 p-3 rounded-full hover:bg-[#15a33d] hover:text-white hover:border-[#15a33d] shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextStory}
                  className="bg-[#15a33d] text-white p-3 rounded-full hover:bg-[#0d9132] shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Right: Results */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {currentStudent.results.map((result, index) => {
                const Icon = result.icon;
                return (
                  <div
                    key={index}
                    className="rounded-xl p-4 sm:p-6 text-center 
                    bg-gray-50 dark:bg-white/10 
                    border border-gray-200 dark:border-white/10 
                    backdrop-blur-md hover:shadow-lg dark:hover:shadow-[0_10px_30px_rgba(23, 97, 41, 0.2)] 
                    transition-all duration-300 group"
                    data-aos="zoom-in"
                    data-aos-delay={index * 100}
                  >
                    <div className="bg-[#15a33d]/10 dark:bg-[#15a33d]/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6 text-[#15a33d]" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {result.value}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {result.metric}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center mt-8" data-aos="fade-up">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStory(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 mx-1 ${
                  index === currentStory
                    ? 'bg-[#15a33d]'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSuccessStoriesSection;
