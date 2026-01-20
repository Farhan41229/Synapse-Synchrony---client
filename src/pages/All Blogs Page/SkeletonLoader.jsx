export const SkeletonLoader = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-gray-200 dark:bg-gray-800 h-48 rounded-t-xl" />
        <div className="bg-white dark:bg-gray-900 p-6 rounded-b-xl border border-gray-200 dark:border-gray-700">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-3" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mb-3" />
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
);
