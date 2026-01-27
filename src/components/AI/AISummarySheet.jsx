import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Sparkles, Loader2, Clock, Target, Lightbulb, AlertCircle } from 'lucide-react';

/**
 * Reusable AI Summary Sheet Component
 * Displays AI-generated summaries for blogs and events in a slide-in panel
 * 
 * @param {boolean} isOpen - Whether the sheet is open
 * @param {function} onClose - Function to close the sheet
 * @param {Object} summary - Summary data from AI
 * @param {boolean} isLoading - Whether the summary is being generated
 * @param {Error} error - Error object if summary generation failed
 * @param {string} type - Type of content ('blog' or 'event')
 * @param {string} title - Title of the blog/event
 */
export default function AISummarySheet({
  isOpen,
  onClose,
  summary,
  isLoading,
  error,
  type = 'blog',
  title,
}) {
  const isBlog = type === 'blog';

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl overflow-y-auto p-0">
        <div className="p-6">
          <SheetHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-gradient-to-r from-[#04642a] to-[#15a33d] rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <SheetTitle className="text-xl font-bold">AI Summary</SheetTitle>
            </div>
            <SheetDescription className="text-left">
              AI-generated summary of {isBlog ? 'this blog post' : 'this event'}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-[#04642a] animate-spin mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Generating comprehensive summary...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 text-center mt-2">
                This may take a few moments
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-300 mb-1">
                    Failed to Generate Summary
                  </h3>
                  <p className="text-sm text-red-800 dark:text-red-400">
                    {error.message || 'An error occurred while generating the summary. Please try again.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Summary Content */}
          {summary && !isLoading && !error && (
            <>
              {/* Original Title */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {title}
                </h3>
                <div className="h-px bg-gradient-to-r from-[#04642a] to-[#15a33d]" />
              </div>

              {/* Main Summary */}
              <div className="p-5 bg-gradient-to-br from-[#04642a]/5 to-[#15a33d]/5 dark:from-[#04642a]/10 dark:to-[#15a33d]/10 rounded-xl border border-[#04642a]/20">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-[#04642a]" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Summary
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {summary.summary}
                </p>
              </div>

              {/* Key Points / Highlights */}
              <div className="p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-[#04642a]" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {isBlog ? 'Key Points' : 'Highlights'}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {(isBlog ? summary.keyPoints : summary.highlights)?.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#04642a] text-white rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300 flex-1">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Blog-specific: Reading Time */}
              {isBlog && summary.readingTime && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                      Estimated Reading Time
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-400">
                      {summary.readingTime} {summary.readingTime === 1 ? 'minute' : 'minutes'}
                    </p>
                  </div>
                </div>
              )}

              {/* Event-specific: Target Audience */}
              {!isBlog && summary.targetAudience && (
                <div className="p-5 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-900 dark:text-purple-300">
                      Target Audience
                    </h3>
                  </div>
                  <p className="text-purple-800 dark:text-purple-400">
                    {summary.targetAudience}
                  </p>
                </div>
              )}

              {/* Event-specific: What to Expect */}
              {!isBlog && summary.expectations && summary.expectations.length > 0 && (
                <div className="p-5 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-900 dark:text-green-300 mb-3">
                    What to Expect
                  </h3>
                  <ul className="space-y-2">
                    {summary.expectations.map((expectation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400 mt-1">✓</span>
                        <span className="text-green-800 dark:text-green-400">
                          {expectation}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Event-specific: Prerequisites */}
              {!isBlog && summary.prerequisites && (
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-900 dark:text-orange-300 mb-2">
                    Prerequisites
                  </h3>
                  <p className="text-sm text-orange-800 dark:text-orange-400">
                    {summary.prerequisites}
                  </p>
                </div>
              )}

              {/* AI Disclaimer */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  This summary was generated by AI and may not capture all nuances of the original content.
                  We recommend reading the full {isBlog ? 'blog post' : 'event details'} for complete information.
                </p>
              </div>
            </>
          )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
