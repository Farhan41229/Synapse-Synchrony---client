import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  Bell,
  CheckSquare,
  Download,
  LineChart,
  Mail,
  Users,
} from 'lucide-react';

const partnerBenefits = [
  {
    icon: Users,
    title: 'Build Consistency',
    description:
      'Track your daily habits effortlessly and maintain consistency to achieve your personal goals.',
  },
  {
    icon: CheckSquare,
    title: 'Monitor Progress',
    description:
      'Visualize your habit completion history and monitor your streaks over time for better motivation.',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    description:
      'Set reminders for each habit and never miss a day, keeping your productivity on track.',
  },
  {
    icon: LineChart,
    title: 'Analyze Growth',
    description:
      'Get insights into your habit performance and see how your routines improve your productivity.',
  },
];

const BecomePartner = () => {
  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      easing: 'ease-in-out',
      offset: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <div className="py-20 md:py-24 min-h-screen flex items-center overflow-hidden bg-white dark:bg-[#111827] text-gray-900 dark:text-gray-100">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div
          className="text-center mb-16"
          data-aos="fade-up"
          data-aos-duration="900"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Become a Partner
          </h2>
          <p className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto text-gray-900 dark:text-gray-400">
            Join our global ecosystem of innovators, organizations, and experts
            dedicated to transforming modern agriculture sustainably.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {partnerBenefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="group relative flex flex-col items-center text-center rounded-2xl p-8 shadow-lg hover:shadow-lg transition-all duration-300 bg-white/10 dark:bg-white/20 border border-gray-100 dark:border-white/20 backdrop-blur-md"
                data-aos="fade-up"
                data-aos-delay={index * 100}
                data-aos-duration="900"
              >
                {/* Icon */}
                <div className="w-16 h-16 rounded-xl bg-green-700 flex items-center justify-center mb-5 shadow-md transform transition-transform duration-300 group-hover:scale-110">
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 transition-colors duration-300 group-hover:text-green-700">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-gray-900 dark:text-gray-400">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Call-to-Action Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-5 justify-center"
          data-aos="fade-up"
          data-aos-delay={400}
          data-aos-duration="900"
        >
          <button className="inline-flex items-center justify-center bg-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:bg-green-800 transition-all duration-300">
            <Mail className="h-5 w-5 mr-2" />
            Partner With Us
          </button>
          <button className="inline-flex items-center justify-center bg-transparent border-2 border-green-700 text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-700 hover:text-white transition-all duration-300">
            <Download className="h-5 w-5 mr-2" />
            Partnership Guide
          </button>
        </div>
      </div>
    </div>
  );
};

export default BecomePartner;
