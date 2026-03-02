import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { medicineScheduleService } from '@/services/medicineScheduleService';
import toast from 'react-hot-toast';
import {
  Pill,
  ScanLine,
  Upload,
  File,
  X,
  Loader2,
  ChevronLeft,
  Save,
  Stethoscope,
  User,
  CalendarDays,
  Building2,
} from 'lucide-react';

const ACCEPTED = 'image/jpeg,image/png,image/webp,image/gif,application/pdf';

const ExtractMedicineSchedule = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [extracted, setExtracted] = useState(null); // { hospital, doctor, date, diagnosis, medicines[] }
  const [scheduleId, setScheduleId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const extractMutation = useMutation({
    mutationFn: ({ title, fileBase64, mimeType }) =>
      medicineScheduleService.extractAndSave(title, fileBase64, mimeType),
    onSuccess: (res) => {
      const schedule = res.data;
      setExtracted({
        hospital: schedule.hospital,
        doctor: schedule.doctor,
        date: schedule.date,
        diagnosis: schedule.diagnosis,
        medicines: schedule.medicines,
      });
      setScheduleId(schedule._id);
      queryClient.invalidateQueries({ queryKey: ['my-medicine-schedules'] });
      toast.success('Prescription extracted successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Extraction failed');
    },
  });

  const readFileAsBase64 = (f) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(f);
    });

  const handleFileSelect = (selected) => {
    if (!selected) return;
    setFile(selected);
    setExtracted(null);
    setScheduleId(null);

    if (selected.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(selected);
    } else {
      setPreview(null);
    }

    if (!title) {
      setTitle(selected.name.replace(/\.[^/.]+$/, ''));
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

  const isExtracting = extractMutation.isPending;
  const hasExtracted = Boolean(scheduleId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate('/dashboard/medicine')}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ScanLine className="w-6 h-6 text-blue-500" />
              Extract Prescription
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Upload a prescription or case sheet — AI will extract your medicine list
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Title */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prescription Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Viral Fever — Aug 2023"
              disabled={isExtracting}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-colors"
            />
          </div>

          {/* File Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Document</p>

            {!file ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/10'
                    : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                }`}
              >
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Drag &amp; drop or{' '}
                  <span className="text-blue-600 dark:text-blue-400">browse</span>
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
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
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
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm transition-colors shadow-sm"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Extracting prescription with AI...
                  </>
                ) : (
                  <>
                    <ScanLine className="w-4 h-4" />
                    Extract Medicines
                  </>
                )}
              </button>
            )}
          </div>

          {/* Extracted Result */}
          {hasExtracted && extracted && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 overflow-hidden">
              {/* Result header */}
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Pill className="w-4 h-4 text-blue-500" />
                  Extracted Prescription
                </p>
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  AI Extracted
                </span>
              </div>

              {/* Meta */}
              <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-gray-100 dark:border-gray-700/60">
                {extracted.hospital && (
                  <div className="flex items-start gap-2.5">
                    <Building2 className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Hospital</p>
                      <p className="text-sm text-gray-900 dark:text-white">{extracted.hospital}</p>
                    </div>
                  </div>
                )}
                {extracted.doctor && (
                  <div className="flex items-start gap-2.5">
                    <User className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Doctor</p>
                      <p className="text-sm text-gray-900 dark:text-white">{extracted.doctor}</p>
                    </div>
                  </div>
                )}
                {extracted.date && (
                  <div className="flex items-start gap-2.5">
                    <CalendarDays className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Date</p>
                      <p className="text-sm text-gray-900 dark:text-white">{extracted.date}</p>
                    </div>
                  </div>
                )}
                {extracted.diagnosis && (
                  <div className="flex items-start gap-2.5">
                    <Stethoscope className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Diagnosis</p>
                      <p className="text-sm text-gray-900 dark:text-white">{extracted.diagnosis}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Medicines table */}
              <div className="px-6 py-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Medicines ({extracted.medicines?.length || 0})
                </p>
                {extracted.medicines?.length > 0 ? (
                  <div className="space-y-2">
                    {extracted.medicines.map((med, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700/50"
                      >
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5 w-5 shrink-0">
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{med.name}</p>
                          <div className="flex flex-wrap gap-2 mt-1.5">
                            {med.dosage && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                {med.dosage}
                              </span>
                            )}
                            {med.duration && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                {med.duration}
                              </span>
                            )}
                            {med.notes && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                                {med.notes}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No medicines were extracted.</p>
                )}
              </div>

              {/* Save */}
              <div className="px-6 pb-6">
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/medicine/${scheduleId}`)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#04642a] hover:bg-[#035a24] text-white font-medium text-sm transition-colors shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  View &amp; Save Prescription
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExtractMedicineSchedule;
