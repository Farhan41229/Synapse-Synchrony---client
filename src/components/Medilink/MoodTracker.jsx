import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  TrendingUp,
  Calendar,
  Activity,
  Target,
  Smile,
  Frown,
  Meh,
} from 'lucide-react';

// Mock data for demonstration
const moodData = {
  daily: [
    {
      day: 'Mon',
      value: 65,
      activities: [
        { name: 'Exercise', duration: '30min', impact: 'positive' },
        { name: 'Meditation', duration: '15min', impact: 'positive' },
      ],
      energy: 70,
      sleep: 7.5,
    },
    {
      day: 'Tue',
      value: 75,
      activities: [
        { name: 'Therapy', duration: '1hr', impact: 'positive' },
        { name: 'Reading', duration: '45min', impact: 'neutral' },
      ],
      energy: 75,
      sleep: 8,
    },
    {
      day: 'Wed',
      value: 70,
      activities: [{ name: 'Journaling', duration: '20min', impact: 'positive' }],
      energy: 68,
      sleep: 7,
    },
    {
      day: 'Thu',
      value: 80,
      activities: [
        { name: 'Yoga', duration: '45min', impact: 'positive' },
        { name: 'Music', duration: '30min', impact: 'positive' },
      ],
      energy: 82,
      sleep: 8.5,
    },
    {
      day: 'Fri',
      value: 85,
      activities: [{ name: 'Social Time', duration: '2hr', impact: 'positive' }],
      energy: 88,
      sleep: 8,
    },
    {
      day: 'Sat',
      value: 90,
      activities: [
        { name: 'Nature Walk', duration: '1hr', impact: 'positive' },
        { name: 'Cooking', duration: '45min', impact: 'positive' },
      ],
      energy: 90,
      sleep: 9,
    },
    {
      day: 'Sun',
      value: 78,
      activities: [{ name: 'Relaxation', duration: '3hr', impact: 'neutral' }],
      energy: 75,
      sleep: 8,
    },
  ],
  insights: [
    {
      title: 'Weekly Progress',
      description: 'Your mood stability has improved by 15% this week',
      trend: 'up',
    },
    {
      title: 'Activity Impact',
      description: 'Exercise and meditation show the most positive impact',
      trend: 'up',
    },
  ],
};

const getMoodEmoji = (value) => {
  if (value >= 80) return { icon: Smile, color: 'text-green-500' };
  if (value >= 60) return { icon: Meh, color: 'text-yellow-500' };
  return { icon: Frown, color: 'text-red-500' };
};

const getImpactColor = (impact) => {
  switch (impact) {
    case 'positive':
      return 'bg-green-500/10 text-green-500';
    case 'negative':
      return 'bg-red-500/10 text-red-500';
    default:
      return 'bg-yellow-500/10 text-yellow-500';
  }
};

export default function MoodTracker() {
  const [selectedDay, setSelectedDay] = useState(null);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <Brain className="h-5 w-5 text-[#04642a]" />
              Mood Insights
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your emotional journey over time
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm border border-[#04642a]/20 bg-[#04642a]/5 text-[#04642a] rounded-lg font-medium">
              Week
            </button>
            <button className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              Month
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Daily Mood Chart */}
        <div className="space-y-4">
          <div className="h-[200px] flex items-end justify-between gap-2">
            {moodData.daily.map((day, index) => (
              <div
                key={day.day}
                className="flex flex-col items-center space-y-2 group flex-1 relative"
                onClick={() => setSelectedDay(selectedDay === index ? null : index)}
              >
                <AnimatePresence>
                  {selectedDay === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg w-64 space-y-3 border border-gray-200 dark:border-gray-600 z-10"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {day.day}'s Activities
                        </h4>
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4 text-[#04642a]" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {day.value}%
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {day.activities.map((activity, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`p-1.5 rounded-md ${getImpactColor(
                                  activity.impact
                                )}`}
                              >
                                <Activity className="w-3 h-3" />
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {activity.name}
                              </span>
                            </div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {activity.duration}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                        <div className="text-center">
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Energy
                          </p>
                          <div className="h-1 bg-gray-200 dark:bg-gray-600 rounded-full mt-1">
                            <div
                              className="h-1 bg-[#04642a] rounded-full"
                              style={{ width: `${day.energy}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Sleep
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {day.sleep}hrs
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative w-full cursor-pointer">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${day.value}%` }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-full rounded-t-lg bg-gradient-to-t from-[#04642a]/20 to-[#04642a]/30 group-hover:from-[#04642a]/30 group-hover:to-[#04642a]/40 transition-all absolute bottom-0 ${
                      selectedDay === index ? 'ring-2 ring-[#04642a]' : ''
                    }`}
                  >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      {React.createElement(getMoodEmoji(day.value).icon, {
                        className: `w-4 h-4 ${getMoodEmoji(day.value).color}`,
                      })}
                    </div>
                  </motion.div>
                </div>
                <span
                  className={`text-sm font-medium transition-colors ${
                    selectedDay === index
                      ? 'text-[#04642a]'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {day.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {moodData.insights.map((insight, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-[#04642a]/5 space-y-2"
            >
              <div className="flex items-center gap-2">
                {insight.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <Calendar className="w-4 h-4 text-yellow-500" />
                )}
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {insight.title}
                </h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {insight.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
