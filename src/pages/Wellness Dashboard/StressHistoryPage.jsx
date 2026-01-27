import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { medilinkService } from '@/services/medilinkService';
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  Calendar,
  AlertCircle,
  Zap,
  Brain,
  Heart,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function StressHistoryPage() {
  const [timeRange, setTimeRange] = useState(30);

  const { data: stressData, isLoading } = useQuery({
    queryKey: ['stress-history', timeRange],
    queryFn: () => medilinkService.getStressHistory({ days: timeRange }),
  });

  const entries = stressData?.data?.entries || [];
  const statistics = stressData?.data?.statistics;

  const getStressColor = (level) => {
    if (level >= 7) return 'bg-red-500 text-red-500';
    if (level >= 4) return 'bg-yellow-500 text-yellow-500';
    return 'bg-green-500 text-green-500';
  };

  const getStressLabel = (level) => {
    if (level >= 7) return 'High';
    if (level >= 4) return 'Moderate';
    return 'Low';
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
            <Activity className="w-8 h-8 text-orange-500" />
            Stress History
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor your stress levels over time
          </p>
        </div>
        <div className="flex gap-2">
          {[7, 14, 30, 60].map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === days
                  ? 'bg-orange-500 text-white'
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
              Average Stress Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-gray-900 dark:text-white">
                {statistics?.averageStressLevel?.toFixed(1) || '0.0'}
                <span className="text-lg text-gray-500">/10</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${getStressColor(
                    statistics?.averageStressLevel || 0
                  ).split(' ')[0]}`}
                  style={{
                    width: `${(statistics?.averageStressLevel || 0) * 10}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 dark:text-gray-400 font-normal">
              High Stress Instances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-red-500">
                {statistics?.highStressInstances || 0}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Stress level ≥ 7
              </p>
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
      </div>

      {/* Common Stressors */}
      {statistics?.commonStressors &&
        Object.keys(statistics.commonStressors).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Most Common Stressors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(statistics.commonStressors)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([stressor, count]) => (
                    <div key={stressor} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                          {stressor}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {count} times
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all"
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

      {/* Stress Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            Stress Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length > 0 ? (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry._id}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    entry.stressLevel >= 7
                      ? 'border-red-500/50 bg-red-50 dark:bg-red-900/10'
                      : entry.stressLevel >= 4
                        ? 'border-yellow-500/50 bg-yellow-50 dark:bg-yellow-900/10'
                        : 'border-green-500/50 bg-green-50 dark:bg-green-900/10'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`text-2xl font-bold ${
                            getStressColor(entry.stressLevel).split(' ')[1]
                          }`}
                        >
                          {entry.stressLevel}/10
                        </div>
                        <Badge
                          className={getStressColor(entry.stressLevel)}
                        >
                          {getStressLabel(entry.stressLevel)} Stress
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(entry.timestamp).toLocaleString()}
                      </p>
                    </div>

                    {/* Stressors */}
                    {entry.stressors && entry.stressors.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Stressors:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {entry.stressors.map((stressor, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs"
                            >
                              <Zap className="w-3 h-3 mr-1" />
                              {stressor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Signs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                      {/* Physiological */}
                      {entry.physiologicalSigns &&
                        entry.physiologicalSigns.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              Physical
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {entry.physiologicalSigns.map((sign, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {sign}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Emotional */}
                      {entry.emotionalSigns &&
                        entry.emotionalSigns.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                              <Brain className="w-3 h-3" />
                              Emotional
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {entry.emotionalSigns.map((sign, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {sign}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Behavioral */}
                      {entry.behavioralSigns &&
                        entry.behavioralSigns.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                              <Activity className="w-3 h-3" />
                              Behavioral
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {entry.behavioralSigns.map((sign, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {sign}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>

                    {/* Context */}
                    {entry.context && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                        "{entry.context}"
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
                No Stress Data Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start chatting with Medilink AI to track your stress levels
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
