import React from 'react';
import { useNavigate } from 'react-router';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8 relative">
          <h1 className="text-[180px] sm:text-[220px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#04642a] to-[#058a38] leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-20 h-20 sm:w-24 sm:h-24 text-gray-300 dark:text-gray-700 animate-pulse" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4 mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Page Not Found
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 font-medium min-w-[180px] justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#04642a] to-[#058a38] text-white hover:from-[#035a24] hover:to-[#047830] transition-all duration-200 font-medium shadow-lg hover:shadow-xl min-w-[180px] justify-center"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
            Quick links to get you back on track:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-[#04642a] dark:text-emerald-400 hover:underline font-medium"
            >
              Dashboard
            </button>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <button
              type="button"
              onClick={() => navigate('/blog')}
              className="text-[#04642a] dark:text-emerald-400 hover:underline font-medium"
            >
              Blog
            </button>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <button
              type="button"
              onClick={() => navigate('/medilink')}
              className="text-[#04642a] dark:text-emerald-400 hover:underline font-medium"
            >
              Medilink
            </button>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <button
              type="button"
              onClick={() => navigate('/about')}
              className="text-[#04642a] dark:text-emerald-400 hover:underline font-medium"
            >
              About Us
            </button>
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="text-[#04642a] dark:text-emerald-400 hover:underline font-medium"
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
