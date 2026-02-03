import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { createWorker } from 'tesseract.js';
import noteService from '@/services/noteService';
import toast from 'react-hot-toast';
import { ArrowLeft, ScanText, Loader2, Save } from 'lucide-react';
import TiptapEditor from '@/components/Notes/TiptapEditor';
import { plainTextToHtml } from '@/utils/noteContent';

const ImageToText = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [content, setContent] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractProgress, setExtractProgress] = useState('');
  const [title, setTitle] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [hasExtracted, setHasExtracted] = useState(false);
  const [ocrMethod, setOcrMethod] = useState('tesseract');

  const createMutation = useMutation({
    mutationFn: noteService.createNote,
    onSuccess: () => {
      toast.success('Note saved successfully!');
      navigate('/dashboard/notes');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to save note');
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(null);
    setHasExtracted(false);
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
    e.target.value = '';
  };

  const handleExtractText = async () => {
    if (!selectedFile) return;
    setIsExtracting(true);
    
    try {
      let text = '';
      
      if (ocrMethod === 'tesseract') {
        setExtractProgress('Initializing OCR…');
        const worker = await createWorker('eng');
        setExtractProgress('Extracting text from image…');
        const { data } = await worker.recognize(selectedFile);
        await worker.terminate();
        text = data?.text?.trim();
      } else {
        // Gemini OCR
        setExtractProgress('Uploading image…');
        const reader = new FileReader();
        const base64Promise = new Promise((resolve) => {
          reader.onloadend = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
          };
          reader.readAsDataURL(selectedFile);
        });
        
        const imageBase64 = await base64Promise;
        setExtractProgress('Extracting text with AI…');
        const response = await noteService.extractTextWithGemini({
          imageBase64,
          mimeType: selectedFile.type,
        });
        text = response?.data?.text?.trim();
      }
      
      if (text) {
        const html = plainTextToHtml(text);
        setContent(html);
        setHasExtracted(true);
        toast.success('Text extracted. You can edit below and save as note.');
      } else {
        setContent('');
        setHasExtracted(true);
        toast.error('No text detected in the image.');
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.message || 'OCR failed. Try another image.');
      setHasExtracted(true);
    } finally {
      setIsExtracting(false);
      setExtractProgress('');
    }
  };

  const handleSaveAsNote = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    createMutation.mutate({
      title: title.trim(),
      content: content || '<p></p>',
      visibility,
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/dashboard/notes')}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Notes
        </button>

        <div className="mb-6 flex items-center gap-2">
          <ScanText className="w-5 h-5 text-[#04642a]" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Extract text from image
          </h1>
        </div>

        {/* Image input & preview */}
        <section className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
          {/* OCR Method Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Extraction Method
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="inline-flex items-start gap-2 cursor-pointer flex-1">
                <input
                  type="radio"
                  name="ocrMethod"
                  value="tesseract"
                  checked={ocrMethod === 'tesseract'}
                  onChange={(e) => setOcrMethod(e.target.value)}
                  className="text-[#04642a] focus:ring-[#04642a] mt-1"
                />
                <div>
                  <span className="text-gray-900 dark:text-white font-medium">Tesseract (Fast)</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Best for printed text, free, client-side</p>
                </div>
              </label>
              <label className="inline-flex items-start gap-2 cursor-pointer flex-1">
                <input
                  type="radio"
                  name="ocrMethod"
                  value="gemini"
                  checked={ocrMethod === 'gemini'}
                  onChange={(e) => setOcrMethod(e.target.value)}
                  className="text-[#04642a] focus:ring-[#04642a] mt-1"
                />
                <div>
                  <span className="text-gray-900 dark:text-white font-medium">Gemini AI (Accurate)</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Better for handwriting, uses API quota</p>
                </div>
              </label>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#04642a] file:text-white file:font-medium hover:file:bg-[#035a24]"
          />
          {previewUrl && (
            <div className="mt-4 flex flex-wrap items-start gap-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-40 rounded-lg border border-gray-200 dark:border-gray-600 object-contain"
              />
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleExtractText}
                  disabled={isExtracting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#04642a] text-white font-medium hover:bg-[#035a24] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {extractProgress || 'Extracting…'}
                    </>
                  ) : (
                    <>
                      <ScanText className="w-4 h-4" />
                      Extract text
                    </>
                  )}
                </button>
                {extractProgress && !isExtracting && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">{extractProgress}</span>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Tiptap editor */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Extracted text</h2>
          <TiptapEditor
            content={content}
            onChange={setContent}
            placeholder="Extracted text will appear here. Select an image and click Extract text."
            minHeight="200px"
          />
        </section>

        {/* Save as note */}
        <section className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Save as note</h2>
          <form onSubmit={handleSaveAsNote} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#04642a] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Visibility</label>
              <div className="flex gap-4">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={visibility === 'private'}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="text-[#04642a] focus:ring-[#04642a]"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Private</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={visibility === 'public'}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="text-[#04642a] focus:ring-[#04642a]"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Public</span>
                </label>
              </div>
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#04642a] text-white font-medium hover:bg-[#035a24] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {createMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save as note
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ImageToText;
