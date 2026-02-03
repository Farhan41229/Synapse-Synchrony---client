import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import noteService from '@/services/noteService';
import toast from 'react-hot-toast';
import { ArrowLeft, Send, Sparkles, Loader2 } from 'lucide-react';
import TiptapEditor from '@/components/Notes/TiptapEditor';

const plainTextToHtml = (text) => {
  if (!text || !text.trim()) return '<p></p>';
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim());
  if (paragraphs.length === 0) return '<p></p>';
  const html = paragraphs
    .map((p) => '<p>' + p.replace(/\n/g, '<br/>') + '</p>')
    .join('');
  return html;
};

const CreateNote = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const createMutation = useMutation({
    mutationFn: noteService.createNote,
    onSuccess: (data) => {
      toast.success('Note created successfully!');
      navigate('/dashboard/notes');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create note');
    },
  });

  const handleGenerateAI = async () => {
    if (!title.trim()) {
      toast.error('Enter a title first');
      return;
    }
    setIsGeneratingAI(true);
    try {
      const response = await noteService.generateNoteWithAI({ title: title.trim() });
      const text = response?.data?.content;
      if (text) {
        const html = plainTextToHtml(text);
        setContent(html);
        toast.success('Content generated! You can edit it below.');
      } else {
        toast.error('No content generated');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate content');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = (e) => {
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
          <Sparkles className="w-5 h-5 text-[#04642a]" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Create Note
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:border-[#04642a] focus:outline-none transition-all"
              required
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={isGeneratingAI || !title.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#04642a] text-white font-medium hover:bg-[#15a33d] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingAI ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Generate with AI
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Uses the title to generate plain text content
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content
            </label>
            <TiptapEditor
              content={content}
              onChange={setContent}
              placeholder="Write your note..."
              editable={true}
              minHeight="280px"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Visibility
            </label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full max-w-xs px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:border-[#04642a] focus:outline-none"
            >
              <option value="private">Private (only you)</option>
              <option value="public">Public</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all disabled:opacity-50"
            >
              {createMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              Create Note
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard/notes')}
              className="px-6 py-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNote;
