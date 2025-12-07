import React from 'react';
import { Users, TrendingUp, CheckSquare } from 'lucide-react';
import CountUp from 'react-countup';

const stats = [
  {
    icon: <Users className="w-5 h-5 text-[#15a33d]" />,
    value: 10000,
    suffix: '+',
    label: 'Connected Students',
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-[#15a33d]" />,
    value: 500,
    suffix: '+',
    label: 'Collaborations',
  },
  {
    icon: <CheckSquare className="w-5 h-5 text-[#15a33d]" />,
    value: 98,
    suffix: '%',
    label: 'Engagement Rate',
  },
];


const QuickStats = () => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="text-center lg:text-left transition-transform duration-300 hover:scale-105 group"
        >
          <div className="flex items-center gap-2 mb-1 justify-center lg:justify-start">
            <div className="transform group-hover:scale-110 transition-transform">
              {stat.icon}
            </div>
            {/* Adaptive Text Color */}
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              <CountUp end={stat.value} duration={2} suffix={stat.suffix} />
            </p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
