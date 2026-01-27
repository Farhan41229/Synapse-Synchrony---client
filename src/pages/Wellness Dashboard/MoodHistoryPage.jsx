import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { medilinkService } from '@/services/medilinkService';
import {
  Heart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Smile,
  Meh,
  Frown,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function MoodHistoryPage() {
  const [timeRange, setTimeRange] = useState(30);

  const { data: moodData, isLoading } = useQuery({
    queryKey: ['mood-history', timeRange],
    queryFn: () => medilinkService.getMoodHistory({ days: timeRange }),
  });

  const entries = moodData?.data?.entries || [];
  const statistics = moodData?.data?.statistics;

  const getMoodIcon = (rating) => {
    if (rating >= 7) return <Smile className="w-5 h-5 text-green-500" />;
    if (rating >= 4) return <Meh className="w-5 h-5 text-yellow-500" />;
    return <Frown className="w-5 h-5 text-red-500" />;
  };

  const getMoodColor = (rating) => {
    if (rating >= 7) return 'bg-green-500';
    if (rating >= 4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Heart className="w-8 h-8 text-pink-500" />
            Mood History
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your emotional journey over time
          </p>
        </div>
        <div className="flex gap-2">
          {[7, 14, 30, 60].map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === days
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {days}d
            </button>
          ))}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 dark:text-gray-400 font-normal">
              Average Mood
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                {statistics?.averageMoodRating?.toFixed(1) || '0.0'}
                <span className="text-lg text-gray-500">/10</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getMoodColor(
                    statistics?.averageMoodRating || 0
                  )} transition-all`}
                  style={{
                    width: `${(statistics?.averageMoodRating || 0) * 10}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 dark:text-gray-400 font-normal">
              Total Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900 dark:text-white">
              {statistics?.totalEntries || 0}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {statistics?.timeRange || 'Last 30 days'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 dark:text-gray-400 font-normal">
              Most Common Mood
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {statistics?.moodDistribution &&
              Object.keys(statistics.moodDistribution).length > 0 ? (
                <>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                    {
                      Object.entries(statistics.moodDistribution).sort(
                        ([, a], [, b]) => b - a
                      )[0][0]
                    }
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {
                      Object.entries(statistics.moodDistribution).sort(
                        ([, a], [, b]) => b - a
                      )[0][1]
                    }{' '}
                    times
                  </p>
                </>
              ) : (
                <p className="text-gray-500">No data</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mood Distribution */}
      {statistics?.moodDistribution &&
        Object.keys(statistics.moodDistribution).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-pink-500" />
                Emotion Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(statistics.moodDistribution)
                  .sort(([, a], [, b]) => b - a)
                  .map(([emotion, count]) => (
                    <div key={emotion} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                          {emotion}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {count} times
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all"
                          style={{
                            width: `${
                              (count / statistics.totalEntries) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Mood Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-pink-500" />
            Mood Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length > 0 ? (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry._id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-pink-500/50 transition-colors"
                >
                  <div className="mt-1">{getMoodIcon(entry.moodRating)}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {entry.moodRating}/10
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {entry.emotions.map((emotion, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs"
                            >
                              {emotion}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(entry.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {entry.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {entry.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Mood Data Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start chatting with Medilink AI to track your mood over time
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
