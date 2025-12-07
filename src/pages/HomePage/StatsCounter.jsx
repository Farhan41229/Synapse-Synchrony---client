import React from 'react';
import CountUp from 'react-countup';

const StatsCounter = ({ themeForegroundStyle }) => {
  const stats = [
    { value: 90, label: 'Student Engagement', suffix: '%' },
    { value: 75, label: 'Academic Progress', suffix: '%' },
    { value: 85, label: 'Wellness Improvement', suffix: '%' },
    { value: 24, label: 'Mentor Support', suffix: '/7' },
  ];


  return (
    <div
      className={`${themeForegroundStyle} rounded-2xl p-6 shadow-sm hover:shadow-lg 
      bg-white/10 backdrop-blur-md border border-white/20`}
      data-aos="fade-up"
      data-aos-duration="900"
    >
      <div className="grid grid-cols-2 gap-6 text-center">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            data-aos="zoom-in"
            data-aos-delay={idx * 150}
            data-aos-duration="900"
          >
            {/* Counter */}
            <div className="text-2xl font-bold mb-1">
              <CountUp
                start={0}
                end={stat.value}
                duration={2}
                suffix={stat.suffix}
                enableScrollSpy
                scrollSpyOnce
              />
            </div>

            {/* Label */}
            <div className="text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCounter;
