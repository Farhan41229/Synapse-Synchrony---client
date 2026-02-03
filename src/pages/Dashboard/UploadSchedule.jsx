import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import scheduleService from '@/services/scheduleService';
import toast from 'react-hot-toast';
import { ArrowLeft, Upload, Loader2, Check, CalendarPlus } from 'lucide-react';

const UploadSchedule = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractProgress, setExtractProgress] = useState('');
  const [extractedSchedule, setExtractedSchedule] = useState(null);

  const extractMutation = useMutation({
    mutationFn: scheduleService.extractScheduleFromImage,
    onSuccess: (data) => {
      setExtractedSchedule(data.data);
      toast.success('Schedule extracted successfully!');
      setTimeout(() => {
        navigate('/dashboard/schedule');
      }, 1500);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to extract schedule');
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(null);
    setExtractedSchedule(null);
    
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else if (file) {
      toast.error('Please select a valid image file');
    }
    e.target.value = '';
  };

  const handleExtract = async () => {
    if (!selectedFile) return;
    
    setIsExtracting(true);
    setExtractProgress('Uploading image...');
    
    try {
      const reader = new FileReader();
      const base64Promise = new Promise((resolve) => {
        reader.onloadend = () => {
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(selectedFile);
      });
      
      const imageBase64 = await base64Promise;
      setExtractProgress('Analyzing schedule with AI...');
      
      await extractMutation.mutateAsync({
        imageBase64,
        mimeType: selectedFile.type,
      });
    } catch (err) {
      console.error('Extraction error:', err);
    } finally {
      setIsExtracting(false);
      setExtractProgress('');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/dashboard/schedule')}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Schedule
        </button>

        <div className="mb-6 flex items-center gap-2">
          <CalendarPlus className="w-5 h-5 text-[#04642a]" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Upload Class Schedule
          </h1>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Upload an image of your class timetable. Our AI will extract all the information and create your schedule automatically.
        </p>

        {/* Upload Section */}
        <section className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Schedule Image
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#04642a] file:text-white file:font-medium hover:file:bg-[#035a24] file:cursor-pointer"
            />
          </div>

          {previewUrl && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</h3>
              <div className="relative rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Schedule preview"
                  className="w-full h-auto object-contain max-h-96"
                />
              </div>

              <button
                type="button"
                onClick={handleExtract}
                disabled={isExtracting || extractedSchedule}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#04642a] text-white font-medium hover:bg-[#035a24] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {extractProgress || 'Extracting...'}
                  </>
                ) : extractedSchedule ? (
                  <>
                    <Check className="w-5 h-5" />
                    Schedule Extracted Successfully
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Extract Schedule
                  </>
                )}
              </button>
            </div>
          )}
        </section>

        {/* Preview Extracted Schedule */}
        {extractedSchedule && (
          <section className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              Schedule Extracted
            </h2>
            
            <div className="mb-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200">
                Your schedule has been extracted and saved! Redirecting to view schedule...
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Title:</span> {extractedSchedule.title}
              </p>
              {extractedSchedule.semester && (
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Semester:</span> {extractedSchedule.semester}
                </p>
              )}
              {extractedSchedule.section && (
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Section:</span> {extractedSchedule.section}
                </p>
              )}
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Days:</span> {extractedSchedule.weeklySchedule?.length || 0}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Total Slots:</span>{' '}
                {extractedSchedule.weeklySchedule?.reduce((sum, day) => sum + day.slots.length, 0) || 0}
              </p>
            </div>
          </section>
        )}

        {/* Instructions */}
        {!selectedFile && (
          <section className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
              Tips for best results:
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-blue-800 dark:text-blue-300">
              <li>Use a clear, high-resolution image of your schedule</li>
              <li>Ensure all text is readable and not blurry</li>
              <li>The schedule should be well-lit with good contrast</li>
              <li>Include the entire timetable in the image</li>
              <li>Remove any obstructions or overlays</li>
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default UploadSchedule;
