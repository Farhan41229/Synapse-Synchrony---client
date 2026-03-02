import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportService } from '@/services/reportService';
import toast from 'react-hot-toast';
import {
  Upload,
  FileText,
  FileImage,
  File,
  X,
  Loader2,
  ChevronLeft,
  Sparkles,
  Save,
} from 'lucide-react';

const ACCEPTED = 'image/jpeg,image/png,image/webp,image/gif,application/pdf';

const ExtractReport = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null); // data URL for images
  const [title, setTitle] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [reportId, setReportId] = useState(null); // set after extraction
  const [isDragging, setIsDragging] = useState(false);

  const extractMutation = useMutation({
    mutationFn: ({ title, fileBase64, mimeType }) =>
      reportService.extractAndSave(title, fileBase64, mimeType),
    onSuccess: (res) => {
      const report = res.data;
      setExtractedText(report.extractedText);
      setReportId(report._id);
      queryClient.invalidateQueries({ queryKey: ['my-reports'] });
      toast.success('Text extracted successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Extraction failed');
    },
  });

  const saveMutation = useMutation({
    mutationFn: ({ id, payload }) => reportService.updateReport(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-reports'] });
      navigate(`/dashboard/reports/${reportId}`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to save changes');
    },
  });

  const readFileAsBase64 = (f) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Strip the data URL prefix: "data:<mime>;base64,"
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });

  const handleFileSelect = (selected) => {
    if (!selected) return;
    setFile(selected);
    setExtractedText('');
    setReportId(null);

    if (selected.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(selected);
    } else {
      setPreview(null);
    }

    // Auto-fill title from filename (strip extension)
    if (!title) {
      const name = selected.name.replace(/\.[^/.]+$/, '');
      setTitle(name);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  };

  const handleExtract = async () => {
    if (!file) return toast.error('Please select a file');
    if (!title.trim()) return toast.error('Please enter a title');

    try {
      const fileBase64 = await readFileAsBase64(file);
      extractMutation.mutate({ title: title.trim(), fileBase64, mimeType: file.type });
    } catch {
      toast.error('Failed to read file');
    }
  };

  const handleSave = () => {
    if (!reportId) return;
    saveMutation.mutate({ id: reportId, payload: { title: title.trim(), extractedText } });
  };

  const isExtracting = extractMutation.isPending;
  const isSaving = saveMutation.isPending;
  const hasExtracted = Boolean(reportId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate('/dashboard/reports')}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-violet-500" />
              Extract Report
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Upload an image or PDF — AI will extract the text for you
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Title */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Report Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Blood Test Report — Feb 2026"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 transition-colors"
              disabled={isExtracting}
            />
          </div>

          {/* File Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Document
            </p>

            {!file ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-violet-400 bg-violet-50 dark:bg-violet-900/10'
                    : 'border-gray-200 dark:border-gray-600 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                }`}
              >
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Drag &amp; drop or{' '}
                  <span className="text-violet-600 dark:text-violet-400">browse</span>
                </p>
                <p className="text-xs text-gray-400 mt-1.5">JPG, PNG, WEBP, or PDF</p>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30 shrink-0">
                    <File className="w-7 h-7 text-red-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {(file.size / 1024).toFixed(0)} KB · {file.type}
                  </p>
                </div>
                {!hasExtracted && (
                  <button
                    type="button"
                    onClick={() => { setFile(null); setPreview(null); }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED}
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files[0])}
            />

            {file && !hasExtracted && (
              <button
                type="button"
                onClick={handleExtract}
                disabled={isExtracting || !title.trim()}
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors shadow-sm"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Extracting text with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Extract Text
                  </>
                )}
              </button>
            )}
          </div>

          {/* Extracted Text (shown after extraction) */}
          {hasExtracted && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Extracted Text
                  <span className="ml-2 text-xs text-gray-400">(edit if needed before saving)</span>
                </p>
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
                  AI Extracted
                </span>
              </div>
              <textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                rows={16}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 resize-y transition-colors"
              />
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#04642a] hover:bg-[#035a24] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors shadow-sm"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Report
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExtractReport;
