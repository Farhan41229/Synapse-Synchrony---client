import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import noteService from '@/services/noteService';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Sparkles, Loader2, AlertCircle } from 'lucide-react';
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

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const { data: noteData, isLoading, error } = useQuery({
    queryKey: ['note', id],
    queryFn: () => noteService.getNoteById(id),
    enabled: !!id,
  });

  const note = noteData?.data;

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setVisibility(note.visibility || 'private');
    }
  }, [note]);

  const updateMutation = useMutation({
    mutationFn: ({ noteId, data }) => noteService.updateNote(noteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['note', id]);
      queryClient.invalidateQueries(['myNotes']);
      toast.success('Note updated successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update note');
    },
  });

  const handleGenerateAI = async () => {
    const titleToUse = title.trim();
    if (!titleToUse) {
      toast.error('Enter a title first');
      return;
    }
    setIsGeneratingAI(true);
    try {
      const response = await noteService.generateNoteWithAI({ title: titleToUse });
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
    if (!id) return;
    updateMutation.mutate({
      noteId: id,
      data: {
        title: title.trim(),
        content: content || '<p></p>',
        visibility,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#04642a]" />
      </div>
    );
  }

  if (error || !note) {
    const msg = error?.response?.status === 403
      ? 'You do not have access to this note'
      : 'Note not found';
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4 flex flex-col items-center justify-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-gray-700 dark:text-gray-300 mb-4">{msg}</p>
        <button
          onClick={() => navigate('/dashboard/notes')}
          className="text-[#04642a] hover:underline"
        >
          Back to My Notes
        </button>
      </div>
    );
  }

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
            Edit Note
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
              Overwrites content with AI-generated text from title
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
              disabled={updateMutation.isPending}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Save Changes
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

export default EditNote;
