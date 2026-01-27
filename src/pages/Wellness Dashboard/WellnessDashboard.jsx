import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { medilinkService } from '@/services/medilinkService';
import {
  Brain,
  Heart,
  TrendingUp,
  TrendingDown,
  Activity,
  Lightbulb,
  AlertCircle,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function WellnessDashboard() {
  const [timeRange, setTimeRange] = useState(7);

  const { data: wellnessData, isLoading } = useQuery({
    queryKey: ['wellness-summary', timeRange],
    queryFn: () => medilinkService.getWellnessSummary(timeRange),
  });

  const summary = wellnessData?.data?.summary;
  const trends = wellnessData?.data?.trends;
  const suggestions = wellnessData?.data?.recentSuggestions;

  const getWellnessColor = (score) => {
    if (score >= 75) return 'text-green-500 bg-green-500/10';
    if (score >= 50) return 'text-yellow-500 bg-yellow-500/10';
    return 'text-red-500 bg-red-500/10';
  };

  const getWellnessLabel = (score) => {
    if (score >= 75) return 'Excellent';
    if (score >= 50) return 'Good';
    if (score >= 25) return 'Fair';
    return 'Needs Attention';
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
            <Brain className="w-8 h-8 text-[#04642a]" />
            Wellness Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your mental health journey
          </p>
        </div>
        <div className="flex gap-2">
          {[7, 14, 30].map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === days
                  ? 'bg-[#04642a] text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Wellness Score Card */}
      <Card className="border-2 border-[#04642a]/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Overall Wellness Score
              </p>
              <div className="flex items-center gap-4">
                <div
                  className={`text-5xl font-bold ${getWellnessColor(
                    summary?.wellnessScore || 0
                  )}`}
                >
                  {summary?.wellnessScore || 0}
                </div>
                <div>
                  <Badge
                    className={getWellnessColor(summary?.wellnessScore || 0)}
                  >
                    {getWellnessLabel(summary?.wellnessScore || 0)}
                  </Badge>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {summary?.timeRange || 'Last 7 days'}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Interactions
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(summary?.totalMoodEntries || 0) +
                    (summary?.totalStressEntries || 0)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mood Card */}
        <Link to="/dashboard/wellness/mood-history">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  Average Mood
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#04642a] transition-colors" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {summary?.averageMood?.toFixed(1) || '0.0'}
                  <span className="text-lg text-gray-500">/10</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all"
                    style={{ width: `${(summary?.averageMood || 0) * 10}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {summary?.totalMoodEntries || 0} mood entries
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Stress Card */}
        <Link to="/dashboard/wellness/stress-history">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-500" />
                  Average Stress
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#04642a] transition-colors" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {summary?.averageStress?.toFixed(1) || '0.0'}
                  <span className="text-lg text-gray-500">/10</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all"
                    style={{
                      width: `${(summary?.averageStress || 0) * 10}%`,
                    }}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {summary?.totalStressEntries || 0} stress entries
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Suggestions Card */}
        <Link to="/dashboard/wellness/suggestions">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Suggestions
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#04642a] transition-colors" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {suggestions?.length || 0}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Recent wellness tips
                </p>
                {suggestions && suggestions.length > 0 && (
                  <Badge
                    variant={
                      suggestions[0].urgency === 'high'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {suggestions[0].urgency} priority
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Trends Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-pink-500" />
              Recent Mood Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {trends?.mood && trends.mood.length > 0 ? (
              <div className="space-y-3">
                {trends.mood.slice(0, 5).map((entry, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex gap-1">
                          {entry.emotions?.slice(0, 3).map((emotion, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs"
                            >
                              {emotion}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {entry.rating}/10
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No mood data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stress Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              Recent Stress Levels
            </CardTitle>
          </CardHeader>
          <CardContent>
            {trends?.stress && trends.stress.length > 0 ? (
              <div className="space-y-3">
                {trends.stress.slice(0, 5).map((entry, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-1 mb-1">
                        {entry.stressors?.slice(0, 3).map((stressor, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-xs"
                          >
                            {stressor}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-lg font-bold ${
                          entry.level >= 7
                            ? 'text-red-500'
                            : entry.level >= 4
                              ? 'text-yellow-500'
                              : 'text-green-500'
                        }`}
                      >
                        {entry.level}/10
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No stress data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Recent Wellness Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestions.slice(0, 3).map((suggestion, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <Badge
                      variant={
                        suggestion.urgency === 'high'
                          ? 'destructive'
                          : suggestion.urgency === 'moderate'
                            ? 'default'
                            : 'secondary'
                      }
                    >
                      {suggestion.urgency} priority
                    </Badge>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {new Date(suggestion.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {suggestion.suggestions.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <span className="text-[#04642a] mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    Triggered by: {suggestion.triggeredBy.replace('_', ' ')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
