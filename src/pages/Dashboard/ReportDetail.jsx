import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportService } from '@/services/reportService';
import toast from 'react-hot-toast';
import { confirmDelete } from '@/lib/swal';
import {
  ChevronLeft,
  FileText,
  File,
  FileImage,
  Loader2,
  Save,
  Trash2,
  Pencil,
  Check,
  X,
} from 'lucide-react';
import { format } from 'date-fns';

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [textDraft, setTextDraft] = useState('');
  const [textChanged, setTextChanged] = useState(false);

  const { data: res, isLoading, error } = useQuery({
    queryKey: ['report', id],
    queryFn: () => reportService.getReportById(id),
  });

  const report = res?.data;

  useEffect(() => {
    if (report) {
      setTitleDraft(report.title);
      setTextDraft(report.extractedText);
      setTextChanged(false);
    }
  }, [report]);

  const updateMutation = useMutation({
    mutationFn: (payload) => reportService.updateReport(id, payload),
    onSuccess: (res) => {
      toast.success('Report saved');
      setTextChanged(false);
      queryClient.setQueryData(['report', id], res);
      queryClient.invalidateQueries({ queryKey: ['my-reports'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to save');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => reportService.deleteReport(id),
    onSuccess: () => {
      toast.success('Report deleted');
      queryClient.invalidateQueries({ queryKey: ['my-reports'] });
      navigate('/dashboard/reports');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete');
    },
  });

  const handleTitleSave = () => {
    if (!titleDraft.trim()) return;
    updateMutation.mutate({ title: titleDraft.trim(), extractedText: textDraft });
    setEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTitleDraft(report?.title || '');
    setEditingTitle(false);
  };

  const handleTextChange = (e) => {
    setTextDraft(e.target.value);
    setTextChanged(e.target.value !== report?.extractedText);
  };

  const handleSaveText = () => {
    updateMutation.mutate({ title: titleDraft.trim(), extractedText: textDraft });
  };

  const handleDelete = async () => {
    const result = await confirmDelete({ text: 'Delete this report? This cannot be undone.' });
    if (result.isConfirmed) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
        <div className="max-w-3xl mx-auto text-center py-20">
          <FileText className="w-14 h-14 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Report not found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            This report may have been deleted or you don't have access.
          </p>
          <button
            type="button"
            onClick={() => navigate('/dashboard/reports')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium text-sm transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Reports
          </button>
        </div>
      </div>
    );
  }

  const isPdf = report.fileType === 'pdf';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => navigate('/dashboard/reports')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            My Reports
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Delete
          </button>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm overflow-hidden">
          {/* Card header */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700/60">
            {/* Title row */}
            <div className="flex items-start gap-3 mb-3">
              <div
                className={`p-2.5 rounded-xl shrink-0 ${isPdf ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}
              >
                {isPdf ? (
                  <File className="w-5 h-5 text-red-600 dark:text-red-400" />
                ) : (
                  <FileImage className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                {editingTitle ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={titleDraft}
                      onChange={(e) => setTitleDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleTitleSave();
                        if (e.key === 'Escape') handleTitleCancel();
                      }}
                      autoFocus
                      className="flex-1 text-lg font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-violet-500 focus:outline-none pb-0.5"
                    />
                    <button
                      type="button"
                      onClick={handleTitleSave}
                      disabled={updateMutation.isPending}
                      className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleTitleCancel}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group">
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">
                      {report.title}
                    </h1>
                    <button
                      type="button"
                      onClick={() => setEditingTitle(true)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
                      title="Edit title"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-3 ml-[52px]">
              <span
                className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                  isPdf
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}
              >
                {report.fileType?.toUpperCase() || 'FILE'}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Extracted {report.createdAt ? format(new Date(report.createdAt), 'MMM dd, yyyy · h:mm a') : ''}
              </span>
            </div>
          </div>

          {/* Extracted text */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Extracted Text
              </p>
              {textChanged && (
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  Unsaved changes
                </span>
              )}
            </div>
            <textarea
              value={textDraft}
              onChange={handleTextChange}
              rows={20}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 resize-y transition-colors"
            />
            {textChanged && (
              <button
                type="button"
                onClick={handleSaveText}
                disabled={updateMutation.isPending}
                className="mt-4 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#04642a] hover:bg-[#035a24] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors shadow-sm"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
