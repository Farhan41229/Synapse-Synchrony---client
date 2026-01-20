// Skeleton Loader Component
export const SkeletonLoader = () => (
  <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button Skeleton */}
      <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg mb-8 animate-pulse" />

      {/* Header Skeleton */}
      <div className="mb-8 space-y-4">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
      </div>

      {/* Author & Meta Skeleton */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
      </div>

      {/* Image Skeleton */}
      <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl mb-8 animate-pulse" />

      {/* Content Skeleton */}
      <div className="space-y-4 mb-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"
            style={{ width: i === 6 ? '60%' : '100%' }}
          />
        ))}
      </div>

      {/* Tags Skeleton */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"
          />
        ))}
      </div>
    </div>
  </div>
);
