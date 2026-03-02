import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportService } from '@/services/reportService';
import toast from 'react-hot-toast';
import { confirmDelete } from '@/lib/swal';
import { FileText, Upload, Search, Trash2, FileImage, File, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

const MyReports = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['my-reports', search],
    queryFn: () => reportService.getMyReports(search),
    select: (res) => res.data || [],
  });

  const deleteMutation = useMutation({
    mutationFn: reportService.deleteReport,
    onSuccess: () => {
      toast.success('Report deleted');
      queryClient.invalidateQueries({ queryKey: ['my-reports'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete report');
    },
  });

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const result = await confirmDelete({ text: 'Delete this report? This cannot be undone.' });
    if (result.isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  const reports = data || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
              <FileText className="w-7 h-7 text-violet-600 dark:text-violet-400" />
              My Reports
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Extracted text from your uploaded documents
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard/reports/extract')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium text-sm transition-colors shadow-sm"
          >
            <Upload className="w-4 h-4" />
            Extract Report
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 transition-colors"
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-40 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 animate-pulse"
              />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-violet-500 dark:text-violet-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {search ? 'No reports found' : 'No reports yet'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
              {search
                ? 'Try a different search term.'
                : 'Upload an image or PDF to extract its text.'}
            </p>
            {!search && (
              <button
                type="button"
                onClick={() => navigate('/dashboard/reports/extract')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium text-sm transition-colors shadow-sm"
              >
                <Upload className="w-4 h-4" />
                Extract your first report
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reports.map((report) => (
              <button
                key={report._id}
                type="button"
                onClick={() => navigate(`/dashboard/reports/${report._id}`)}
                className="group text-left bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5 hover:border-violet-300 dark:hover:border-violet-700/60 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {report.fileType === 'pdf' ? (
                      <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 shrink-0">
                        <File className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 shrink-0">
                        <FileImage className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors truncate text-sm">
                      {report.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, report._id)}
                    disabled={deleteMutation.isPending}
                    className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed mb-3">
                  {report.extractedText}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        report.fileType === 'pdf'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}
                    >
                      {report.fileType?.toUpperCase() || 'FILE'}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {report.createdAt ? format(new Date(report.createdAt), 'MMM dd, yyyy') : ''}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReports;
