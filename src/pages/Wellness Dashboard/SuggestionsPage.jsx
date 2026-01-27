import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { medilinkService } from '@/services/medilinkService';
import {
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Calendar,
  TrendingUp,
  Heart,
  Activity,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import toast from 'react-hot-toast';

export default function SuggestionsPage() {
  const [filter, setFilter] = useState('all'); // all, unread
  const queryClient = useQueryClient();

  const { data: suggestionsData, isLoading } = useQuery({
    queryKey: ['wellness-suggestions', filter],
    queryFn: () =>
      medilinkService.getWellnessSuggestions({
        unreadOnly: filter === 'unread',
      }),
  });

  const markViewedMutation = useMutation({
    mutationFn: (suggestionId) =>
      medilinkService.markSuggestionViewed(suggestionId),
    onSuccess: () => {
      queryClient.invalidateQueries(['wellness-suggestions']);
      toast.success('Suggestion marked as viewed');
    },
    onError: () => {
      toast.error('Failed to mark suggestion as viewed');
    },
  });

  const suggestions = suggestionsData?.data?.suggestions || [];
  const totalCount = suggestionsData?.data?.totalCount || 0;
  const unreadCount = suggestionsData?.data?.unreadCount || 0;

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'moderate':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const getTriggerIcon = (trigger) => {
    if (trigger.includes('mood')) return <Heart className="w-4 h-4" />;
    if (trigger.includes('stress')) return <Activity className="w-4 h-4" />;
    return <TrendingUp className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <Lightbulb className="w-8 h-8 text-yellow-500" />
            Wellness Suggestions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            AI-generated personalized wellness tips
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 dark:text-gray-400 font-normal">
              Total Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900 dark:text-white">
              {totalCount}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Personalized wellness tips
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600 dark:text-gray-400 font-normal">
              Unread Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-yellow-500">
              {unreadCount}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              New suggestions waiting
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Suggestions List */}
      <div className="space-y-4">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion) => (
            <Card
              key={suggestion._id}
              className={`${
                !suggestion.isViewed
                  ? 'border-2 border-yellow-500/50'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getUrgencyColor(suggestion.urgency)}>
                        {suggestion.urgency} priority
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {getTriggerIcon(suggestion.triggeredBy)}
                        <span className="ml-1">
                          {suggestion.triggeredBy.replace('_', ' ')}
                        </span>
                      </Badge>
                      {!suggestion.isViewed && (
                        <Badge variant="secondary">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(suggestion.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {!suggestion.isViewed && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markViewedMutation.mutate(suggestion._id)}
                      disabled={markViewedMutation.isPending}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Mark as Read
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Context */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Mood at Time
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {suggestion.moodAtTime?.mood || 'N/A'}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {suggestion.moodAtTime?.intensity || 0}/10
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Stress Level
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          suggestion.stressAtTime?.level >= 7
                            ? 'bg-red-500'
                            : suggestion.stressAtTime?.level >= 4
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                        }
                      >
                        {suggestion.stressAtTime?.level || 0}/10
                      </Badge>
                      {suggestion.stressAtTime?.stressors &&
                        suggestion.stressAtTime.stressors.length > 0 && (
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {suggestion.stressAtTime.stressors.slice(0, 2).join(', ')}
                          </span>
                        )}
                    </div>
                  </div>
                </div>

                {/* Reasoning */}
                {suggestion.reasoning && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-900 dark:text-blue-300 italic">
                      {suggestion.reasoning}
                    </p>
                  </div>
                )}

                {/* Suggestions */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    Recommended Actions:
                  </p>
                  <ul className="space-y-2">
                    {suggestion.suggestions.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Lightbulb className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Suggestions Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {filter === 'unread'
                    ? 'All suggestions have been read'
                    : 'Start chatting with Medilink AI to receive personalized wellness suggestions'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
